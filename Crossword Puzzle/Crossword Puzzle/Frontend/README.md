# Crossword Puzzle Generator - Frontend

A modern, responsive React.js frontend for a crossword puzzle generator web application.

## Features

### 🎯 Core Functionality
- **Custom Dictionaries**: Create and manage word collections with custom clues
- **Smart Puzzle Generation**: Generate crosswords of various sizes (5x5 to 20x20)
- **Instant Sharing**: Share puzzles with copyable links and QR codes
- **Real-time Validation**: Live answer checking with accuracy scoring
- **Global Leaderboards**: Compete with other players on score-based rankings

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Interactive Grid**: Keyboard navigation with arrow keys and auto-focus
- **Timer Integration**: Track solving time with pause/resume functionality
- **Toast Notifications**: User-friendly success and error messages

### 🔐 Authentication & Security
- **JWT Authentication**: Secure user sessions with token-based auth
- **Protected Routes**: Dashboard and leaderboard access for logged-in users
- **Public Puzzle Access**: Anyone can solve puzzles without registration
- **Form Validation**: Comprehensive input validation with React Hook Form

### 📱 Modern Tech Stack
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, utility-first styling
- **React Router DOM** for client-side routing
- **Axios** for API communication
- **React Hook Form** for form handling
- **Lucide React** for beautiful icons
- **QR Code generation** for easy sharing

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend API running (see backend documentation)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```
Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://localhost:3000
```

3. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Crossword/      # Crossword-specific components
│   ├── Dictionary/     # Dictionary management components
│   ├── Layout/         # Layout components (Header, Layout)
│   └── UI/             # Generic UI components (Modal, Spinner, etc.)
├── contexts/           # React contexts for global state
├── pages/              # Page components
├── utils/              # Utility functions and API calls
└── main.jsx           # Application entry point
```

## Key Components

### CrosswordGrid
Interactive crossword puzzle grid with:
- Keyboard navigation (arrow keys, tab)
- Real-time answer validation
- Visual feedback for correct/incorrect answers
- Auto-focus on next cell after input

### PuzzlePreviewModal
Modal for sharing generated puzzles:
- Copyable shareable links
- QR code generation
- Native sharing API integration
- Puzzle preview with answers

### DictionaryForm
Form for creating/editing dictionaries:
- Dynamic word-clue pair management
- Input validation and error handling
- Add/remove entries functionality

## API Integration

The frontend communicates with the backend through a centralized API utility:

```javascript
// Authentication
authAPI.login(credentials)
authAPI.register(userData)
authAPI.logout()

// Dictionary Management
dictionaryAPI.create(data)
dictionaryAPI.getAll()
dictionaryAPI.update(id, data)

// Crossword Generation
crosswordAPI.generateWithSize(dictId, size)
crosswordAPI.submit(dictId, score)
crosswordAPI.getLeaderboard(dictId)
```

## Routing Structure

- `/` - Home page with features overview
- `/login` - User authentication
- `/register` - User registration
- `/dashboard` - Protected: Dictionary management
- `/puzzle/:puzzleId` - Public: Puzzle solving interface
- `/leaderboard` - Protected: Score rankings

## Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px - Optimized touch interface
- **Tablet**: 640px - 1024px - Balanced layout
- **Desktop**: > 1024px - Full feature layout

## Theme Support

Automatic dark/light mode with:
- System preference detection
- Manual toggle option
- Persistent user preference
- Smooth transitions between themes

## Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Memoization**: React.memo for expensive components
- **Optimized Images**: Proper sizing and lazy loading
- **Bundle Optimization**: Vite's built-in optimizations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.