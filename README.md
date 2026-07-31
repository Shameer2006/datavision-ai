# DataVision AI

DataVision AI is an intelligent data analytics platform that leverages artificial intelligence to analyze data through a natural language chat interface. It empowers users to extract insights from complex datasets by simply asking questions in plain English.

## Features

- **Natural Language Querying**: Interact with your data using everyday language.
- **AI-Powered Analytics**: Advanced AI models understand and process your data to deliver accurate insights.
- **Modern Web Interface**: Built with a responsive, fast, and user-friendly interface using Next.js.
- **Seamless Database Integration**: Integrated with Supabase for robust data management.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), React, TypeScript
- **Backend/Database**: Node.js, Supabase
- **Styling**: Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm, yarn, pnpm, or bun

## Getting Started

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd datavision-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy the example environment file and fill in the necessary values.
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Next.js App Router containing pages and layouts.
- `/backend`: Backend logic and services.
- `/components`: Reusable UI components.
- `/lib`: Utility functions and library wrappers.
- `/types`: TypeScript type definitions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License
