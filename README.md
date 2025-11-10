# Bug Tracker

A modern, project-based bug tracking application designed for development teams. This tool provides a Kanban-style board to visualize workflow, manage issues, and track progress, enhanced with AI-powered features to streamline bug reporting.

## ✨ Features

-   **Project-Based Organization**: Group your issues into distinct projects. Easily switch between projects with a simple dropdown menu.
-   **Kanban Board**: Visualize your workflow with a drag-and-drop interface. Move issues between statuses like 'To Do', 'In Progress', and 'Done'.
-   **Issue Management**: Create, edit, and delete issues with a comprehensive modal that includes fields for title, description, status, assignee, and priority.
-   **AI-Powered Descriptions**: Leverage the Gemini API to automatically generate detailed, structured bug reports from a simple issue title, saving you time and ensuring consistency.
-   **User Assignment**: Assign issues to team members and visualize assignments with user avatars.
-   **Priority Levels**: Categorize issues by priority (Low, Medium, High, Urgent) with clear visual indicators.
-   **Responsive Design**: A clean and modern UI that works seamlessly on different screen sizes.

## 🚀 Tech Stack

-   **Frontend**: React with TypeScript
-   **Styling**: Tailwind CSS
-   **AI Integration**: Google Gemini API

## 📂 Project Structure

```
/
├── components/          # Reusable React components
│   ├── Column.tsx
│   ├── IssueCard.tsx
│   ├── IssueModal.tsx
│   ├── PriorityIcon.tsx
│   ├── ProjectModal.tsx
│   └── UserAvatar.tsx
├── services/            # Services for external APIs
│   └── geminiService.ts
├── App.tsx              # Main application component
├── constants.ts         # Mock data and constants
├── index.html           # Main HTML file
├── index.tsx            # React entry point
├── metadata.json        # Application metadata
└── types.ts             # TypeScript type definitions
```

## ⚙️ Getting Started

1.  **Prerequisites**: Ensure you have a modern web browser.
2.  **API Key**: The application expects a Google Gemini API key to be available as an environment variable (`process.env.API_KEY`).
3.  **Run the App**: Open the `index.html` file in your browser to launch the application.
