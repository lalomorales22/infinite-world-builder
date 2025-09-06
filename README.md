# Infinite World Builder

[![GitHub Repo](https://img.shields.io/badge/GitHub-lalomorales22/Infinite--world--builder-blue)](https://github.com/lalomorales22/Infinite-world-builder)

An infinite, zoomable, and navigable 2D canvas that empowers users to build vast, cohesive worlds, one grid-section at a time, using generative AI. The entire user experience—from the visual interface to the tool interactions—is designed to evoke the distinct retro aesthetic and simplicity of Microsoft Paint from the Windows 95 era.

The generated world itself adheres to a top-down, strategic map perspective reminiscent of classic RTS games like *Command & Conquer: Red Alert 2*.

## Core Features

-   **Infinite Canvas**: A conceptually infinite, grid-based world that you can pan and zoom through. The world is built dynamically as you explore.
-   **AI-Powered Generation**: Leverages the Google Gemini API to generate all visual content, ensuring a unique and creative experience.
-   **Two-Layer Prompting System**:
    1.  **Global Theme Prompt**: A high-level directive that sets the foundational aesthetic, color palette, and environmental rules for the entire map (e.g., "A post-apocalyptic Earth where cities are flooded ruins"). This generates the base terrain for the entire world.
    2.  **Local Feature Prompt**: After selecting a specific area on the grid, you can provide a detailed prompt to generate specific features like buildings, roads, forests, or military outposts that seamlessly blend with the surrounding terrain.
-   **Retro UI/UX**: All UI elements, from the toolbar to the pop-up windows, are styled to look and feel like a classic Windows 95 application, complete with pixelated icons and a classic grey color palette.
-   **Dynamic Contextual Generation**: The AI is provided with context about adjacent tiles (e.g., "the area to the north contains a dense forest") to ensure generated features blend naturally with their surroundings.

## Getting Started

Follow these steps to get a local copy of the application up and running.

### Prerequisites

-   Node.js and npm (or your preferred package manager)
-   Git
-   A **Google Gemini API Key**. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/lalomorales22/Infinite-world-builder.git
    cd Infinite-world-builder
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    The application loads your Gemini API key from the environment. You will need to provide it for the AI generation to work. The application expects this to be available under `process.env.API_KEY`.

4.  **Run the application:**
    Once your API key is configured in your environment, start the development server.
    ```sh
    npm run start 
    # Or 'npm run dev' depending on your project setup
    ```

5.  **Open in your browser:**
    Navigate to `http://localhost:3000` (or the port specified in your terminal) to begin building your world.

## How to Use

1.  **Set the Global Theme**: Upon loading the app, enter a descriptive prompt for the overall world you want to create in the "Global Theme" text area.
2.  **Generate Base Terrain**: Click the "Generate Base Terrain" button. The AI will create a tileable base texture that will serve as the foundation for your entire map.
3.  **Select an Area**: Use the "Select" tool (active by default) to click and drag a rectangle over the grid.
4.  **Generate Local Features**: Write a prompt in the "Local Feature" text area describing what you want to create in the selected area, then click "Generate Feature".
5.  **Zoom and Explore**: Use your mouse scroll wheel or the zoom buttons in the toolbar to zoom in and out of your creation.

## Development

### Mock API Mode

To test the UI and application flow without using your Gemini API quota, you can enable Mock Mode.

1.  Open the file `src/services/geminiService.ts`.
2.  Change the `MOCK_API` constant at the top of the file to `true`.
    ```typescript
    const MOCK_API = true;
    ```
3.  The app will now return placeholder images instead of calling the real API, allowing you to test functionality without cost. Remember to set it back to `false` for actual image generation.

### Technology Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Inline CSS-in-JS (for dynamic styles), global stylesheet for Win95 theme
-   **AI**: Google Gemini API (`@google/genai`)
-   **Bundler/Dev Server**: Vite (or Create React App)
