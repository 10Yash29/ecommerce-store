'use client';

import { Products } from "@/types";
import Image from "next/image";
import IconButton from "@/components/ui/icon-button";
import { Expand, ShoppingCart } from "lucide-react";
import Currency from "@/components/ui/currency";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";
import usePreviewModal from "@/hooks/use-preview-modals";
import useCart from "@/hooks/use-cart";

interface ProductCardProps {
    data: Products;
}

const ProductCard = ({ data }: ProductCardProps) => {
    const router = useRouter();
    const cart = useCart();
    const previewModal = usePreviewModal();

    const HandleClick = () => {
        router.push(`/products/${data?.id}`);
    };

    const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        previewModal.onOpen(data);
    };

    const AddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        cart.addItem(data);
    };

    return (
        <div
            onClick={HandleClick}
            className="bg-white group space-y-4 cursor-pointer rounded-xl border p-3 sm:p-5"
        >
            {/* Ensure the image wrapper has a white background */}
            <div className="aspect-square bg-white rounded-xl relative">
                <Image
                    src={data?.images?.[0]?.url}
                    alt="Product Image"
                    fill
                    className="aspect-square object-cover rounded-md"
                />
                {/* Hover actions */}
                <div className="opacity-0 group-hover:opacity-100 transition absolute px-6 bottom-5 w-full">
                    <div className="flex gap-6 justify-center">
                        <IconButton
                            onClick={onPreview}
                            icon={<Expand size={20} className="text-gray-600" />}
                        />
                        <IconButton
                            onClick={AddToCart}
                            icon={<ShoppingCart size={20} className="text-gray-600" />}
                        />
                    </div>
                </div>
            </div>
            {/* Product Information */}
            <div>
                <p className="font-semibold text-lg sm:text-xl">{data.name}</p>
                <p className="text-sm text-gray-500 sm:text-base">
                    {data.category?.name}
                </p>
            </div>
            {/* Price */}
            <div className="flex items-center justify-between">
                <Currency value={data?.price} />
            </div>
        </div>
    );
};
export default ProductCard;
