import React, { useState } from 'react';
import { Page } from '../types';
import { useStars } from '../starManager';

interface HeaderProps {
  navigateTo: (page: Page) => void;
  currentPage: Page;
}

const DiabetesIcon: React.FC = () => (
    <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="شعار مرض السكري" role="img">
      <circle cx="50" cy="50" r="45" fill="none" stroke="#0ea5e9" strokeWidth="10" />
    </svg>
);

const StarDisplay: React.FC = () => {
  const stars = useStars();
  return (
    <div className="flex items-center gap-x-1 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full">
      <span>⭐</span>
      <span>{stars}</span>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ navigateTo, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { page: Page.Home, label: 'الرئيسية' },
    { page: Page.Kids, label: 'قسم الأطفال' },
    { page: Page.Games, label: 'ألعاب السكر' },
    { page: Page.Parents, label: 'قسم ولي الامر' },
    { page: Page.Tracker, label: 'مفكرة السكر' },
    { page: Page.MyJourney, label: 'رحلتي مع السكّر' },
    { page: Page.SmartChoices, label: 'اختيارات ذكية' },
    { page: Page.Community, label: 'مجتمع أصدقائي' },
    { page: Page.Educational, label: 'أفكار تعليمية' },
    { page: Page.InsulinFriend, label: 'صديقي الإنسولين' },
    { page: Page.StarCollection, label: 'تجميع النجوم' },
    { page: Page.CarbCalculator, label: 'حاسبة الكاربوهيدرات' },
  ];

  return (
    <header className="bg-sky-100 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-sky-800 cursor-pointer flex items-center gap-x-2"
          onClick={() => navigateTo(Page.Home)}
        >
          <DiabetesIcon />
          <span>مساعدي السكّري</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-reverse space-x-6">
          <ul className="flex items-center space-x-reverse space-x-6">
            {navItems.map(item => (
              <li key={item.page}>
                <button
                  onClick={() => navigateTo(item.page)}
                  className={`text-lg transition-colors duration-300 ${
                    currentPage === item.page
                      ? 'text-sky-700 font-bold border-b-2 border-sky-700'
                      : 'text-sky-600 hover:text-sky-800'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <StarDisplay />
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center">
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)} 
             className="text-sky-800 focus:outline-none"
             aria-label="Toggle menu"
             aria-expanded={isMenuOpen}
            >
            {isMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-sky-100 border-t border-sky-200">
          <ul className="flex flex-col items-center">
            {navItems.map(item => (
              <li key={item.page} className="w-full">
                <button
                  onClick={() => {
                    navigateTo(item.page);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-center py-3 text-lg transition-colors duration-300 ${
                    currentPage === item.page
                      ? 'text-sky-700 font-bold bg-sky-200'
                      : 'text-sky-600 hover:bg-sky-200'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
             <li className="py-4">
              <StarDisplay />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;