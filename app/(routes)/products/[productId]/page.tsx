// app/(routes)/products/[productId]/page.tsx

import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Container from "@/components/ui/container";
import Gallery from "@/components/gallery";
import ProductList from "@/components/productList";
import Info from "@/components/info";

// Remove React.FC usage—Next.js App Router pages are just async functions
export const revalidate = 0;

// Inline the type for `params` instead of using a custom interface
export default async function ProductPage({
                                              params,
                                          }: {
    params: { productId: string };
}) {
    // 1. Fetch the main product by ID
    const product = await getProduct(params.productId);

    // 2. Fetch related/suggested products (e.g., same category)
    const suggestedProducts = await getProducts({
        categoryId: product?.category?.id,
    });

    // 3. Handle the not-found case
    if (!product) {
        return null; // or some 404 UI / redirect
    }

    // 4. Render your layout
    return (
        <div className="bg-white">
            <Container>
                <div className="px-4 py-10 sm:px-6 lg:px-8">
                    {/* Product Images & Gallery */}
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                        <Gallery images={product.images} />
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <Info data={product} />
                        </div>
                    </div>
                    <hr className="my-10" />
                    {/* Related / suggested items */}
                    <ProductList title="Related Items" products={suggestedProducts} />
                </div>
            </Container>
        </div>
    );
}
