import "./App.css";
import AdventurePackages from "./components/AdventurePackages";
import CulinaryTrails from "./components/CulinaryTrails";
import EcoFriendlyTips from "./components/EcoFriendlyTips";
import Hero from "./components/Hero";
import OverviewSection from "./components/OverviewSection";
import TourismAndGuideTabs from "./components/TourismAndGuideTabs";
import TouristStoriesSection from "./components/TouristStoriesSection";

function App() {
  return (
    <div>
      <AdventurePackages></AdventurePackages>
      <Hero></Hero>
      <OverviewSection></OverviewSection>
      <TourismAndGuideTabs></TourismAndGuideTabs>
      <TouristStoriesSection></TouristStoriesSection>
      <EcoFriendlyTips></EcoFriendlyTips>
      <CulinaryTrails></CulinaryTrails>
    </div>
  );
}

export default App;
