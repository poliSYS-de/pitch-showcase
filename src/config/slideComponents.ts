import HeroSlide from "@/components/slides/HeroSlide";
import CorporateOverviewSlide from "@/components/slides/CorporateOverviewSlide";
import MarketOpportunitySlide from "@/components/slides/MarketOpportunitySlide";
import ProductDemoSlide from "@/components/slides/ProductDemoSlide";
import VibeTradingSlide from "@/components/slides/VibeTradingSlide";
import VibeLevelsSlide from "@/components/slides/VibeLevelsSlide";
import LFMSlide from "@/components/slides/LFMSlide";
import GoToMarketSlide from "@/components/slides/GoToMarketSlide";
import MarketingGrowthSlide from "@/components/slides/MarketingGrowthSlide";
import FullScaleGrowthSlide from "@/components/slides/FullScaleGrowthSlide";
import FinanceSlide from "@/components/slides/FinanceSlide";
import TeamSlide from "@/components/slides/TeamSlide";
import AskSlide from "@/components/slides/AskSlide";
import ClosingSlide from "@/components/slides/ClosingSlide";
import CompanySlide from "@/components/slides/CompanySlide";
import FeaturesSlide from "@/components/slides/FeaturesSlide";
import ProductSlide from "@/components/slides/ProductSlide";
import VisionSlide from "@/components/slides/VisionSlide";
import VisualsSlide from "@/components/slides/VisualsSlide";
import LFMConstructionSlide from "@/components/slides/LFMConstructionSlide";
import LFMDesignSlide from "@/components/slides/LFMDesignSlide";
import LFMOpportunitySlide from "@/components/slides/LFMOpportunitySlide";

export const SLIDE_COMPONENTS: Record<string, React.ComponentType<{ deckPosition?: number; slideTag?: string; slideLabel?: string }>> = {
  HeroSlide,
  CorporateOverviewSlide,
  MarketOpportunitySlide,
  ProductDemoSlide,
  VibeTradingSlide,
  VibeLevelsSlide,
  LFMSlide,
  GoToMarketSlide,
  MarketingGrowthSlide,
  FullScaleGrowthSlide,
  FinanceSlide,
  TeamSlide,
  AskSlide,
  ClosingSlide,
  CompanySlide,
  FeaturesSlide,
  ProductSlide,
  VisionSlide,
  VisualsSlide,
  LFMConstructionSlide,
  LFMDesignSlide,
  LFMOpportunitySlide,
};
