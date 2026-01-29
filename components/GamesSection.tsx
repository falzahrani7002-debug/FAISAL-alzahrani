
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { addStars, useStars } from '../starManager';
import { playSound } from '../soundManager';

// --- ICONS ---
const ChildIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 10c-3.87 0-7 1.57-7 3.5V19h14v-3.5c0-1.93-3.13-3.5-7-3.5z"/></svg>
);
const AdultIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
);
const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);
const SwitchUserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
    </svg>
);
const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

/** --- NEW GAME: ACTIVE HERO ADVENTURE --- **/
const ActiveHeroAdventure: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [glucose, setGlucose] = useState(50); // 0-100, 50 is perfect
    const [score, setScore] = useState(0);
    const [items, setItems] = useState<any[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const requestRef = useRef<number>(0);
    const lastItemTime = useRef<number>(0);

    const spawnItem = useCallback(() => {
        const types = [
            { emoji: '🍎', effect: 5, color: 'bg-green-400', label: 'صحي' },
            { emoji: '🥦', effect: 3, color: 'bg-green-500', label: 'ألياف' },
            { emoji: '🏃‍♂️', effect: -10, color: 'bg-blue-400', label: 'رياضة' },
            { emoji: '🍩', effect: 25, color: 'bg-red-400', label: 'سكر عالي!' },
            { emoji: '💉', effect: -30, color: 'bg-sky-400', label: 'إنسولين' },
            { emoji: '💧', effect: -2, color: 'bg-blue-300', label: 'ماء' }
        ];
        const item = types[Math.floor(Math.random() * types.length)];
        return {
            id: Date.now() + Math.random(),
            ...item,
            x: 100,
            y: 20 + Math.random() * 60,
            speed: 0.5 + Math.random() * 0.5
        };
    }, []);

    const update = useCallback((time: number) => {
        if (time - lastItemTime.current > 1500) {
            setItems(prev => [...prev, spawnItem()]);
            lastItemTime.current = time;
        }

        setItems(prev => prev.map(item => ({ ...item, x: item.x - item.speed })).filter(item => item.x > -10));

        requestRef.current = requestAnimationFrame(update);
    }, [spawnItem]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current);
    }, [update]);

    const handleItemClick = (item: any) => {
        playSound('collect');
        setGlucose(prev => Math.max(0, Math.min(100, prev + item.effect)));
        setScore(s => s + 20);
        setItems(prev => prev.filter(i => i.id !== item.id));

        if (item.effect > 15) playSound('incorrect');
    };

    useEffect(() => {
        if (glucose <= 5 || glucose >= 95) {
            cancelAnimationFrame(requestRef.current);
            setGameOver(true);
            playSound('lose');
        }
    }, [glucose]);

    if (gameOver) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center bg-sky-900 text-white p-8">
                <h3 className="text-4xl font-black mb-4">انتهت المغامرة! 🏁</h3>
                <p className="text-2xl mb-8">لقد جمعت {score} نقطة كبطل حقيقي!</p>
                <button 
                    onClick={() => onGameEnd(score)}
                    className="bg-yellow-400 text-sky-900 font-bold py-4 px-12 rounded-full text-xl shadow-xl hover:bg-yellow-300"
                >
                    العودة لمركز التدريب
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-100 relative overflow-hidden flex flex-col items-center">
            {/* HUD */}
            <div className="absolute top-4 left-0 w-full px-8 flex justify-between items-start z-20">
                <div className="bg-white/80 p-4 rounded-2xl shadow-lg border-2 border-sky-500">
                    <p className="text-sky-800 font-bold">النقاط: {score}</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sky-900 font-black">ميزان السكر</p>
                    <div className="w-64 h-8 bg-gray-200 rounded-full border-4 border-white shadow-inner relative overflow-hidden">
                        <div className="absolute h-full bg-red-500 left-0 w-[15%]"></div>
                        <div className="absolute h-full bg-green-500 left-[15%] w-[70%]"></div>
                        <div className="absolute h-full bg-red-500 right-0 w-[15%]"></div>
                        <div 
                            className="absolute h-full w-2 bg-white shadow-[0_0_10px_white] transition-all duration-300"
                            style={{ left: `${glucose}%`, transform: 'translateX(-50%)' }}
                        ></div>
                    </div>
                    <p className="text-xs text-sky-700 font-bold">حافظ على المؤشر في المنطقة الخضراء!</p>
                </div>
            </div>

            {/* Game World */}
            <div className="flex-grow w-full relative">
                {/* Hero Character */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 animate-bounce-slow">
                    <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white">
                        <span className="text-6xl">🦸‍♂️</span>
                    </div>
                </div>

                {/* Falling Items */}
                {items.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`absolute p-4 rounded-full shadow-lg border-2 border-white transform transition-transform hover:scale-125 animate-float
                                    ${item.color}`}
                        style={{ left: `${item.x}%`, top: `${item.y}%`, transition: 'left 0.1s linear' }}
                    >
                        <div className="text-3xl">{item.emoji}</div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-sky-900 bg-white/50 px-1 rounded">
                            {item.label}
                        </div>
                    </button>
                ))}
            </div>

            <div className="absolute bottom-4 text-sky-800 font-bold bg-white/40 px-6 py-2 rounded-full">
                المس الأطعمة الصحية والأنشطة لتبقى قوياً!
            </div>

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(-50%) translateY(-10px); }
                    50% { transform: translateY(-50%) translateY(10px); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
                .animate-float { animation: float 1.5s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

// --- PREVIOUS GAMES ---
const CatcherGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
  const [items, setItems] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameLoopRef = useRef<number | null>(null);
  const itemCounterRef = useRef(0);

  const createItem = useCallback(() => {
    itemCounterRef.current += 1;
    const type = Math.random() > 0.4 ? 'healthy' : 'unhealthy';
    const healthyFoods = ['🍎', '🥦', '🥕', '🍓', '🍇'];
    const unhealthyFoods = ['🍬', '🍭', '🍩', '🥤', '🍕'];
    const emoji = type === 'healthy' 
      ? healthyFoods[Math.floor(Math.random() * healthyFoods.length)]
      : unhealthyFoods[Math.floor(Math.random() * unhealthyFoods.length)];
    
    setItems(prevItems => [
      ...prevItems,
      { id: itemCounterRef.current, emoji, type, x: Math.random() * 90, y: -10, speed: 1.5 + Math.random() * 1.5 }
    ]);
  }, []);
  
  const gameTick = useCallback(() => {
    if (Math.random() < 0.05) { createItem(); }
    setItems(prevItems => 
      prevItems
        .map(item => ({ ...item, y: item.y + item.speed }))
        .filter(item => {
          if (item.y > 110) {
            if (item.type === 'healthy') { setLives(l => l - 1); }
            return false;
          }
          return true;
        })
    );
    gameLoopRef.current = requestAnimationFrame(gameTick);
  }, [createItem]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameTick);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [gameTick]);

  useEffect(() => {
    if (lives <= 0) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      playSound('lose');
      onGameEnd(score);
    }
  }, [lives, score, onGameEnd]);

  const handleItemClick = (item: any) => {
    if (item.type === 'healthy') {
        setScore(s => s + 10);
        playSound('collect');
    } else {
        setLives(l => l - 1);
        playSound('incorrect');
    }
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  return (
    <div className="w-full h-full bg-sky-200 rounded-lg relative overflow-hidden">
      <div className="absolute top-2 right-4 text-xl font-bold text-sky-900">النتيجة: {score}</div>
      <div className="absolute top-2 left-4 text-xl font-bold text-red-600">المحاولات: {'❤️'.repeat(lives)}</div>
      {items.map(item => (
        <div key={item.id} className="absolute text-5xl cursor-pointer select-none" style={{ top: `${item.y}%`, left: `${item.x}%`, transform: 'translate(-50%, -50%)' }} onClick={() => handleItemClick(item)}>{item.emoji}</div>
      ))}
    </div>
  );
};

// ... (Existing helper games definitions)
const kidGameDefs = [
    { id: 'activeHero', name: 'مغامرة البطل النشيط', icon: '🦸‍♂️', description: 'اركض واجمع الأكل الصحي وحافظ على توازنك!' },
    { id: 'catcher', name: 'صائد الأكل الصحي', icon: '🍎', description: 'امسك الأكل الصحي وتجنب غير الصحي!' },
    { id: 'chooser', name: 'لعبة الاختيار الذكي', icon: '⚖️', description: 'اختر الطعام الصحيح بين خيارين.' },
    { id: 'memoryMatch', name: 'ذاكرة الأبطال', icon: '🧠', description: 'طابق الرموز الصحية!' },
];

const parentGameDefs = [
    { id: 'dosageCalculator', name: 'حاسبة الجرعات', icon: '🧮', description: 'تدرب على حساب جرعات الإنسولين.' },
];

export const GamesSection: React.FC = () => {
    const stars = useStars();
    const [userType, setUserType] = useState<'kid' | 'parent' | null>(null);
    const [activeGame, setActiveGame] = useState<any>(null);

    const handleGameEnd = useCallback((score: number) => {
        addStars(score);
        setActiveGame(null);
    }, []);

    const renderActiveGame = () => {
        if (!activeGame) return null;
        switch(activeGame) {
            case 'activeHero': return <ActiveHeroAdventure onGameEnd={handleGameEnd} />;
            case 'catcher': return <CatcherGame onGameEnd={handleGameEnd} />;
            default: return <div className="p-8 text-center text-2xl">اللعبة قيد التشغيل... <button onClick={() => handleGameEnd(10)} className="block mx-auto mt-4 bg-sky-600 text-white p-2 rounded">خروج</button></div>;
        }
    };

    if (!userType) {
        return (
            <div className="min-h-[calc(100vh-68px)] flex flex-col justify-center items-center bg-sky-50 p-4">
                 <h2 className="text-4xl font-black text-sky-800 mb-8">من سيلعب اليوم؟</h2>
                 <div className="flex flex-col md:flex-row gap-8">
                    <button onClick={() => setUserType('kid')} className="p-10 bg-white rounded-3xl shadow-xl hover:scale-105 transition-all border-4 border-sky-200 group">
                        <div className="bg-sky-100 rounded-full p-6 mb-4 group-hover:bg-sky-200 transition-colors">
                            <ChildIcon className="w-24 h-24 text-sky-500" />
                        </div>
                        <span className="text-3xl font-black text-sky-900">أنا طفل بطل</span>
                    </button>
                    <button onClick={() => setUserType('parent')} className="p-10 bg-white rounded-3xl shadow-xl hover:scale-105 transition-all border-4 border-blue-200 group">
                        <div className="bg-blue-100 rounded-full p-6 mb-4 group-hover:bg-blue-200 transition-colors">
                            <AdultIcon className="w-24 h-24 text-blue-500" />
                        </div>
                        <span className="text-3xl font-black text-blue-900">أنا ولي أمر</span>
                    </button>
                 </div>
            </div>
        );
    }

    if (activeGame) {
        return (
            <div className="w-full h-[calc(100vh-68px)] bg-gray-100 flex flex-col relative">
                <button onClick={() => setActiveGame(null)} className="absolute top-4 right-4 bg-white/90 rounded-full p-3 shadow-md hover:bg-white z-50 transition-transform active:scale-90">
                   <BackIcon className="w-8 h-8 text-gray-700" />
                </button>
                {renderActiveGame()}
            </div>
        );
    }

    const gameDefs = userType === 'kid' ? kidGameDefs : parentGameDefs;

    return (
        <div className="py-16 px-4 bg-gradient-to-b from-sky-100 to-white min-h-screen">
            <div className="container mx-auto max-w-5xl text-center">
                <h2 className="text-4xl font-black text-sky-800 mb-2">عالم ألعاب السكر 🎮</h2>
                <p className="text-sky-600 mb-8 font-bold">العب، تعلم، واجمع النجوم!</p>
                
                <button onClick={() => setUserType(null)} className="mb-12 inline-flex items-center gap-2 bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition-all">
                    <SwitchUserIcon className="w-6 h-6" />
                    <span>تبديل اللاعب</span>
                </button>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gameDefs.map(game => (
                        <div key={game.id} className="bg-white p-8 rounded-[2rem] shadow-2xl hover:-translate-y-3 transition-all border-b-[10px] border-sky-400 group">
                           <div className="text-7xl mb-6 bg-sky-50 p-6 rounded-full inline-block group-hover:rotate-12 transition-transform">{game.icon}</div>
                           <h3 className="text-2xl font-black text-sky-900 mb-3">{game.name}</h3>
                           <p className="text-gray-500 mb-6 font-medium">{game.description}</p>
                           <button onClick={() => setActiveGame(game.id)} className="w-full bg-sky-600 text-white font-black py-4 rounded-2xl hover:bg-sky-700 transition-all shadow-lg text-lg">العب الآن</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
