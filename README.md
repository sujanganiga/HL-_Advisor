# HDFC Life Advisor (Expo React Native)

A small Expo React Native app for HDFC Life advisors: browse policies, file a
claim with a hospital-bill photo, view branches on a map, and manage local
advisor settings.

## Running the app

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android), or press `a` / `i` in the
terminal to open an Android emulator / iOS simulator. `react-native-maps`
requires Google Play services on Android, so a device or an emulator with
Play Services is recommended for the Map tab.

## Tab map

| Tab      | Screens (stack)                          | What it does                                                      |
|----------|-------------------------------------------|---------------------------------------------------------------------|
| Policies | `PoliciesList` → `PolicyDetail`           | Lists the six seed policies; tap a row to see its detail            |
| Claim    | `ClaimForm` → `HospitalBill`              | File a claim, then attach a hospital bill photo                     |
| Map      | `BranchMap`                                | Shows the Mumbai branch and (optionally) your current location      |
| Settings | `Settings`                                 | AsyncStorage / SecureStore demo, network demo, deep-link notes      |

## Deep link

Scheme: `hdfclife`

Example URL:

```
hdfclife://policy/HDFC-LIFE-1004
```

Opening this URL (e.g. via `xcrun simctl openurl booted hdfclife://policy/HDFC-LIFE-1004`
or `adb shell am start -a android.intent.action.VIEW -d "hdfclife://policy/HDFC-LIFE-1004"`,
or by typing it into Expo Go's "Enter URL manually" box while the dev server
is running) navigates straight to the **Policy Detail** screen for
HDFC-LIFE-1004 — the same screen and text you'd see by tapping that row in
the Policies list.

## AsyncStorage vs SecureStore

For an advisor app, the two stores serve different jobs. **AsyncStorage**
is unencrypted, app-sandboxed key/value storage, so it's the right place for
data that's convenient but not sensitive: the advisor's display name, a
locally cached list of submitted claims, or other UI preferences. It's fast
and simple, but readable by anything with access to the app's storage on a
rooted/jailbroken device, so it should never hold credentials or anything
that could identify a customer's financial details on its own.
**SecureStore** wraps the platform keychain (iOS Keychain / Android Keystore),
so it's encrypted at rest and meant for small secrets: auth tokens, session
identifiers, or API keys the advisor app uses to authenticate against HDFC
Life's backend. In this app the advisor token (`hdfc.advisorToken`) lives in
SecureStore for exactly that reason, while the advisor's name and claims
history live in AsyncStorage.

## Local vs push notifications

**Local notifications** are scheduled entirely on-device — the app itself
decides when to fire one (here, right after a claim is submitted) and no
network round-trip or backend is involved. They work great for immediate,
in-app feedback like "your claim was submitted." **Push notifications**
are sent from a server to a device that may not even have the app open;
they require the app to register with a push service (APNs on iOS, FCM on
Android, or Expo's push service as a wrapper around both), obtain and send
a device push token to your backend, and have a server component that calls
that push service's API to actually deliver the notification. Push is what
you'd want for things happening on HDFC Life's servers that the device
doesn't otherwise know about — e.g., "your claim was approved by the back
office" — where the phone has no local trigger to react to.

## Native modules — when Expo isn't enough

You'd reach for a native module when the app needs a device capability that
Expo's managed SDK simply doesn't expose an API for — for example, a
proprietary biometric SDK from a hardware vendor, deep integration with a
company's MDM/enterprise agent, custom Bluetooth Low Energy profiles beyond
what `expo-bluetooth`-style libraries cover, or performance-critical native
image/video processing that needs direct platform APIs. It's also the right
call when you must link a closed-source native SDK (e.g., a bank's own
fraud-detection or hardware-attestation library) that ships as a native
`.aar`/`.framework` rather than a JS package, since Expo Go / a plain Expo
managed build can't load arbitrary native code without a custom dev client
or a bare workflow eject.

## Notes

- Policy data is served entirely from `data/policies.json`, committed to
  the repo as the source of truth — no live HDFC API is called.
- The only outbound network call is to `jsonplaceholder.typicode.com`,
  used purely to demonstrate the loading / success / error states on the
  Settings screen.
- `expo-image-picker`, `expo-location`, and `expo-notifications` all
  request permission before use and degrade to a visible message (never a
  crash) if permission is denied.
