import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Container from "@/components/ui/container";
import Gallery from "@/components/gallery";
import ProductList from "@/components/productList";
import Info from "@/components/info";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { productId?: string } }) {
    // Log params for debugging
    console.log("Params:", params);

    // Validate params and productId
    if (!params?.productId) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-bold">Invalid or missing Product ID.</p>
            </div>
        );
    }

    let product;
    try {
        // Fetch the product details
        product = await getProduct(params.productId);
    } catch (error) {
        console.error("Error fetching product:", error);
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-bold">Error loading product details.</p>
            </div>
        );
    }

    // Handle product not found
    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-bold">Product not found.</p>
            </div>
        );
    }

    let suggestedProducts = [];
    try {
        // Fetch related/suggested products
        if (product.category?.id) {
            suggestedProducts = await getProducts({ categoryId: product.category.id });
        }
    } catch (error) {
        console.error("Error fetching suggested products:", error);
    }

    // Render the product details and related products
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
                    {suggestedProducts.length > 0 ? (
                        <ProductList title="Related Items" products={suggestedProducts} />
                    ) : (
                        <p className="text-center text-gray-500">No related items available.</p>
                    )}
                </div>
            </Container>
        </div>
    );
}
