import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailPage } from "@/pages/ProductDetail";

export const Route = createFileRoute("/product/$slug")({
  component: ProductDetailPageWrapper
});

function ProductDetailPageWrapper() {
  const { slug } = Route.useParams();
  return <ProductDetailPage slug={slug} />;
}
