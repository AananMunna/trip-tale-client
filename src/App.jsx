import "./App.css";
import AdventurePackages from "./components/AdventurePackages";
import CulinaryTrails from "./components/CulinaryTrails";
import EcoFriendlyTips from "./components/EcoFriendlyTips";
import FAQSection from "./components/FAQSection";
import Hero from "./components/Hero";
import OverviewSection from "./components/OverviewSection";
import TourismAndGuideTabs from "./components/TourismAndGuideTabs";
import TouristStoriesSection from "./components/TouristStoriesSection";
import TravelerReviews from "./components/TravelerReviews";

function App() {
  return (
    <div>
      <Hero></Hero>
      <OverviewSection></OverviewSection>
      <TourismAndGuideTabs></TourismAndGuideTabs>
      <EcoFriendlyTips></EcoFriendlyTips>
      <AdventurePackages></AdventurePackages>
      <TouristStoriesSection></TouristStoriesSection>
      <CulinaryTrails></CulinaryTrails>
      <TravelerReviews></TravelerReviews>
      <FAQSection></FAQSection>
    </div>
  );
}

export default App;
