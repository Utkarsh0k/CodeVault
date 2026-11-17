# CodeVault

**A Personal Code Snippet and Programming Knowledge Management System**

CodeVault is a full-stack web application that helps programmers organize, store, and manage their code snippets and programming knowledge in one place. Built with the MERN stack (MongoDB, Express, React, Node.js), it features a professional code editor, smart categorization, visual sticky notes, and powerful search capabilities.

---

## Features

- **Category Management** — Create, rename, and delete categories to organize snippets
- **Snippet CRUD** — Full create, read, update, and delete operations for code snippets
- **Monaco Code Editor** — VS Code's editor engine with syntax highlighting for 15+ languages
- **Metadata Panel** — Track difficulty level, time complexity, tags, and descriptions
- **Search & Filtering** — Real-time search across titles, tags, and descriptions with language/difficulty filters
- **Favorites** — Star important snippets for quick access
- **GNotes (Graphical Notes)** — Draggable sticky notes overlaid on the code editor for visual annotations
- **Unsaved Changes Guard** — Prevents accidental data loss when switching snippets
- **Dark Theme UI** — Modern glassmorphism design optimized for coding
- **Responsive Layout** — Desktop-first design that adapts to smaller screens
- **Validation & Error Handling** — Both client-side and server-side validation with user-friendly error messages

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | Component-based UI |
| **Build Tool** | Vite 5 | Fast development server and bundler |
| **Code Editor** | Monaco Editor | Syntax highlighting and code editing |
| **Backend** | Node.js + Express 4 | REST API server |
| **Database** | MongoDB + Mongoose | Document storage and ODM |
| **Dev Tools** | Nodemon, Concurrently | Auto-restart and parallel process management |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐│
│  │ Category │  │ Snippet  │  │      Main Area         ││
│  │ Sidebar  │  │   List   │  │  ┌──────────────────┐  ││
│  │          │  │          │  │  │  Monaco Editor    │  ││
│  │ - All    │  │ - Items  │  │  │                  │  ││
│  │ - Favs   │  │ - Search │  │  │  ┌────┐ ┌────┐  │  ││
│  │ - Cats   │  │ - Filter │  │  │  │Note│ │Note│  │  ││
│  │          │  │          │  │  │  └────┘ └────┘  │  ││
│  └──────────┘  └──────────┘  │  └──────────────────┘  ││
│                              │  ┌──────────────────┐  ││
│       ┌──────────┐           │  │  Metadata Panel  │  ││
│       │  TopBar  │           │  └──────────────────┘  ││
│       └──────────┘           └────────────────────────┘│
└────────────────────┬────────────────────────────────────┘
                     │  HTTP (fetch)
                     │  /api/*
┌────────────────────▼────────────────────────────────────┐
│                   SERVER (Express)                       │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Routes   │→ │ Controllers  │→ │   Middleware    │  │
│  │ /categories│  │ categoryCtrl │  │ errorHandler   │  │
│  │ /snippets  │  │ snippetCtrl  │  │ asyncHandler   │  │
│  └────────────┘  └──────┬───────┘  │ validateObjId  │  │
│                         │          └────────────────┘  │
│                  ┌──────▼───────┐                       │
│                  │   Mongoose   │                       │
│                  │   Models     │                       │
│                  └──────┬───────┘                       │
└─────────────────────────┼───────────────────────────────┘
                          │
                   ┌──────▼───────┐
                   │   MongoDB    │
                   │  (Atlas /    │
                   │   Local)     │
                   └──────────────┘
```

---

## Database Design

### Categories Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `name` | String | Required, unique, trimmed |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

### Snippets Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `categoryId` | ObjectId | Required, ref → Category |
| `title` | String | Required, trimmed |
| `language` | String | Required |
| `code` | String | Default: `""` |
| `description` | String | Default: `""` |
| `tags` | [String] | Default: `[]` |
| `difficulty` | String | Enum: Easy, Medium, Hard |
| `timeComplexity` | String | Default: `""` |
| `favorite` | Boolean | Default: `false` |
| `gNotes` | [GNote] | Embedded subdocument array |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

### GNote (Embedded Subdocument)

| Field | Type | Default |
|-------|------|---------|
| `text` | String | `"New note"` |
| `x` | Number | `50` |
| `y` | Number | `50` |
| `width` | Number | `180` |

> **Design Decision:** GNotes are embedded inside snippets (not a separate collection) because they are always accessed together with their parent snippet, making queries simpler and more efficient.

---

## API Endpoints

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | Get all categories (with snippet counts) |
| `POST` | `/api/categories` | Create a new category |
| `PUT` | `/api/categories/:id` | Rename a category |
| `DELETE` | `/api/categories/:id` | Delete category + its snippets |

### Snippets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/snippets` | Get snippets (supports `?search`, `?language`, `?difficulty`, `?categoryId`, `?favorite`) |
| `POST` | `/api/snippets` | Create a new snippet |
| `GET` | `/api/snippets/:id` | Get a single snippet |
| `PUT` | `/api/snippets/:id` | Update a snippet |
| `PATCH` | `/api/snippets/:id/favorite` | Toggle favorite status |
| `DELETE` | `/api/snippets/:id` | Delete a snippet |

### GNotes (Nested under Snippets)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/snippets/:id/gnotes` | Add a note to a snippet |
| `PATCH` | `/api/snippets/:id/gnotes/:noteId` | Update a note's text/position |
| `DELETE` | `/api/snippets/:id/gnotes/:noteId` | Delete a note |

---

## Installation

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/codevault.git
   cd codevault
   ```

2. **Install all dependencies** (root + server + client)
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB connection string (see next section).

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codevault
```

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/codevault` or MongoDB Atlas URI |

> **Note:** The `.env` file is listed in `.gitignore` and must never be committed.

---

## Running the Application

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend concurrently |
| `npm run server` | Start only the backend (port 5000) |
| `npm run client` | Start only the frontend (port 5173) |

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so both servers work together seamlessly during development.

---

## Project Structure

```
codevault/
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
├── package.json              # Root package (concurrently)
├── README.md                 # This file
├── TESTING.md                # Test plan and test cases
│
├── server/                   # Backend (Express + Mongoose)
│   ├── server.js             # Entry point — Express app setup
│   ├── package.json          # Server dependencies
│   ├── config/
│   │   └── db.js             # MongoDB connection logic
│   ├── models/
│   │   ├── Category.js       # Category schema
│   │   └── Snippet.js        # Snippet schema (with embedded GNotes)
│   ├── controllers/
│   │   ├── categoryController.js  # Category CRUD handlers
│   │   └── snippetController.js   # Snippet + GNote handlers
│   ├── routes/
│   │   ├── categoryRoutes.js # /api/categories routes
│   │   └── snippetRoutes.js  # /api/snippets routes
│   ├── middleware/
│   │   ├── asyncHandler.js   # Async error wrapper
│   │   ├── errorHandler.js   # Global error handler
│   │   └── validateObjectId.js # ObjectId format validator
│   └── utils/
│       └── constants.js      # Shared constants (languages, difficulties)
│
└── client/                   # Frontend (React + Vite)
    ├── index.html            # HTML entry point
    ├── package.json          # Client dependencies
    ├── vite.config.js        # Vite configuration (proxy)
    └── src/
        ├── main.jsx          # React DOM render
        ├── App.jsx           # Root component
        ├── index.css         # Global styles (dark theme)
        ├── services/
        │   ├── api.js        # Fetch wrapper
        │   ├── categoryService.js  # Category API calls
        │   └── snippetService.js   # Snippet API calls
        ├── hooks/
        │   ├── useCategories.js    # Category state management
        │   └── useSnippets.js      # Snippet state management
        ├── utils/
        │   └── constants.js  # Language/difficulty definitions
        ├── components/
        │   ├── common/
        │   │   ├── EmptyState.jsx     # Empty state placeholder
        │   │   ├── ErrorBanner.jsx    # Dismissible error alert
        │   │   ├── Modal.jsx          # Reusable modal dialog
        │   │   └── ConfirmDialog.jsx  # Destructive action confirm
        │   ├── layout/
        │   │   ├── TopBar.jsx             # Search bar and filters
        │   │   ├── CategorySidebar.jsx    # Category navigation
        │   │   ├── CategoryNameModal.jsx  # Create/rename category
        │   │   ├── CreateSnippetModal.jsx # New snippet form
        │   │   ├── SnippetList.jsx        # Snippet list panel
        │   │   └── MetadataPanel.jsx      # Snippet metadata editor
        │   └── editor/
        │       ├── CodeEditor.jsx     # Monaco editor wrapper
        │       ├── MainArea.jsx       # Editor + controls + GNotes
        │       ├── GNoteCard.jsx      # Draggable sticky note
        │       └── GNotesOverlay.jsx  # Notes overlay container
        └── pages/
            └── Workspace.jsx  # Main page (state orchestrator)
```

---

## Screenshots

> Add screenshots of the application here after deployment.

| Screen | Description |
|--------|-------------|
| ![Workspace](screenshots/workspace.png) | Main workspace with editor |
| ![GNotes](screenshots/gnotes.png) | GNotes overlay on editor |
| ![Search](screenshots/search.png) | Search and filter in action |

---

## Testing

The project includes a comprehensive test plan with 12 test cases documented in [TESTING.md](TESTING.md).

| ID | Test Case | Description |
|----|-----------|-------------|
| TC-01 | Create Category | Verify category creation and sidebar update |
| TC-02 | Rename Category | Verify category rename propagation |
| TC-03 | Create Snippet | Verify snippet creation and count increment |
| TC-04 | Edit Snippet | Verify code and metadata persistence |
| TC-05 | Delete Snippet | Verify removal and count decrement |
| TC-06 | Search & Filter | Verify search by title, tags; filter by language, difficulty |
| TC-07 | Favorites | Verify favorite toggle and Favorites view |
| TC-08 | GNotes CRUD | Verify note create, edit, drag, delete |
| TC-09 | Persistence | Verify data survives page reload |
| TC-10 | Cascade Delete | Verify category deletion removes snippets |
| TC-11 | Validation | Verify error handling for invalid inputs |
| TC-12 | Unsaved Guard | Verify unsaved changes confirmation |

---

## Future Enhancements

- **User Authentication** — Login/signup with JWT for multi-user support
- **Cloud Sync** — Sync snippets across devices
- **Code Execution** — Run code snippets directly in the browser
- **Version History** — Track changes to snippets over time
- **Export/Import** — Export snippets as files or import from GitHub Gists
- **Markdown Support** — Rich text descriptions with Markdown preview
- **Snippet Sharing** — Share snippets via public links
- **Keyboard Shortcuts** — Power-user shortcuts for common actions

---

## Academic Information

| Field | Detail |
|-------|--------|
| **Project Title** | CodeVault — Personal Code Snippet and Programming Knowledge Management System |
| **Student Name** | Utkarsh Yadav |
| **Roll Number** | 2403611530068 |
| **Branch** | B.Tech CSE (AI & ML) |
| **Semester** | 5th |
| **College** | R.R. Institute of Modern Technology, Lucknow |
| **University** | Dr. A.P.J. Abdul Kalam Technical University (AKTU) |
| **Guide** | Mr. Krishnakant |
| **Academic Year** | 2024–2025 |

---

## License

This project is developed as an academic mini-project and is intended for educational purposes.
