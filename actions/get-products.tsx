import {Products} from "@/types";
import qs from "query-string";

const Url = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query{
    categoryId?: string,
    sizeId?: string,
    colorId?: string,
    isFeatured?: boolean
}

const getProducts = async (query: Query):Promise<Products[]> => {

    const url = qs.stringifyUrl({
        url: Url,
        query:{
            categoryId:query.categoryId,
            colorId:query.colorId,
            sizeId:query.sizeId,
            isFeatured:query.isFeatured,
        }
    })
    const res = await fetch(url)
    return res.json();
}
export default getProducts;