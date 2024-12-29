import Container from "@/components/ui/container";
import Link from "next/link";
import MainNav from "@/components/MainNav";
import getCategories from "@/actions/get-categories";
import NavBarActions from "@/components/NavBarActions";

const Navbar = async () => {
    const categories = await getCategories(); // Fetch categories dynamically

    return (
        <div className="sticky top-0 z-50 bg-white shadow-md">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                    {/* Store Logo */}
                    <Link href="/" className="flex items-center gap-x-3 group">
                        <div className="relative">
                            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-full shadow-md group-hover:scale-105 transition-transform">
                                <img
                                    src="/footy.svg"
                                    alt="Store Logo"
                                    className="h-14 w-14 rounded-full bg-white p-1"
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Main Navigation */}
                    <MainNav data={categories} />

                    {/* User and Cart Actions */}
                    <NavBarActions />
                </div>
            </Container>
        </div>
    );
};

export default Navbar;
