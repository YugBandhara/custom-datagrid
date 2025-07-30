# 📊 Custom Data Grid – Next.js Assignment

A fully custom-built Data Grid component using **Next.js 14+ (App Router)**, **TypeScript**, and **Tailwind CSS**. This grid replicates powerful features similar to MUI DataGrid but is crafted entirely from scratch — no external grid libraries used.

---

## 🔗 Live Links

- 🚀 **Deployed App**: [https://yugbandhara-datagrid.vercel.app/](https://yugbandhara-datagrid.vercel.app/)
- 🎥 **Demo Video**: [Watch on YouTube](https://youtu.be/FSuY5AazR0M)

---

## 🛠️ Tech Stack Used

| Category         | Technology                    |
|------------------|-------------------------------|
| Framework        | Next.js 14+ (App Router)       |
| Language         | TypeScript (`.tsx`)           |
| Styling          | Tailwind CSS                  |
| State Management | React Context API + useReducer|
| Animations       | CSS Transitions + Framer Motion |
| API              | Custom Dummy API or JSONPlaceholder |

---
## ⚙️ Setup Instructions

### 🔧 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### 🧑‍💻 Steps to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/custom-datagrid.git
cd custom-datagrid

# 2. Install dependencies
npm install  # or yarn install

# 3. Start development server
npm run dev  # or yarn dev

## 📦 Deliverables

### ✅ 1. Complete Next.js Application

- ✅ Built with latest `Next.js 14+ App Router`
- ✅ Written entirely in **TypeScript**
- ✅ **Tailwind CSS** for responsive and modern UI
- ✅ **Framer Motion** + CSS for smooth animations
- ✅ Reusable component architecture
- ✅ Dummy API integrated
- ✅ Clean, maintainable code structure

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites

- Node.js (v18+)
- npm or yarn

### 📥 Installation

```bash
git clone https://github.com/your-username/custom-datagrid.git
cd custom-datagrid
npm install  # or yarn install

```

---


## 🚀 Features Implemented

### 📌 1. Core Data Grid Functionality
- ✅ Dynamic column rendering
- ✅ Row virtualization (1000+ rows)
- ✅ Multi-column sorting with indicators
- ✅ Column-wise filtering (text, number, date, select)
- ✅ Client-side and server-side pagination
- ✅ Global search functionality

### 🧱 2. Column Management Features
- ✅ Show/Hide columns
- ✅ Column reordering via drag and drop
- ✅ Column pinning (left/right)
- ✅ Column resizing with drag
- ✅ Column freezing while scrolling
- ✅ Column grouping with headers

### ⚙️ 3. Advanced Features
- ✅ Single/Multi-row selection with checkboxes
- ✅ Inline editing of cell values
- ✅ Custom cell types (text, date, action buttons)
- ✅ Row-level actions: Edit, Delete, View
- ✅ Bulk actions for selected rows
- ✅ Export data to CSV/JSON
- ✅ Density control (Compact / Standard / Comfortable)

### 🎨 4. UI/UX Requirements
- ✅ Fully responsive (mobile-first)
- ✅ Dark/Light theme toggle
- ✅ Skeleton loaders & spinners
- ✅ Error handling with retry
- ✅ Accessible with ARIA, keyboard nav
- ✅ Touch support on mobile

### 🎞️ 5. Animation Requirements
- ✅ Smooth column transitions
- ✅ Hover effects and button interactions
- ✅ Loading animations
- ✅ Staggered row animations
- ✅ Gesture feedback for touch

---
## 🎯 Completed Advanced Features (Power Additions)

The following **extra features** have been successfully implemented to enhance the overall user experience:

### ⌨️ Keyboard Shortcuts

The application supports a robust set of keyboard shortcuts for enhanced productivity and accessibility:

| Shortcut                         | Action                                 |
|----------------------------------|----------------------------------------|
| `Ctrl + →` / `Cmd + →`           | Go to next page (if available)         |
| `Ctrl + ←` / `Cmd + ←`           | Go to previous page                    |
| `Ctrl + Shift + A` / `Cmd + Shift + A` | Select all rows                   |
| `Esc`                            | Clear all selected rows                |
| `Delete` / `Cmd + Backspace`     | Delete selected rows from grid         |
| `Ctrl + Shift + 1` / `Cmd + Shift + 1` | Switch to **Dark Theme**         |
| `Ctrl + Shift + 2` / `Cmd + Shift + 2` | Switch to **Light Theme**        |

⚡ These shortcuts work across platforms (Windows/Linux/Mac) using `ctrl` or `cmd (meta)` keys where applicable.

### 🎨 Custom Themes
- Light and Dark themes available
- User preference is persisted using `localStorage`
- Toggle switch integrated in UI
- Fully Tailwind-based theme system using `ThemeContext`

### 🧠 Advanced Filtering (Multi-Filter Support)
- Apply **multiple filters on multiple columns** at the same time
- Filter types supported:
  - **Text contains/exact**
  - **Number range**
  - **Date range**
  - **Dropdown/Select options**
- Filters are debounced and memoized for performance

---

✅ These features go **above and beyond the core requirements**, making this Data Grid a highly usable, accessible, and production-grade component.


## 📄 Mock Data

This project uses mock user data stored locally to simulate API responses.

### 📁 File Path:

src/mocks/data/users.json

### 📦 Sample Entry:

```json
[{
  "id": 1,
  "name": "Catharine Deluca",
  "email": "cdeluca0@meetup.com",
  "role": "Account Representative II",
  "department": "Legal",
  "salary": 26721,
  "joinDate": "6/15/2021",
  "status": "active",
  "avatar": "https://robohash.org/autquiaquisquam.png?size=50x50&set=set1"
},{...}]
```


## ⚡ Performance Metrics

- 🚀 **Grid loads 1000+ rows in under 2 seconds**
- 🎞️ **Smooth 60fps animations and transitions**
- 📱 **Mobile responsive on all devices**
- ♿ **Fully accessible via keyboard and screen reader**
- 🧼 **Clean, modular, and maintainable codebase**

---
## 🚀 Performance Optimization Notes

To ensure the Data Grid performs well even with large datasets (10,000+ rows), the following optimization strategies were implemented:

### 🧠 Virtualization
- **Row virtualization** with a custom hook `useVirtualScroll` ensures only visible rows are rendered in the DOM.
- This drastically reduces memory usage and improves scrolling performance.

### 🕵️‍♂️ Memoization
- Components like `DataGridRow` and `DataGridCell` are memoized using `React.memo` and `useMemo` to prevent unnecessary re-renders.
- Derived values (filtered data, sorted rows, etc.) are memoized where applicable.

### ⌛ Debounced Search & Filter
- Global and column-specific filters are debounced (300ms) to avoid constant re-computation while typing.

### 🌐 Lazy Loading
- Data fetching and rendering are structured to load and render only what’s needed.
- Images like avatars are lazy-loaded to prevent blocking UI rendering.

### 🗂️ Chunked Rendering
- For long lists (e.g., in virtual scroll), items are rendered in "chunks" for a smoother experience without blocking the main thread.

### 🧰 Efficient useReducer Patterns
- Complex state updates (e.g., sorting, pagination, filtering) are handled via `useReducer` to minimize renders and batch state transitions.

### 💾 Caching API Data
- Responses from the mock API are cached (using context and local state) to avoid unnecessary refetching on pagination or re-sorting.

---

These optimizations ensure:
- Fast initial load times
- Smooth 60fps scrolling
- Responsive performance across all devices



## 🔍 Known Limitations & Future Improvements

### 🔸 Known Limitations
- No persistent backend (uses mock data)
- Export to Excel not implemented (only CSV/JSON)

### 🔮 Future Improvements
- Add real-time backend API integration
- Add  WebSocket integration
- Add Multi-language support and Printer-friendly layouts   
- Add drag-to-select for row selection
