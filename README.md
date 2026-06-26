<div align="center">

<img src="assets/logo.png" alt="Academia logo" width="120" />

# Academia

### Your campus, in your pocket

A cross-platform student portal that brings the entire campus experience — grades, schedules, exams, payments, attendance, community and more — into a single Flutter app.

[![Flutter](https://img.shields.io/badge/Flutter-3.8+-02569B?logo=flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.8+-0175C2?logo=dart&logoColor=white)](https://dart.dev)
[![State Management](https://img.shields.io/badge/State-flutter__bloc-13B9FD)](https://bloclibrary.dev)
[![Platforms](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web%20%7C%20Desktop-555)](#-platform-support)
[![License](https://img.shields.io/badge/License-Unspecified-lightgrey)](#-license)

</div>

---

## 📖 Overview

**Academia** is a feature-rich mobile application that acts as a digital companion for university students. It connects to a dedicated backend (the College System API) and lets students manage their entire academic life from one place: viewing grades and GPA, registering for courses, checking exam timetables, scanning attendance QR codes, paying invoices, browsing study materials, chatting with a campus FAQ assistant, and engaging with the student community — all wrapped in a polished, responsive UI with full **dark mode** and **English / Arabic (RTL)** support.

> Originally built as a graduation project, the app demonstrates a clean, scalable, feature-first architecture backed by real-time notifications, biometric security, and a production-grade networking layer.

---

## ✨ Features

| Area | What it does |
| --- | --- |
| 🔐 **Authentication** | Email/password login with JWT access tokens and an HTTP-only refresh-token cookie. Sessions are restored automatically on launch and silently refreshed on `401`. |
| 🧬 **Biometric App Lock** | On returning sessions, the app is gated behind device biometrics (fingerprint / Face ID) or the device passcode via `local_auth`. |
| 🏠 **Home Dashboard** | At-a-glance profile card, quick actions, recent grades, upcoming exams, attendance, tasks, payments and notification previews. |
| 📚 **Courses & Grades** | Browse enrolled courses, per-course grade breakdowns and a GPA summary. |
| ➕ **Course Registration** | View available offerings, register for courses and labs, pick groups, and drop courses — with a live registered-courses table. |
| 📝 **Exams Dashboard** | Filterable exam schedule with detailed exam cards. |
| 🗓️ **Class Schedule** | Weekly timetable rendered as both a grid view and a list view. |
| 📄 **Study Materials** | Searchable material library with in-app PDF viewing and downloads. |
| 🪪 **Digital Student ID** | A digital ID card (front/back) with privileges table and QR code. |
| ✅ **Attendance** | Scan session QR codes to mark attendance, view active sessions and full attendance history. |
| 💳 **Payments** | View invoices and outstanding balances and pay online through an embedded Paymob checkout. |
| 🏆 **Leaderboard** | Ranks students to add a gamified, competitive layer. |
| 👥 **Community** | Social feed with posts, likes and comments, plus suggested/your study groups. |
| 🗂️ **Tasks** | View available tasks and submit assignments. |
| 🤖 **Chatbot / FAQ** | Category-based campus FAQ assistant (e.g. admissions, registration). |
| 🔔 **Notifications** | Real-time delivery via **Socket.IO** + **Firebase Cloud Messaging** push, surfaced through system-tray local notifications with an unread badge. |
| ⚙️ **Settings** | Toggle theme, switch language, edit profile, change password and log out. |

---

## 🏗️ Architecture

The project follows a **feature-first** layout with a clean separation between the shared **core** layer and self-contained **features**. Each feature owns its own UI, state, models and data access.

```
lib/
├── main.dart                 # App bootstrap: Firebase, FCM, notifications, cookie jar
├── firebase_options.dart     # Generated FlutterFire config
│
├── core/                     # Cross-cutting infrastructure
│   ├── appCubit/             # Global app state (theme, locale)
│   ├── constants/            # Constants + API endpoints
│   ├── data/
│   │   ├── local/            # Hive + SharedPreferences helpers
│   │   └── network/          # Dio ApiClient, exceptions
│   ├── routing/              # go_router routes & configuration
│   ├── services/             # Local (biometric) auth service
│   ├── styles/               # Colors, fonts, text styles, assets
│   ├── utils/                # Shared components
│   └── widgets/              # Reusable widgets
│
├── features/                 # One folder per feature
│   └── <feature>/
│       ├── cubit/            # Cubit + states (flutter_bloc)
│       ├── models/           # Data models
│       ├── repo/             # Repository (talks to ApiClient)
│       ├── widgets/          # Feature-specific widgets
│       └── <feature>_screen.dart
│
├── layout/                   # Bottom-nav shell (Home / Courses / Register / Exams / Profile)
└── generated/                # Localization (intl) generated code
```

**Per-feature pattern:** `Screen → Cubit (state) → Repo (data) → ApiClient (network)`. This keeps UI declarative, business logic testable, and networking centralized.

### Networking layer

A single, well-documented `ApiClient` (Dio) singleton powers all HTTP traffic:

- **Two Dio instances** — a main authenticated client and a dedicated, token-less client used only for `/auth/refresh`.
- **Automatic token refresh** — an interceptor catches `401`s, refreshes the access token once, and transparently retries the original request (with concurrent-refresh de-duplication).
- **Persistent cookie jar** — the refresh-token cookie is stored on disk (`PersistCookieJar`) so sessions survive app restarts.
- **Typed errors** via `ApiException`, and a `uploadFile` helper for multipart uploads.

### Real-time notifications

`main.dart` wires up a robust notification pipeline:

- **Socket.IO** (`WebSocketService`) streams `new-notification` and `unread-count` events, authenticating over a JWT auth map.
- **Firebase Cloud Messaging** handles foreground, background (top-level isolate handler) and cold-start taps.
- **flutter_local_notifications** renders system-tray notifications for data-only payloads on every path.

---

## 🧰 Tech Stack

| Concern | Package(s) |
| --- | --- |
| **Framework** | Flutter (Dart SDK `^3.8.1`), Material 3 |
| **State management** | `flutter_bloc` (Cubit) |
| **Navigation** | `go_router` |
| **Networking** | `dio`, `dio_cookie_manager`, `cookie_jar` |
| **Local storage** | `hive` / `hive_flutter`, `shared_preferences`, `flutter_secure_storage` |
| **Responsive UI** | `flutter_screenutil` (390×844 design baseline) |
| **Localization** | `flutter_localizations`, `intl`, `intl_utils` (EN + AR) |
| **Notifications** | `firebase_core`, `firebase_messaging`, `flutter_local_notifications`, `socket_io_client` |
| **Media & files** | `cached_network_image`, `image_picker`, `flutter_cached_pdfview`, `url_launcher` |
| **Device features** | `mobile_scanner` (QR), `geolocator`, `local_auth`, `webview_flutter` |
| **Payments** | Paymob (via embedded WebView) |
| **Tooling** | `build_runner`, `hive_generator`, `flutter_launcher_icons`, `flutter_lints` |

---

## 🚀 Getting Started

### Prerequisites

- **Flutter SDK** 3.8 or newer ([install guide](https://docs.flutter.dev/get-started/install))
- **Dart** 3.8+ (bundled with Flutter)
- A configured editor (VS Code / Android Studio) with the Flutter & Dart plugins
- For mobile builds: Android SDK (min SDK **21**) and/or Xcode

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd college_project

# 2. Install dependencies
flutter pub get

# 3. (If you change models/Hive types or localization) regenerate code
dart run build_runner build --delete-conflicting-outputs
flutter pub run intl_utils:generate

# 4. Run the app
flutter run
```

### Firebase setup

The app uses Firebase Cloud Messaging. A generated `lib/firebase_options.dart` is included, but for your own backend you should configure your own Firebase project:

```bash
dart pub global activate flutterfire_cli
flutterfire configure
```

This regenerates `firebase_options.dart` and the platform config files (`google-services.json` / `GoogleService-Info.plist`).

### Backend configuration

API base URLs live in [`lib/core/constants/endpoints.dart`](lib/core/constants/endpoints.dart):

```dart
static const String baseUrl =
    "https://college-system-backend.onrender.com/api/v1";

static const String notificationsSocketIO =
    "https://college-system-backend.onrender.com";
```

Point these at your own deployment of the College System backend to run against a different server.

---

## 🌍 Localization

The app ships with **English** and **Arabic** translations defined in `lib/l10n/intl_en.arb` and `lib/l10n/intl_ar.arb`. Arabic enables full **RTL** layout automatically. The active language is persisted via `SharedPreferences` and can be switched at runtime from Settings.

To add or edit strings, update the `.arb` files and regenerate:

```bash
flutter pub run intl_utils:generate
```

---

## 🎨 Theming

- **Material 3** with a seeded color scheme derived from the brand primary color.
- **Light & dark themes** with custom surfaces; the choice is persisted and toggled at runtime via `AppCubit`.
- **Poppins** as the global font family.
- Responsive sizing through `flutter_screenutil` against a `390×844` design baseline.

---

## 📱 Platform Support

| Platform | Status |
| --- | --- |
| Android | ✅ Primary target (min SDK 21, app label **Academia**) |
| iOS | ✅ Supported |
| Web | ✅ Project configured |
| Windows / macOS / Linux | ✅ Project configured |

> Mobile (Android/iOS) is the primary target; biometric lock, QR scanning, push notifications and camera features are best experienced there.

---

## 🛠️ Useful Commands

```bash
flutter pub get                  # Fetch dependencies
flutter run                      # Run on a connected device/emulator
flutter analyze                  # Static analysis / lints
flutter test                     # Run tests
flutter build apk --release      # Build Android APK
flutter build appbundle          # Build Android App Bundle
flutter build ios                # Build iOS (on macOS)
dart run build_runner build --delete-conflicting-outputs   # Codegen (Hive, etc.)
```

---

## 📂 Project Structure (top level)

```
college_project/
├── lib/                # Application source (see Architecture above)
├── assets/             # Logo, data (chatbot FAQ JSON)
├── android/ ios/ web/  # Platform projects
├── windows/ macos/ linux/
├── pubspec.yaml        # Dependencies & asset declarations
└── shorebird.yaml      # Code-push (Shorebird) configuration
```

---

## 🤝 Contributing

Contributions are welcome! To propose a change:

1. Fork the repository and create a feature branch.
2. Follow the existing **feature-first** structure (`screen → cubit → repo → ApiClient`).
3. Run `flutter analyze` and ensure the app builds before opening a PR.
4. Keep UI strings in the `.arb` localization files (no hard-coded user-facing text).

---

## 📜 License

No license file is currently included in this repository. If you intend to open-source the project, add a `LICENSE` file (for example, MIT) to clarify usage rights.

---

<div align="center">

Built with ❤️ and **Flutter**.

</div>
