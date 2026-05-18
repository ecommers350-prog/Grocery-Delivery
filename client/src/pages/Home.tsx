import AppPromoBanner from "../components/Home/AppPromoBanner"
import Features from "../components/Home/Features"
import Hero from "../components/Home/Hero"
import HomeCategories from "../components/Home/HomeCategories"
import NewsLetter from "../components/Home/NewsLetter"
import PopulerProducts from "../components/Home/PopulerProducts"

const Home = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Hero />
      <Features />
      <HomeCategories />
      <PopulerProducts />
      <AppPromoBanner />
      <NewsLetter />
    </div>
  )
}

export default Home
