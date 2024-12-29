import NoResult from "@/components/ui/no-result";
import {Products} from "@/types";
import ProductCard from "@/components/ProductCard";

interface ProductListProps{
    title: string;
    products: Products[];
}

const ProductList = ({title, products}:ProductListProps)=>{
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-3xl">{title}</h3>
            {products.length === 0 && <NoResult/> }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product)=>(
                    <ProductCard key={product.id} data={product} />
                ))}
            </div>
        </div>
    );
};
export default ProductList;