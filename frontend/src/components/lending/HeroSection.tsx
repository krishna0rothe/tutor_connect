import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import book from '../../assets/book.png';
import globe from '../../assets/globe.png';
import pencil from '../../assets/pencil.png';
import result from '../../assets/result.png';
import star from '../../assets/star.png';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    if (taglineRef.current && ctaRef.current) {
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          '.floating-element',
          { y: 0 },
          { y: -20, duration: 1.5, repeat: -1, yoyo: true, ease: 'power1.inOut' },
          '-=0.5'
        );
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1
          ref={taglineRef}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
        >
          Revolutionize Your Learning Experience
        </h1>
        <p className="text-xl sm:text-2xl mb-8">
          Unlock your potential with our innovative educational platform
        </p>
        <button
          ref={ctaRef}
          className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(255,255,255,0.7"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(255,255,255,0.5)"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(255,255,255,0.3)"
            />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
      <div className="absolute top-1/4 left-1/4 floating-element">
        <img
          src={book}
          alt="Floating book"
          className="w-16 h-16 opacity-70"
        />
      </div>
      <div className="absolute top-1/4 right-1/4 floating-element">
        <img
          src={globe}
          alt="Floating globe"
          className="w-16 h-16 opacity-70"
        />
      </div>
      <div className="absolute bottom-1/4 left-1/4 floating-element">
        <img
          src={pencil}
          alt="Floating pencil"
          className="w-16 h-16 opacity-70"
        />
      </div>
      <div className="absolute bottom-1/4 right-1/4 floating-element">
        <img
          src={result}
          alt="Floating result"
          className="w-16 h-16 opacity-70"
        />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 floating-element">
        <img
          src={star}
          alt="Floating star"
          className="w-20 h-20 opacity-80"
        />
      </div>
    </section>
  );
}

export default HeroSection;

