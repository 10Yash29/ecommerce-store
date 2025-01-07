'use client';

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
    const [dropdownOpen, setDropdownOpen] = useState(false);
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

            {/* Navigation Links */}
            <div
                className={cn(
                    "flex-col lg:flex lg:flex-row lg:space-x-6",
                    isOpen ? "flex" : "hidden lg:flex"
                )}
            >
                {/* Dropdown for Collections */}
                <div className="relative">
                    <button
                        className="text-base font-semibold tracking-wide transition-all hover:text-purple-500 flex items-center space-x-1"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span>Collections</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transform transition ${
                                dropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown absolute left-0 mt-2 w-48">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "dropdown-item",
                                        route.active && "dropdown-item-active"
                                    )}
                                >
                                    {route.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Static Links */}
                <Link
                    href="/about"
                    className="text-base font-semibold tracking-wide transition-all hover:text-purple-500"
                >
                    About
                </Link>
                <Link
                    href="/contact"
                    className="text-base font-semibold tracking-wide transition-all hover:text-purple-500"
                >
                    Contact
                </Link>
            </div>
        </nav>
    );
};

export default MainNav;
