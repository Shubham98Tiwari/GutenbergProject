# Gutenberg Project

A responsive React Native application built for the Ignite Solutions Mobile Developer assessment.

The application allows users to browse books from Project Gutenberg by genre, search for books by title or author, save books for quick access, and open available book editions in the browser.

The implementation follows the provided Gutenberg Project responsive design and uses the hosted Gutendex API provided by Ignite Solutions.

---

## Features

- Browse books by genre
- Search books by title or author
- Preserve the selected genre while searching
- Infinite scrolling / pagination
- Book cover grid
- Save and remove books from the saved-books shelf
- Pull-to-refresh
- Open books in the browser
- HTML → PDF → TXT format fallback
- Loading states
- Empty states
- Network/API error states
- Retry actions
- Responsive grid layout
- Portrait and landscape support
- Safe-area handling
- Accessibility labels for interactive controls
- Centralized UI copy for future localization
- Centralized theme/color structure
- Global error boundary with recovery UI

---

## Screens

### Home

The home screen provides:

- Gutenberg Project branding
- Project description
- Genre selection
- Responsive genre cards
- Navigation to the selected book shelf

Supported genres:

- Fiction
- Drama
- Humour
- Politics
- Philosophy
- History
- Adventure

### Books

The books screen provides:

- Selected genre title
- Search input
- Book cover grid
- Book title
- Author
- Save/bookmark action
- Infinite scrolling
- Pull-to-refresh
- Loading state
- Empty state
- Error state
- Retry action

### Saved Books

Users can save books while browsing and access them from the saved-books shelf.

---

## API

The application uses the hosted Gutendex API provided specifically for the assessment:

```text
https://gutendex.careers.ignitesol.com
```

The main endpoint is:

```text
https://gutendex.careers.ignitesol.com/books
```

The assessment specifies that the hosted API should be used for the application.

The API supports filtering through query parameters including:

- `topic`
- `search`
- `languages`
- `mime_type`
- pagination

The application requests books with image MIME types so that returned results contain book covers.

Example:

```text
https://gutendex.careers.ignitesol.com/books?mime_type=image/&topic=fiction
```

---

## Book Search

Search is performed through the API rather than filtering the currently loaded books only on the client.

When a user searches for a term, the application keeps the selected genre/topic filter and sends the search term to the API.

For example:

```text
topic=fiction
search=vampire
```

This allows the API to return books matching the selected genre and the entered search text.

Search requests are debounced to avoid making an API request for every individual keystroke.

---

## Pagination / Infinite Scrolling

The API returns a `next` URL for subsequent pages.

The application uses the API-provided `next` URL rather than manually constructing pagination URLs.

When the user reaches the end of the book list:

1. The next API page is requested.
2. New books are added to the existing list.
3. Duplicate book IDs are avoided.
4. The next pagination URL is stored.
5. Loading stops when no next page is returned.

This keeps pagination aligned with the API response.

---

## Book Format Handling

When a user selects a book, the application looks for a readable version in the following order:

1. HTML
2. PDF
3. TXT

The first available supported format is opened using the device/browser.

ZIP files are intentionally excluded because they are not directly viewable book formats.

If none of the supported formats are available, the application displays:

```text
No viewable version available
```

This follows the format priority specified in the assessment.

---

## Saved Books

Users can save books directly from the book grid.

Each book has a bookmark action that allows the user to:

- Save a book
- Remove a saved book
- Access saved books separately

Saved-book state is managed through a dedicated React context.

---

## Pull-to-Refresh

The books screen supports pull-to-refresh.

Refreshing the shelf requests the current genre/search results again from the API and updates the displayed list.

Pull-to-refresh was listed as an optional enhancement in the assessment and has been implemented.

---

## Accessibility

Accessibility considerations have been included for interactive elements.

Examples include:

- Accessibility roles for buttons
- Accessibility labels for navigation controls
- Accessibility labels for book opening actions
- Accessibility labels for save/remove actions
- Accessibility label for the search field
- Test IDs for important interactive elements

The goal is to make the main interactions understandable to assistive technologies.

---

## Responsive Design

The application is designed to work across different screen sizes and orientations.

The book grid dynamically adjusts its number of columns based on available width.

The layout supports:

- Mobile portrait
- Mobile landscape
- Wider screens

Safe-area insets are used to prevent content from being hidden behind device notches or system UI.

The implementation follows the responsive design direction provided in the assessment.

---

## Design System

The provided Gutenberg Project design specifies:

### Primary colors

```text
Primary:    #5E56E7
Background: #F8F7FF
```

### Greys

```text
#F0F0F6
#A0A0A0
#333333
```

### Font

```text
Montserrat
```

### Typography

The provided design specifies:

| Element     | Font                | Size |
| ----------- | ------------------- | ---: |
| Heading 1   | Montserrat SemiBold | 48px |
| Heading 2   | Montserrat SemiBold | 30px |
| Genre Card  | Montserrat Regular  | 20px |
| Body        | Montserrat Regular  | 16px |
| Search Box  | Montserrat Regular  | 16px |
| Book Name   | Montserrat Regular  | 12px |
| Book Author | Montserrat Regular  | 12px |

The book design also specifies rounded book covers with shadows and a responsive grid.

---

## Architecture

The project uses a feature-oriented React Native / Expo structure.

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── books.tsx
│   └── index.tsx
│
├── assets/
│   └── HeroArtwork.tsx
│
├── components/
│   ├── ErrorBoundary.tsx
│   ├── ErrorFallback.tsx
│   └── KeyboardAwareScrollViewCompat.tsx
│
├── constants/
│   ├── colors.ts
│   └── copy.ts
│
├── context/
│   └── saved-books.tsx
│
├── hooks/
│   └── useColors.ts
│
├── services/
│   └── gutendex.ts
│
├── theme/
│   └── colors.ts
│
└── global.css
```

### `app/`

Contains Expo Router screens and application navigation.

#### `_layout.tsx`

Responsible for:

- Loading Montserrat fonts
- Splash screen handling
- Safe area provider
- Gesture handler root
- Keyboard provider
- Error boundary
- Expo Router stack configuration

#### `index.tsx`

Home screen containing the Gutenberg Project introduction and genre selection.

#### `books.tsx`

Main book browsing screen containing:

- API fetching
- Search
- Pagination
- Infinite scrolling
- Book grid
- Saved-book actions
- Pull-to-refresh
- Loading/error/empty states
- Book opening

---

### `services/`

Contains the API integration.

#### `gutendex.ts`

Responsible for:

- Building book API URLs
- Fetching books
- Resolving pagination URLs
- Extracting cover URLs
- Selecting the preferred readable format

Keeping API-specific logic in this layer prevents network concerns from being spread across UI components.

---

### `context/`

#### `saved-books.tsx`

Provides saved-book state to the application.

This keeps saved-book behavior separate from the presentation layer.

---

### `components/`

Reusable application components and infrastructure.

#### `ErrorBoundary.tsx`

Catches unexpected React rendering errors and displays the configured fallback component.

#### `ErrorFallback.tsx`

Provides a user-facing recovery screen when an unexpected application error occurs.

#### `KeyboardAwareScrollViewCompat.tsx`

Provides keyboard-aware scrolling behavior with compatibility handling for web.

---

### `constants/`

#### `colors.ts`

Contains centralized color constants.

#### `copy.ts`

Contains user-facing English UI strings in one place.

Centralizing UI copy makes it easier to introduce additional languages later without searching screen components for individual strings.

---

### `hooks/`

#### `useColors.ts`

Provides access to the application's color system.

---

### `theme/`

Contains theme-related styling values.

---

## Error Handling

The application handles several classes of errors.

### API errors

Initial book loading errors show an appropriate error state and retry action.

### Pagination errors

If loading another page fails, the existing books remain visible and an inline error/retry action is provided.

### Missing book format

If a book has no HTML, PDF, or TXT version, the application displays:

```text
No viewable version available
```

### Unexpected application errors

A global React error boundary catches unexpected rendering errors and provides a recovery screen.

---

## Performance Considerations

Several performance-oriented techniques are used:

- API-side filtering
- API-side image MIME filtering
- Pagination instead of loading the entire dataset
- Infinite scrolling
- Debounced search
- Abortable network requests
- Duplicate prevention during pagination
- Responsive grid sizing
- Reusable components
- Centralized constants
- Avoiding unnecessary API requests during rapid search input

The application also prevents multiple pagination requests from being triggered simultaneously.

---

## Theming and Localization

The assessment requires the application architecture to be easily adaptable for different themes and languages.

The implementation supports this through centralized styling and UI copy.

### Theme

Colors are centralized rather than being scattered throughout screen components.

### Localization

User-facing strings are centralized in:

```text
src/constants/copy.ts
```

For example:

```ts
const copy = {
    home: {
        title: "Gutenberg Project",
    },
    books: {
        searchPlaceholder: "Search title or author",
    },
};
```

A future localization layer can replace these English strings without requiring user-facing text to be searched throughout the application.

---

## Third-Party Libraries

The project uses the following main libraries:

### Expo

```text
expo
expo-router
expo-font
expo-splash-screen
expo-asset
expo-linking
expo-status-bar
expo-system-ui
```

### React Native

```text
react
react-native
react-native-web
```

### UI / Device Support

```text
@expo/vector-icons
@expo/ui
expo-image
expo-symbols
expo-glass-effect
expo-device
```

### Fonts

```text
@expo-google-fonts/montserrat
```

### Application Infrastructure

```text
react-native-safe-area-context
react-native-gesture-handler
react-native-keyboard-controller
react-native-reanimated
react-native-worklets
react-native-screens
```

### Storage

```text
@react-native-async-storage/async-storage
```

### Other

```text
@tanstack/react-query
```

---

## AI Tools Used

AI tools were used during development, including ChatGPT.

AI assistance was used for:

- Debugging React Native and TypeScript issues
- Reviewing application architecture
- Debugging API and pagination behavior
- Reviewing error handling
- Improving responsive UI behavior
- Reviewing accessibility considerations
- Refining implementation approaches
- Reviewing code for potential issues

AI-generated suggestions were reviewed, adapted and tested as part of the implementation.

The developer understands the implemented code and can explain the implementation decisions.

---

## Setup

### Requirements

Make sure the following are installed:

- Node.js
- npm
- Expo tooling
- iOS Simulator / physical iOS device
- Android Emulator / physical Android device, if testing Android

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Shubham98Tiwari/GutenbergProject.git
```

Navigate to the project:

```bash
cd GutenbergProject
```

Install dependencies:

```bash
npm install
```

---

## Run the Application

Start the Expo development server:

```bash
npx expo start
```

Run on iOS:

```bash
npx expo start --ios
```

Run on Android:

```bash
npx expo start --android
```

Run on web:

```bash
npx expo start --web
```

---

## Validation

Before submission, the project was validated using:

```bash
npx tsc --noEmit
```

and:

```bash
npx expo-doctor
```

The final project passed TypeScript validation.

Expo Doctor reported:

```text
21/21 checks passed. No issues detected!
```

---

## Testing Checklist

The following areas were manually verified during development:

- Home screen rendering
- Genre navigation
- Book API loading
- Genre filtering
- Search
- Search + genre filtering
- Infinite scrolling
- Pagination
- Book cover rendering
- Book opening
- HTML/PDF/TXT format fallback
- Saved books
- Pull-to-refresh
- Loading state
- Empty state
- Network error state
- Retry behavior
- Responsive grid
- Safe-area handling
- Portrait layout
- Landscape layout
- TypeScript compilation
- Expo Doctor validation

---

## Known Limitations

### Offline caching

Persistent offline API caching has not been implemented.

The assessment lists offline caching as an optional enhancement, so the application currently depends on network availability for fetching book data.

Previously loaded books are not intended to function as a complete offline API cache.

### UI tests

Automated UI tests have not been included.

### API availability

Book browsing depends on the availability and response time of the hosted Ignite Gutendex API.

### Book availability

Some books may not have:

- Cover images
- HTML editions
- PDF editions
- TXT editions

The application handles missing readable formats by displaying the appropriate error message.

### External book opening

Books are opened using the device/browser rather than through an embedded EPUB/PDF/HTML reader inside the application.

---

## Git Workflow

The project was developed using feature-oriented Git commits.

Examples of implemented commits include:

```text
feat: integrate Ignite Gutendex API pagination
feat: add Gutendex API service
feat: implement Gutenberg book browsing screens
feat: add saved books functionality
feat: centralize UI copy and improve book shelf experience
fix(mobile): stabilize bookshelf grid and pin home header
bug fixes
```

This follows the assessment requirement to use meaningful feature-wise commits rather than submitting the complete project as one commit.

---

# Demo

## Portrait Demo

Add the portrait demo video link here:

```
https://drive.google.com/file/d/1SxZsl9Zh1rt-U2i9y4jeEx3UF8U6fo9G/view?usp=drive_link

https://drive.google.com/file/d/1sQcUo-9R2jpxnnvMjbcXTzCOFEUZ1AXu/view?usp=drive_link
```

## Landscape Demo

```
https://drive.google.com/file/d/1_4wQBckjepnAOtawzHySAdr0ci2Ad1iI/view?usp=sharing
```

---

## Repository

GitHub repository:

https://github.com/Shubham98Tiwari/GutenbergProject

---

## Assessment

This project was developed as part of the Ignite Solutions Mobile Developer assessment.

The application implements the provided Gutenberg Project responsive design and the required Gutendex book browsing functionality.

---
