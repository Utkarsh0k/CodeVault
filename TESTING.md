# CodeVault — Test Plan & Test Cases

## Test Environment

| Item | Detail |
|------|--------|
| **Frontend** | React 18 + Vite 5, http://localhost:5173 |
| **Backend** | Node.js + Express 4, http://localhost:5000 |
| **Database** | MongoDB (Atlas or local) |
| **Browser** | Chrome / Edge (latest) |

---

## Test Cases

### TC-01: Create Category

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click **+ Add Category** in sidebar | Category Name modal opens |
| 2 | Enter "DSA" and click **Create** | Modal closes, "DSA" appears in sidebar with count `0` |
| 3 | Try creating "DSA" again | Error: "Category already exists" |
| 4 | Try creating with empty name | Validation error prevents submission |

**API Test:**
```
POST /api/categories
Body: { "name": "DSA" }
Expected: 201, { "_id": "...", "name": "DSA" }
```

---

### TC-02: Rename Category

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover over "DSA" in sidebar | Rename (✏️) icon appears |
| 2 | Click rename, change to "Data Structures" | Name updates in sidebar and in snippet metadata |
| 3 | Rename to existing category name | Error: duplicate name rejected |

**API Test:**
```
PUT /api/categories/:id
Body: { "name": "Data Structures" }
Expected: 200, updated category object
```

---

### TC-03: Create Snippet

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select a category, click **+ New** | Create Snippet modal opens |
| 2 | Fill title "Binary Search", language "C++", submit | Modal closes, snippet appears in list |
| 3 | Verify category count increments by 1 | Count in sidebar updates |
| 4 | Try creating with empty title | Validation prevents submission |

**API Test:**
```
POST /api/snippets
Body: { "title": "Binary Search", "categoryId": "<id>", "language": "cpp" }
Expected: 201, snippet object with default fields
```

---

### TC-04: Edit Snippet (Code + Metadata)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select a snippet, type code in Monaco editor | "Unsaved" indicator appears |
| 2 | Click **Save** (or Ctrl+S) | Code persists, unsaved indicator clears |
| 3 | Open metadata panel, click **Edit** | Fields become editable |
| 4 | Change difficulty to "Hard", add tag "search" | Fields update |
| 5 | Click **Save** in metadata | Changes persist |
| 6 | Refresh browser (F5) | Same snippet loads with saved code and metadata |

**API Test:**
```
PUT /api/snippets/:id
Body: { "code": "int search(...){...}", "difficulty": "Hard", "tags": ["search"] }
Expected: 200, updated snippet
```

---

### TC-05: Delete Snippet

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select a snippet, click **Delete** (🗑️) | Confirmation dialog appears |
| 2 | Confirm deletion | Snippet removed from list, editor clears |
| 3 | Verify category count decrements | Sidebar count updates |

**API Test:**
```
DELETE /api/snippets/:id
Expected: 200, { "message": "Snippet deleted" }
```

---

### TC-06: Search Snippets

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Type "binary" in search bar | Only snippets matching "binary" in title/tags/description shown |
| 2 | Select language filter "C++" | Results filtered to C++ snippets |
| 3 | Select difficulty filter "Easy" | Results filtered to Easy snippets |
| 4 | Click **Reset** | All filters cleared, full list restored |

**API Test:**
```
GET /api/snippets?search=binary&language=cpp&difficulty=Easy
Expected: 200, filtered array
```

---

### TC-07: Favorite / Unfavorite Snippet

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click ☆ star on a snippet | Star becomes ★ (filled), snippet marked favorite |
| 2 | Click **★ Favorites** in sidebar | Only favorited snippets shown |
| 3 | Click ★ again to unfavorite | Star reverts to ☆, snippet removed from Favorites view |

**API Test:**
```
PATCH /api/snippets/:id/favorite
Expected: 200, { "favorite": true/false } (toggles)
```

---

### TC-08: Create / Edit / Delete GNote

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open a snippet, click **+ Note** | Yellow sticky note appears on editor overlay |
| 2 | Type text in the note | Text saves on blur |
| 3 | Drag note to new position | Note moves, position saved on drop |
| 4 | Click ✕ on note | Note deleted after confirmation |
| 5 | Toggle **Notes OFF** | Notes hidden; toggle back shows them |

**API Tests:**
```
POST   /api/snippets/:id/gnotes          → 201, new note
PATCH  /api/snippets/:id/gnotes/:noteId  → 200, updated note
DELETE /api/snippets/:id/gnotes/:noteId  → 200, deleted
```

---

### TC-09: Persistence After Reload

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create a snippet with code, metadata, and GNotes | All data saved |
| 2 | Refresh browser (F5) | Re-select snippet — code, metadata, GNote text & position all intact |
| 3 | Close and reopen browser | Same result |

---

### TC-10: Category Cascade Delete

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create a category with 2+ snippets | Category has count ≥ 2 |
| 2 | Delete the category | Confirmation dialog warns about snippet deletion |
| 3 | Confirm | Category and ALL its snippets removed |

**API Test:**
```
DELETE /api/categories/:id
Expected: 200, associated snippets also deleted
```

---

### TC-11: Validation & Error Handling

| Test | Action | Expected Result |
|------|--------|-----------------|
| Invalid ObjectId | `GET /api/snippets/abc123` | 400: "Invalid ID format" |
| Non-existent ID | `GET /api/snippets/aaaaaaaaaaaaaaaaaaaaaaaa` | 404: "Snippet not found" |
| Empty title | `POST /api/snippets { "title": "" }` | 400: Validation error |
| Duplicate category | `POST /api/categories { "name": "existing" }` | 409: "Category already exists" |
| Malformed JSON | POST with invalid body | 400: Parse error |

---

### TC-12: Unsaved Changes Guard

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Edit code without saving | Unsaved dot indicator visible |
| 2 | Try to switch to another snippet | Confirmation prompt: "You have unsaved changes" |
| 3 | Cancel | Stay on current snippet |
| 4 | Confirm | Switch without saving |

---

## Test Results Summary

| Test Case | Description | Status |
|-----------|-------------|--------|
| TC-01 | Create Category | ⬜ |
| TC-02 | Rename Category | ⬜ |
| TC-03 | Create Snippet | ⬜ |
| TC-04 | Edit Snippet | ⬜ |
| TC-05 | Delete Snippet | ⬜ |
| TC-06 | Search & Filter | ⬜ |
| TC-07 | Favorites | ⬜ |
| TC-08 | GNotes CRUD | ⬜ |
| TC-09 | Persistence | ⬜ |
| TC-10 | Cascade Delete | ⬜ |
| TC-11 | Validation | ⬜ |
| TC-12 | Unsaved Guard | ⬜ |

> Mark each ⬜ as ✅ (pass) or ❌ (fail) during testing.
