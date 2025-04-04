# Expenses App - AI-Powered Receipt Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A web application for tracking expenses with automated receipt scanning via AI OCR and multi-user support.

## Features

✔ **Receipt Processing** (`index.html`)
- Upload receipts (images/PDFs) associated with a Trip Name.
- Automatic extraction of:
  - Date
  - Amount
  - Vendor
  - Location
  - Expense type
- View list of expenses grouped by trip.

✔ **Trip Management** (`trips.html`)
- Create, view, and delete Trips.
- Link to view/add expenses for a specific trip (navigates to `index.html`).
- Export trip expenses to Excel (.xlsx) (Requires login).

✔ **OCR Settings** (`settings.html`)
- Configure OCR Settings (Provider, API Keys, Models).
- Test OCR functionality.
- Requires login.

✔ **Multi-User Support**
- User Registration & Login
- Secure password hashing (bcrypt)
- JWT-based authentication
- Expenses and Trips isolated per user

✔ **User Interface**
- Responsive mobile-friendly design
- Receipt thumbnails with zoom
- Instant notifications
- Grouped expense listing
- Improved API Key input fields

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/oghenetejiriorukpegmail/expense-tracker-multi-user.git
    cd expense-tracker-multi-user
    ```

2.  **Install backend dependencies**:
    ```bash
    cd backend
    npm install
    ```

3.  **Configure Environment Variables**:
    - Go to the `backend` directory.
    - Create a file named `.env`.
    - Add the following lines, replacing the value with a strong, unique secret key:
      ```env
      # backend/.env
      JWT_SECRET=your_very_strong_and_secret_key_here_for_jwt
      # Optional: Add API keys for AI providers if you plan to use them
      # GEMINI_API_KEY=your_gemini_key
      # OPENAI_API_KEY=your_openai_key
      # CLAUDE_API_KEY=your_claude_key
      # OPENROUTER_API_KEY=your_openrouter_key
      ```

4.  **Run the server**:
    ```bash
    # From the backend directory
    npm start
    # Or: node server.js
    ```
    The SQLite database (`expenses.db`) will be created automatically in the `backend` directory on first run.

5.  **Access the app**:
    Open `http://localhost:3000` in your browser. Register a new user or log in. You can navigate between Trips (`trips.html`), Add Expense (`index.html`), and Settings (`settings.html`) using the navigation bar after logging in.

## Configuration

- **User Accounts**: Register and log in via the UI. Each user's expenses and trips are kept separate.
- **OCR Settings**: Configure OCR settings via the Settings page (`/settings.html`) after logging in:
  - Choose OCR provider (Tesseract, Gemini, OpenAI, Claude, OpenRouter).
  - Enter API keys for the desired AI providers. These keys are saved server-side in the `backend/.env` file via the `/api/update-env` endpoint (requires login).
  - Select preferred models (where applicable).
  - **Note:** Ensure the server process has write permissions to `.env` if running in restricted environments. A server restart might be needed for `.env` changes to fully apply in all cases.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (`script.js`, `settings.js`, `trips.js`)
- **Backend**: Node.js, Express
- **Database**: SQLite (`backend/expenses.db`)
- **Authentication**: JWT (`jsonwebtoken`), Password Hashing (`bcrypt`)
- **OCR**:
  - Tesseract.js (default, via `utils/ocr.js`)
  - Google Gemini, OpenAI, Claude, OpenRouter (via `utils/ocr.js`)
- **API Key Storage**: `.env` file on the backend (managed via Settings UI -> `/api/update-env` endpoint)
- **Excel Export**: SheetJS/xlsx
- **Testing**: Jest

## Future Roadmap

See [PLAN.md](PLAN.md) for detailed development roadmap including:
- Advanced analytics
- Cloud storage options (e.g., S3 for receipts)
- Mobile app version
- Shared trips/expenses between users (optional)

## License

MIT License - see [LICENSE](LICENSE) file for details