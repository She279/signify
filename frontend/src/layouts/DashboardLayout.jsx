import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { FullPageLoader } from "../components/Loader.jsx";

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader label="Checking your session…" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-6xl px-5 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
