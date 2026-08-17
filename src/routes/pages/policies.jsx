import { createFileRoute } from "@tanstack/react-router";
import { PoliciesPage } from "@/pages/PoliciesPage";

export const Route = createFileRoute("/policies")({
  component: PoliciesPage
});
