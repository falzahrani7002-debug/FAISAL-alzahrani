
import React from 'react';
import { Page } from '../types';

interface HomePageProps {
  navigateTo: (page: Page) => void;
}

const InsulinPumpHeroIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path fill="#0EA5E9" d="M47.7,-64.8C61.8,-53.3,73.4,-39,78.2,-22.7C83,-6.4,81,11.8,73,26.4C65,41.1,51.1,52.2,36.2,60.5C21.3,68.7,5.5,74.1,-11.2,74.7C-27.9,75.3,-45.6,71.1,-58.5,60.7C-71.4,50.3,-79.5,33.7,-81.4,16.5C-83.3,-0.7,-79,-18.5,-70.1,-33.5C-61.2,-48.5,-47.7,-60.7,-33,-69.1C-18.3,-77.5,-2.5,-82,14.1,-79.8C30.7,-77.6,47.7,-68.8,47.7,-64.8Z" transform="translate(100 100)" />
    <g transform="translate(60, 50) scale(0.8)">
      <rect x="10" y="20" width="80" height="120" rx="15" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="4"/>
      <rect x="25" y="35" width="50" height="50" rx="5" fill="#E0F2FE" />
      <path d="M 40 65 Q 50 75 60 65" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="52" r="3" fill="#0284C7" />
      <circle cx="58" cy="52" r="3" fill="#0284C7" />
      <path d="M 90 80 C 110 70, 120 100, 140 90" stroke="#38BDF8" strokeWidth="4" fill="none" />
      <circle cx="50" cy="105" r="8" fill="#38BDF8" />
    </g>
    <g transform="translate(125, 75) rotate(15)">
       <path d="M 0 0 C 20 10, 20 40, 0 50 L -10 25 Z" fill="#F43F5E"/>
    </g>
  </svg>
);

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  return (
    <div className="relative bg-gradient-to-br from-sky-100 to-yellow-50 text-center py-20 px-6 min-h-[calc(100vh-68px)] flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute top-10 -left-24 w-72 h-72 bg-sky-200 rounded-full opacity-50 filter blur-xl z-0"></div>
      <div className="absolute bottom-10 -right-24 w-72 h-72 bg-blue-200 rounded-full opacity-50 filter blur-xl z-0"></div>
      
      <div className="container mx-auto max-w-4xl z-10">
        <div className="w-56 h-56 mx-auto mb-8">
          <InsulinPumpHeroIcon />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-sky-800 mb-4">أهلاً بك في عالم أبطال السكري!</h1>
        <p className="text-lg text-gray-600 mb-12">مكانك الآمن لتتعلم، تلعب، وتشارك رحلتك مع السكري بكل قوة وإيجابية.</p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16">
          <button 
            onClick={() => navigateTo(Page.Kids)}
            className="w-full md:w-auto bg-sky-500 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:bg-sky-600 transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            🔹 أنا طفل سكّري
          </button>
          <button 
            onClick={() => navigateTo(Page.Parents)}
            className="w-full md:w-auto bg-blue-500 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            🔹 أنا ولي أمر
          </button>
        </div>

        {/* New Achievement Link */}
        <div className="mt-8">
            <a 
                href="https://falzahrani.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/80 border-2 border-sky-400 text-sky-700 font-bold py-3 px-8 rounded-2xl shadow-sm hover:shadow-md hover:bg-sky-50 transition-all group"
            >
                <span className="text-2xl group-hover:rotate-12 transition-transform">🔗</span>
                <span className="text-lg">لمحة عن إنجازاتي</span>
            </a>
        </div>
        
        <p className="mt-16 text-gray-500 italic">مضخة الأنسولين الصديقة، رفيقك في رحلة البطولة!</p>
      </div>
    </div>
  );
};

export default HomePage;
