import Container from "@/components/ui/container";
import Link from "next/link";
import MainNav from "@/components/MainNav";
import getCategories from "@/actions/get-categories";
import NavBarActions from "@/components/NavBarActions";

const Navbar = async () => {
    const categories = await getCategories(); // Fetch categories dynamically

    return (
        <div className="border-b">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
                    {/* Store Logo */}
                    <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
                        <p className="font-bold text-xl">STORE</p>
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
