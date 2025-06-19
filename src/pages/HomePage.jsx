import HeroSection from "../features/home/HeroSection";
import FeaturedCatagories from "../features/home/FeaturedCatagories";
import ProductsList from "../features/shop/ProductsList";
import Banner from "../features/home/Banner";

function HomePage() {
  return (
    <div>
      <HeroSection />
      <main className="px-4 sm:px-6 lg:px-16">
        <section className="mb-8 pb-8">
          <h3 className="mb-4 text-2xl font-bold sm:text-3xl">
            Featured Categories
          </h3>
          <FeaturedCatagories />
        </section>
        <ProductsList fromHome={true} />
        <Banner />
      </main>
    </div>
  );
}

export default HomePage;
