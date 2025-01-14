import Image from "next/image";

const About = () => {
    return (
        <div className="container mx-auto px-6 py-12">

            <h2 className="text-4xl font-bold text-center mb-8">About Us</h2>

            <section className="flex flex-col lg:flex-row items-center gap-12">
                <div className="w-full lg:w-2/5">
                    <Image
                        src="/footy.svg"
                        alt="About Us"
                        width={450}
                        height={330}
                        className="rounded-lg shadow-md"
                    />
                </div>
                <div className="w-full lg:w-3/5">
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        Welcome to our football kits e-commerce store &ndash; your one-stop shop for all things football.
                        We specialize in offering a wide variety of high-quality football kits for teams and players around the world.
                        Whether you&apos;re a die-hard fan or a casual supporter, we provide the best selection of jerseys, shorts, socks, and more to showcase your love for the game.
                    </p>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        Our mission is to bring football enthusiasts closer to their favorite teams by providing authentic
                        and stylish kits at affordable prices. We work closely with trusted suppliers to ensure all our
                        products meet the highest standards of quality and comfort.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        At our store, we aim to create a seamless shopping experience tailored to the needs of football fans.
                        With a user-friendly interface, secure payment options, and fast delivery, shopping for your favorite
                        kits has never been easier. Join us and celebrate the beautiful game with the best football merchandise available online.
                    </p>
                </div>
            </section>

            <section className="mt-16">
                <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md text-center">
                        <h4 className="text-xl font-bold mb-2">Authentic Products</h4>
                        <p className="text-gray-600">
                            All our kits are sourced from trusted suppliers to guarantee authenticity and quality.
                        </p>
                    </div>
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md text-center">
                        <h4 className="text-xl font-bold mb-2">Wide Range of Teams</h4>
                        <p className="text-gray-600">
                            Support your favorite team with kits from top leagues and tournaments around the world.
                        </p>
                    </div>
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md text-center">
                        <h4 className="text-xl font-bold mb-2">Customer-Centric Service</h4>
                        <p className="text-gray-600">
                            Enjoy a seamless shopping experience with secure payment options, fast delivery,
                            and excellent customer support.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
