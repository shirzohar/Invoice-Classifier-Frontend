// src/components/Header.tsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { username, logout, isLoading } = useAuth();

  if (isLoading) return null; // מחכה לטעינת הקונטקסט

  return (
    <header className="bg-gray-100 border-b shadow px-6 py-3 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-semibold text-gray-700">
        BusyMatch 💼
      </Link>

      <div className="flex items-center gap-4">
        {username ? (
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
