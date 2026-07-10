# LBS Mobile — Lomé Business School

Mobile schedule management and room availability app for **Lomé Business School**, built with **Expo SDK 57** and **React Native 0.86**.

## Tech Stack

| Technology                                                                     | Version | Usage                                                           |
| ------------------------------------------------------------------------------ | ------- | --------------------------------------------------------------- |
| [Expo](https://expo.dev)                                                       | SDK 57  | React Native framework                                          |
| [Expo Router](https://docs.expo.dev/router/introduction/)                      | ~57.0.4 | File-based routing                                              |
| [@expo/ui](https://docs.expo.dev/ui/introduction/)                             | ~57.0.4 | Native cross-platform components (Host, Picker, Switch, Button) |
| [@expo/vector-icons](https://docs.expo.dev/guides/icons/)                      | ^15.0.2 | Ionicons                                                        |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)    | 2.2.0   | Settings persistence                                            |
| [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | ~57.0.3 | Push notifications                                              |
| TypeScript                                                                     | ~6.0    | Strict typing                                                   |

## Architecture

```
src/
├── app/                     # Pages (Expo Router)
│   ├── _layout.tsx          # Root layout (Stack)
│   ├── index.tsx            # Redirect → /(tabs)/calendar
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigation (NativeTabs)
│       ├── calendar.tsx     # Schedule screen
│       ├── rooms.tsx        # Available rooms screen
│       └── settings.tsx     # Settings screen
├── components/
│   ├── LiveRooms.tsx        # Real-time free room list
│   └── planning/
│       ├── index.ts         # Barrel exports
│       ├── DayGroup.tsx     # Day-grouped events
│       ├── EventCard.tsx    # Individual event card (API colors)
│       └── LevelSelector.tsx# Level picker (native Picker)
├── hooks/
│   ├── use-schedule-data.ts # Fetches schedule data from API
│   └── useSettings.ts       # Settings management (AsyncStorage)
├── types/
│   ├── schedule.ts          # ScheduleEvent, RoomInfo, DayGroup types
│   ├── settings.ts          # AppSettings interface + defaults
│   └── levels.ts            # Static ALL_LEVELS list + hasLevelEvents helper
└── utils/
    └── schedule.ts          # Utility functions (dates, API, rooms)
```

## Features

### 📅 Schedule (`calendar.tsx`)

- Level selection across 23 levels (Bachelor 1 to Master 2)
- Weekly navigation with ← → arrow buttons
- "Today" button to jump back to the current week
- **Week / Today** toggle switch
- Pull-to-refresh
- Dynamic course colors from the API (`backgroundColor` / `textColor` fields)

### 🏫 Available Rooms (`LiveRooms.tsx`)

- Real-time free room list (refreshes every 10 seconds)
- Multi-room event detection for shared courses
- Auto-filter after 9:30 PM (all rooms shown as free)
- Next course limited to the current day only
- 2-column grid layout

### ⚙️ Settings (`settings.tsx`)

- **Navigation style**: Arrows / Week picker / Both
- **Free navigation**: on/off toggle
- **Default level**: auto-selected on app launch
- **Notifications**: enable/disable

## API

**Base URL**: `https://allnone.lome-bs.com/planning-view/student/schedules`

**Query parameters**:

- `start` — Start date (YYYY-MM-DD, Monday of the week)
- `end` — End date (YYYY-MM-DD, Sunday of the week)

The `useScheduleData` hook accepts a `weekOffset` parameter for week navigation.

### Event structure (ScheduleEvent)

| Field                       | Type                            | Description                                |
| --------------------------- | ------------------------------- | ------------------------------------------ |
| `id`                        | `string`                        | Unique identifier                          |
| `title`                     | `string`                        | Course title                               |
| `start` / `end`             | `string`                        | ISO 8601                                   |
| `backgroundColor`           | `string`                        | Background color (hex) — used in EventCard |
| `textColor`                 | `string`                        | Text color (hex)                           |
| `extendedProps.room`        | `string`                        | Primary room                               |
| `extendedProps.rooms`       | `string[]`                      | All rooms for this event                   |
| `extendedProps.levelsCodes` | `string`                        | Level codes separated by ", "              |
| `extendedProps.sessionType` | `"course" \| "resit" \| "exam"` | Session type                               |
| `extendedProps.teacher`     | `string`                        | Teacher name                               |

## Installation

```bash
cd mobile
npm install
npx expo start
```

Launch on a specific device:

```bash
npx expo start --android     # Android
npx expo start --ios         # iOS (macOS required)
npx expo start --web         # Web
```

## Build

```bash
# Android
npx expo run:android --variant release

# iOS
npx expo run:ios --configuration Release
```

Automated builds are triggered via GitHub Actions on `v*` and `v*-nightly` tags (see `.github/workflows/release.yaml`).

## Available Scripts

| Script            | Description           |
| ----------------- | --------------------- |
| `npm start`       | Start Expo dev server |
| `npm run android` | Launch on Android     |
| `npm run ios`     | Launch on iOS         |
| `npm run web`     | Launch in browser     |
| `npm run lint`    | Lint code with ESLint |

## Theme & Styles

- Background: `#F2F2F7` (iOS light gray)
- Cards: white background, rounded corners (`borderRadius: 12`), subtle shadow
- Accent: `#0A84FF` (iOS blue)
- API colors: dynamically used for course cards (12% opacity background, 25% opacity time pill)

## Persistence

Settings are stored in AsyncStorage under the key `@lbs/settings` and persist:

- Default level
- Navigation style
- Notification state
- Theme preference

## Key Configuration Files

- `app.json` — App name, slug, icons, plugins (splash screen, fonts)
- `tsconfig.json` — Path aliases (`@/` → `./src/`, `@/assets/` → `./assets/`)
- `expo-env.d.ts` — Generated types for Expo Router routes
