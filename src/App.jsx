import "./App.css";
import AdventurePackages from "./components/AdventurePackages";
import CulinaryTrails from "./components/CulinaryTrails";
import EcoFriendlyTips from "./components/EcoFriendlyTips";
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
      <AdventurePackages></AdventurePackages>
      <TourismAndGuideTabs></TourismAndGuideTabs>
      <TouristStoriesSection></TouristStoriesSection>
      <EcoFriendlyTips></EcoFriendlyTips>
      <CulinaryTrails></CulinaryTrails>
      <TravelerReviews></TravelerReviews>
    </div>
  );
}

export default App;
