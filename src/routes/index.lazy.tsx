import { createLazyFileRoute } from '@tanstack/react-router';

import { FacebookSection } from '@/components/custom/sections/facebook-section';
import { HeroSection } from '@/components/custom/sections/hero-section';
import { OfferSection } from '@/components/custom/sections/offer-section';
import { TeamSection } from '@/components/custom/sections/team-section';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <OfferSection />
      <TeamSection />
      <FacebookSection />
    </div>
  );
}
