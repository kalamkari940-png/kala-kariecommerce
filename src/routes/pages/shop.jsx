import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/pages/Shop";

export const Route = createFileRoute("/shop")({
  validateSearch: (search) => ({
    category: search?.category || "",
    search: search?.search || ""
  }),
  component: ShopPageWrapper
});

function ShopPageWrapper() {
  const searchParams = Route.useSearch();
  return <ShopPage searchParams={searchParams} />;
}
