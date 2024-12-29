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
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="ml-auto flex flex-col sm:flex-row items-center gap-4">
            {isSignedIn ? (
                <UserButton />
            ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                    <SignInButton>
                        <Button className="px-4 py-2 bg-blue-600 text-white rounded">
                            Sign In
                        </Button>
                    </SignInButton>
                    <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
                </div>
            )}
            <div
                onClick={() => router.push("/cart")}
                className="flex items-center gap-4 cursor-pointer"
            >
                <Button className="flex items-center rounded-full px-4 py-2 bg-gray-800 text-white">
                    <ShoppingBag size={20} />
                    <span className="ml-2 text-sm font-medium">{cart.items.length}</span>
                </Button>
            </div>
        </div>
    );
};

export default NavBarActions;
