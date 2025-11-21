import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LinksPage from "./pages/LinksPage";
import type { JSX } from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { accessToken, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!accessToken) return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/links"
          element={
            <PrivateRoute>
              <LinksPage />
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
