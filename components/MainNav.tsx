'use client'
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

interface MainNavProps {
    data: Category[];
}

const MainNav = ({ data }: MainNavProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();
    const routes = data.map((route) => ({
        href: `/category/${route.id}`,
        label: route.name,
        active: pathName === `/category/${route.id}`,
    }));

    return (
        <nav className="mx-6 flex items-center justify-between">
            {/* Mobile Toggle */}
            <button
                className="lg:hidden focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div
                className={cn(
                    "flex-col lg:flex lg:flex-row lg:space-x-6",
                    isOpen ? "flex" : "hidden lg:flex"
                )}
            >
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-base font-semibold tracking-wide transition-all hover:text-purple-500",
                            route.active ? "text-black" : "text-gray-600"
                        )}
                    >
                        {route.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default MainNav;
