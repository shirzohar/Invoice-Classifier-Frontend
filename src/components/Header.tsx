import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  // Get authentication state and actions from context
  const { username, logout, isLoading } = useAuth();

  // Wait for context to finish loading before rendering
  if (isLoading) return null;

  return (
    <header className="bg-gray-100 border-b shadow px-6 py-3 flex justify-between items-center">
      {/* Logo / Title link to dashboard */}
      <Link to="/dashboard" className="text-xl font-semibold text-gray-700">
        BusyMatch 💼
      </Link>

      <div className="flex items-center gap-4">
        {username ? (
          // If user is logged in, show greeting and logout button
          <>
            <span className="text-gray-600">שלום, {username}</span>
            <button
              onClick={logout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              התנתק
            </button>
          </>
        ) : (
          // If user is not logged in, show login link
          <Link
            to="/login"
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            התחברות
          </Link>
        )}
      </div>
    </header>
  );
}
