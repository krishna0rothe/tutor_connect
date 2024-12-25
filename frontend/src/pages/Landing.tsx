import React from 'react';
import HeroSection from '../components/lending/HeroSection';
import FeaturesOverview from '../components/lending/FeaturesOverview';
import CallToAction from '../components/lending/CallToAction';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <HeroSection />
      <FeaturesOverview />
      <CallToAction />
    </div>
  );
}

export default Landing;

