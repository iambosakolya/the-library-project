import dynamic from 'next/dynamic';
import { getLandingPageData } from '@/lib/actions/landing.actions';

// Lazy-load sections below the fold for performance
const HeroSection = dynamic(() => import('@/components/landing/hero-section'), {
  ssr: true,
});
const FeaturesSection = dynamic(
  () => import('@/components/landing/features-section'),
  { ssr: true },
);
const HowItWorksSection = dynamic(
  () => import('@/components/landing/how-it-works-section'),
  { ssr: true },
);
const CommunityStatsSection = dynamic(
  () => import('@/components/landing/community-stats-section'),
  { ssr: true },
);
const EventsPreviewSection = dynamic(
  () => import('@/components/landing/events-preview-section'),
  { ssr: true },
);
const TestimonialsSection = dynamic(
  () => import('@/components/landing/testimonials-section'),
  { ssr: true },
);
const CTASection = dynamic(() => import('@/components/landing/cta-section'), {
  ssr: true,
});

export default async function LandingPage() {
  const { events, clubs, stats } = await getLandingPageData();

  return (
    <>
      <HeroSection />
      <div id='features'>
        <FeaturesSection />
      </div>
      <div id='how-it-works'>
        <HowItWorksSection />
      </div>
      <div id='community'>
        <CommunityStatsSection data={stats} />
      </div>
      <div id='events'>
        <EventsPreviewSection events={events} clubs={clubs} />
      </div>
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
