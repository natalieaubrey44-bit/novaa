import Hero from '../components/sections/Hero';
import Products from '../components/sections/Products';
import InterestRatePromos from '../components/sections/InterestRatePromos';
import SmartMoney from '../components/sections/SmartMoney';
import MobileBanking from '../components/sections/MobileBanking';
import Security from '../components/sections/Security';
import Loans from '../components/sections/Loans';
import FinancialTools from '../components/sections/FinancialTools';
import ImageShowcase from '../components/sections/ImageShowcase';
import Testimonials from '../components/sections/Testimonials';
import Resources from '../components/sections/Resources';
import FinalCta from '../components/sections/FinalCta';

export default function Home() {
  return (
    <div className="w-full relative">
      <Hero />
      <Products />
      <InterestRatePromos />
      <SmartMoney />
      <MobileBanking />
      <Security />
      <Loans />
      <FinancialTools />
      <ImageShowcase />
      <Testimonials />
      <Resources />
      <FinalCta />
    </div>
  );
}
