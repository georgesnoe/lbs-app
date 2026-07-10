# LBS App — Lomé Business School

Cross-platform schedule management and room availability tracking application for **Lomé Business School**. Students can view their weekly timetable in real time, check which rooms are free, and receive reminder notifications.

## Project Structure

```
lbs-app/
├── mobile/          # Mobile app (Expo / React Native)
├── web/             # Web app (Next.js)
├── .github/         # CI/CD workflows
└── README.md
```

| Directory | Tech Stack                                 | Description        |
| --------- | ------------------------------------------ | ------------------ |
| `mobile/` | Expo SDK 57, React Native 0.86, TypeScript | iOS & Android app  |
| `web/`    | Next.js 16, React 19, Tailwind CSS 4       | Web app (upcoming) |

## Features

- **Interactive Schedule** — Weekly course timetable filtered by academic level with week navigation
- **Available Rooms** — Real-time display of free rooms with next upcoming course info
- **Persistent Settings** — Default level, navigation style, notification toggles
- **Day-Only Mode** — Switch between week view and today-only view

## Quick Start

```bash
# Mobile
cd mobile
npm install
npx expo start

# Web
cd web
npm install
npm run dev
```

## License

Proprietary — Lomé Business School.
