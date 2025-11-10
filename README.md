# Bug Tracker

A modern, project-based bug tracking application for teams, similar to Jira. This application features a clean, intuitive Kanban-style board and leverages the Gemini API to assist in writing detailed, structured bug reports.

## Features

- **Project-Based Organization**: Group your issues by project. Easily switch between projects via a dropdown menu.
- **Kanban Board**: Visualize your workflow with a drag-and-drop board for "To Do", "In Progress", and "Done" statuses.
- **Issue Management**: Create, view, edit, and delete issues through a comprehensive modal.
- **AI-Powered Descriptions**: Use the Gemini API to automatically generate detailed bug descriptions based on a simple title, including summary, steps to reproduce, and expected/actual results.
- **User Assignments**: Assign issues to team members.
- **Priority Levels**: Set priorities for issues (Low, Medium, High, Urgent).
- **Project Creation**: Quickly add new projects on the fly.
- **Responsive Design**: Works smoothly on desktop and mobile devices.
- **Authentication**: A simple and secure login/signup flow to protect your dashboard.

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Build**: Vite (or similar modern build tool)

## Getting Started

### Prerequisites

- A modern web browser.
- An API key for the Google Gemini API.

### Installation & Running

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd bug-tracker
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root directory and add your Gemini API key:
    ```
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```
6.  Open your browser and navigate to `http://localhost:5173` (or the URL provided by Vite).

### Authentication

The application now includes a login and signup page.

-   **Login**: You can use the mock credentials of the existing users. For example:
    -   **Email**: `alice@example.com`
    -   **Password**: `password123`
-   **Sign Up**: You can create a new user account, which will be added to the session's user list.

## File Structure

```
/
|-- public/
|-- src/
|   |-- components/              # Reusable React components
|   |   |-- AuthPage.tsx         # Login and signup forms
|   |   |-- Column.tsx           # A single column on the Kanban board
|   |   |-- IssueCard.tsx        # A single issue card
|   |   |-- IssueModal.tsx       # Modal for creating/editing issues
|   |   |-- PriorityIcon.tsx     # Icon representing issue priority
|   |   |-- ProjectModal.tsx     # Modal for creating projects
|   |   |-- UserAvatar.tsx       # User avatar component
|   |-- services/
|   |   |-- geminiService.ts     # Service for interacting with the Gemini API
|   |-- App.tsx                  # Main application component and layout
|   |-- constants.ts             # Mock data and constants
|   |-- index.css                # Global styles
|   |-- main.tsx                 # Main entry point for React
|   |-- types.ts                 # TypeScript type definitions
|-- .env.example
|-- .gitignore
|-- index.html
|-- package.json
|-- README.md
|-- tsconfig.json
```

## How It Works

-   **State Management**: The main `App.tsx` component manages the state for projects, issues, users, and the currently selected project using React's `useState` hook.
-   **Drag and Drop**: Native HTML drag-and-drop APIs are used to move issues between columns. The `onDragStart` and `onDrop` event handlers update the issue's status in the state.
-   **Gemini Integration**: When a user clicks the "Generate with AI" button in the `IssueModal`, the `geminiService.ts` sends the issue title to the Gemini API. The API returns a structured markdown description, which is then populated into the form.
