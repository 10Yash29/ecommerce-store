import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import getColors from "@/actions/get-colors";
import getCategory from "@/actions/get-category";
import Container from "@/components/ui/container";
import Billboard from "@/components/Billboard";
import Filter from "./components/filter";
import ProductCard from "@/components/ProductCard";
import { Products } from "@/types";


export const revalidate = 0;

interface CategoryPageProps {
    params: Promise<{ categoryId: string }>;
    searchParams: {
        colorId?: string;
        sizeId?: string;
    };
}

const CategoryPage = async ({
                                params,
                                searchParams,
                            }: CategoryPageProps) => {
    const { categoryId } = await params;
    const products = await getProducts({
        categoryId,
        colorId: searchParams.colorId || undefined,
        sizeId: searchParams.sizeId || undefined,
    });

    const sizes = await getSizes();
    const colors = await getColors();
    const category = await getCategory(categoryId);

    return (
        <div className="bg-white">
            <Container>
                <Billboard data={category.billboard} />
                <div className="px-4 sm:px-6 lg:px-8 pb-24">
                    <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                        <div className="hidden lg:block">
                            <Filter data={sizes} valueKey="sizeId" name="Sizes" />
                            <Filter data={colors} valueKey="colorId" name="Colors" />
                        </div>
                        <div className="mt-6 lg:col-span-4 lg:mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {products?.map((product: Products) => (
                                    <ProductCard data={product} key={product.id} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default CategoryPage;
