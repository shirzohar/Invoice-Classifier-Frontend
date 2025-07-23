💻 Invoice Classifier Frontend
Frontend for the Invoice Classifier project – a responsive React web app for tracking expenses and uploading invoices with OCR. The app connects to the Invoice Classifier backend API and supports user authentication, expense categorization, and data visualization.

🚀 Key Features
📤 Upload invoices (PDF/images) and extract data via OCR

📊 Display categorized expenses in tables and graphs

🔐 User login and registration with JWT-based authentication

🎯 Responsive UI with Tailwind CSS

🔍 Filter, search, and edit expenses

🛠️ Technologies
React (TypeScript)

Tailwind CSS

Recharts (for charts)

Axios (for HTTP requests)

React Router

JWT stored in LocalStorage

▶️ Running Locally
Clone the repository:

bash
Copy
Edit
git clone https://github.com/shirzohar/invoice-classifier-frontend.git
cd invoice-classifier-frontend
Install dependencies:

bash
Copy
Edit
npm install
Set environment variables:

Create a .env file in the root with:

env
Copy
Edit
REACT_APP_API_BASE_URL=http://localhost:5000/api
Run the app:

bash
Copy
Edit
npm start
The app will run at http://localhost:3002


