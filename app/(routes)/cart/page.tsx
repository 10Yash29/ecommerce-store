'use client';

import { useAuth } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";
import useCart from "@/hooks/use-cart";
import Container from "@/components/ui/container";
import CartItem from "@/app/(routes)/cart/components/cart-item";
import { Summary } from "@/app/(routes)/cart/components/summary";

const Cart = () => {
    const { isSignedIn } = useAuth();
    const cart = useCart();

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return (
        <div className="bg-white">
            <Container>
                <div className="px-4 py-16 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
                    <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                        <div className="lg:col-span-7">
                            {cart.items.length === 0 && <p className="text-neutral-500">No items added to cart.</p>}
                            <ul>
                                {cart.items.map((item) => (
                                    <CartItem key={item.id} data={item} />
                                ))}
                            </ul>
                        </div>
                        <Summary />
                    </div>
                </div>
            </Container>
        </div>
    );
};
export default Cart;
