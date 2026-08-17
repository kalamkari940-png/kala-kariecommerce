import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/pages/AdminDashboard";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage
});
