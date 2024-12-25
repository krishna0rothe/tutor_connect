import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Book, BarChart, Users, Calendar } from 'react-feather';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Book,
    title: 'Personalized Learning',
    description: 'Tailored courses to fit your unique learning style and pace.',
  },
  {
    icon: BarChart,
    title: 'Track Your Progress',
    description: 'Monitor your growth with detailed analytics and insights.',
  },
  {
    icon: Users,
    title: 'Collaborative Study',
    description: 'Connect with peers and experts for group learning sessions.',
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Learn at your own pace with on-demand video lessons.',
  },
];

const FeaturesOverview: React.FC = () => {
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');

      featureCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
            },
            delay: index * 0.1,
          }
        );
      });
    }
  }, []);

  return (
    <section
      id="features"
      ref={featuresRef}
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-600">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              <button className="mt-4 text-blue-500 font-medium hover:text-blue-600 transition-colors duration-300">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesOverview;

