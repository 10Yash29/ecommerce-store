'use client';

import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

const NavBarActions = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const cart = useCart();
    const { isSignedIn } = useUser();

    useEffect(() => {
        setIsMounted(true); // Ensure component renders only on the client
    }, []);

    if (!isMounted) {
        return null; // Avoid hydration errors
    }

    return (
        <div className="ml-auto flex items-center gap-x-4">
            {isSignedIn ? (
                // User button for signed-in users
                <UserButton />
            ) : (
                <div className="flex gap-x-2">
                    {/* Sign In Button */}
                    <SignInButton>
                        <Button className="px-4 py-2 bg-blue-600 text-white rounded">
                            Sign In
                        </Button>
                    </SignInButton>
                    {/* Sign Up Button */}
                    <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
                </div>
            )}
            {/* Cart Button */}
            <div onClick={() => router.push("/cart")} className="flex items-center gap-x-4 cursor-pointer">
                <Button className="flex items-center rounded-full px-4 py-2 bg-gray-800 text-white">
                    <ShoppingBag size={20} />
                    <span className="ml-2 text-sm font-medium">{cart.items.length}</span>
                </Button>
            </div>
        </div>
    );
};

export default NavBarActions;
