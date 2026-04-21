# Élite Marketplace

A dark-themed **React Native (Expo)** client for browsing a luxury marketplace: vehicles, jets, yachts, jewelry, and furniture. Catalog data is loaded from local JSON under `db/`. Authentication is session-based with optional persistence on device; sign-in validates against `db/Users.json` plus locally registered accounts stored in AsyncStorage.

## Features

- **Home** — Featured, trending, and new arrivals driven by `db/*.json` via `src/data/catalogFromDb.ts`.
- **Explore** — Category list, per-category items with sort (default, name, year, value), list/grid toggle, swipeable image previews, and a full-screen item detail modal.
- **Wishlist** — Per-session wishlist (in-memory) with counts reflected on Profile.
- **Profile** — Guest onboarding UI, sign-in / sign-up modal (email or username + password), Google placeholder alert, and a signed-in profile with activity stats and logout (with confirmation).
- **Global header** — Search, notifications toast, and **Log in · Sign up** when signed out or profile shortcut when signed in.

## Tech stack

| Layer | Choice |
|--------|--------|
| Runtime | [Expo SDK 54](https://docs.expo.dev/) |
| UI | React Native 0.81, React 19 |
| Language | TypeScript (strict) |
| Icons | `@expo/vector-icons` (Ionicons, MaterialCommunityIcons) |
| Persistence | `@react-native-async-storage/async-storage` (session + local signups) |

## Requirements

- **Node.js** LTS (recommended 20+)
- **npm** or **yarn**
- For physical devices: **Expo Go** matching **SDK 54** (see [Expo Go compatibility](https://docs.expo.dev/get-started/expo-go/))

## Getting started

```bash
cd /path/to/Elite
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go. For web:

```bash
npm run web
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro / Expo dev server |
| `npm run ios` | Start and open iOS |
| `npm run android` | Start and open Android |
| `npm run web` | Run in the browser |

## Project layout

```
Elite/
├── App.tsx                 # Root shell: auth provider, tabs, modals, header
├── app.json                # Expo app config (name, slug, dark UI)
├── db/                     # Local JSON “database” (bundled at build time)
│   ├── Users.json          # Auth users (not listed as Explore categories)
│   ├── Vehicles.json
│   ├── Jets.json
│   ├── Yachts.json
│   ├── Jewelry.json
│   └── Furniture.json
└── src/
    ├── auth/               # AuthContext, credential helpers
    ├── components/         # AppHeader, ToastCard, SectionTitle
    ├── data/               # dbCategories, catalogFromDb
    ├── modals/             # Search, detail, auth
    ├── navigation/         # TabRouter, BottomNav
    ├── screens/            # Home, Explore, Wishlist, Profile
    │   └── explore/        # Category list/items, detail modal, sort utils
    ├── styles/             # appStyles, exploreStyles, profileStyles, authModalStyles
    ├── types/              # marketplace + session profile types
    └── utils/              # e.g. sortDbItems
```

## Data and auth

- **Listings** come from `db/` JSON. Editing those files and reloading the app updates catalog and Explore (bundled imports).
- **`db/Users.json`** powers **login only** (email or username, case-insensitive identifier; password must match the stored string). User accounts are **not** exposed as an Explore category.
- **New sign-ups** from the app are appended to **AsyncStorage** (`elite_local_users_v1`) and merged with JSON users for login. This is for local/demo use until a real backend exists.
- **Session** is stored under `elite_session_v1` as `{ userId }`. Clear app data or log out to reset.

Treat `Users.json` as sensitive in real deployments; use a server and hashed passwords for production.

## Typecheck

```bash
npx tsc --noEmit
```

## License

Private project (`"private": true` in `package.json`). Adjust as needed if you publish or open-source the repo.
