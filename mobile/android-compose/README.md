# LMRA Android App

Android application built with Kotlin and Jetpack Compose for the Legacy Modernization Reference Application.

## Features

- Modern UI with Jetpack Compose
- MVVM Architecture
- API integration with backend services
- Offline support with Room
- Material Design 3

## Technologies

- **Language**: Kotlin
- **UI**: Jetpack Compose
- **Architecture**: MVVM
- **Networking**: Ktor / Retrofit
- **Local Storage**: Room
- **DI**: Hilt
- **Async**: Coroutines & Flow

## Modern Android Features

This app demonstrates migration from:
- XML Layouts → Jetpack Compose
- Java → Kotlin
- AsyncTask → Coroutines
- Traditional Views → Compose UI

## Setup

1. Open in Android Studio
2. Sync Gradle
3. Update API endpoints in `Config.kt`
4. Run the app

## Architecture

```
app/
├── data/
│   ├── api/          # API clients
│   ├── database/     # Room entities
│   └── repository/   # Data repositories
├── domain/
│   ├── model/        # Domain models
│   └── usecase/      # Business logic
├── presentation/
│   ├── screens/      # Compose screens
│   ├── viewmodel/    # ViewModels
│   └── components/   # Reusable components
└── di/               # Dependency injection
```

## Legacy vs Modern

### Before (Legacy)
- Java and XML layouts
- Activities and Fragments
- RecyclerView with ViewHolders
- AsyncTask for network calls
- SQLite with raw SQL

### After (Modern)
- Kotlin and Jetpack Compose
- Declarative UI
- LazyColumn for lists
- Coroutines and Flow
- Room for database access

