import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import img from "../../assets/call_on_action.png"

gsap.registerPlugin(ScrollTrigger);

const CallToAction: React.FC = () => {
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={ctaRef}
      className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of learners and start your journey today!
            </p>
            <div className="flex space-x-4">
              <button className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
                Start Learning Today
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src={img}
              alt="Student learning"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;

