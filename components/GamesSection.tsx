
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

// --- UTILS ---
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// --- LEGENDARY GAMES ---

/** 1) Strategic Sugar Balance (Mofified) */
const LegendarySugarBalanceGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [level, setLevel] = useState(50);
    const [scenario, setScenario] = useState<{ text: string, type: 'hunger' | 'activity' | 'boredom' }>({ text: 'لقد استيقظت الآن وشعرت بالجوع!', type: 'hunger' });
    const [score, setScore] = useState(0);
    const [turns, setTurns] = useState(0);
    const maxTurns = 10;

    const scenarios = [
        { text: 'وقت الغداء في المدرسة!', type: 'hunger' as const },
        { text: 'أصدقاؤك يلعبون الكرة، هل تشاركهم؟', type: 'activity' as const },
        { text: 'تشعر ببعض الكسل والملل..', type: 'boredom' as const },
        { text: 'وجدت قطعة حلوى لذيذة في المطبخ!', type: 'hunger' as const },
        { text: 'حصة الرياضة ستبدأ الآن!', type: 'activity' as const },
    ];

    const nextTurn = useCallback((effect: number) => {
        const newLevel = Math.max(0, Math.min(100, level + effect));
        setLevel(newLevel);
        setTurns(t => t + 1);
        
        if (newLevel >= 35 && newLevel <= 65) {
            setScore(s => s + 50);
            playSound('collect');
        } else {
            playSound('incorrect');
        }

        if (turns + 1 >= maxTurns) {
            playSound('win');
            onGameEnd(score + (newLevel >= 35 && newLevel <= 65 ? 50 : 0));
        } else {
            setScenario(scenarios[Math.floor(Math.random() * scenarios.length)]);
        }
    }, [level, score, turns, onGameEnd]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-sky-900 text-white rounded-lg">
            <h3 className="text-3xl font-black text-yellow-400 mb-2">توازن السكر الإستراتيجي 🍎</h3>
            <p className="text-sky-200 mb-8">الجولة: {turns + 1} / {maxTurns}</p>

            <div className="w-full max-w-lg bg-gray-800 p-8 rounded-3xl border-4 border-sky-400 shadow-2xl mb-8">
                <div className="text-xl text-center font-bold mb-6 text-yellow-100 h-16">"{scenario.text}"</div>
                
                <div className="h-16 w-full bg-gray-900 rounded-full overflow-hidden relative border-4 border-gray-700">
                    <div className="absolute h-full w-[30%] left-0 bg-red-600"></div>
                    <div className="absolute h-full w-[40%] left-[30%] bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"></div>
                    <div className="absolute h-full w-[30%] right-0 bg-red-600"></div>
                    <div className="absolute h-full w-4 bg-white top-0 rounded-full transition-all duration-300 shadow-[0_0_15px_white]" style={{ left: `${level}%`, transform: 'translateX(-50%)' }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-xl">
                <button onClick={() => nextTurn(25)} className="bg-white/10 hover:bg-green-600 border-2 border-green-400 p-4 rounded-2xl transition-all flex flex-col items-center">
                    <span className="text-4xl mb-1">🍴</span>
                    <span className="font-bold">آكل الآن</span>
                </button>
                <button onClick={() => nextTurn(-10)} className="bg-white/10 hover:bg-yellow-600 border-2 border-yellow-400 p-4 rounded-2xl transition-all flex flex-col items-center">
                    <span className="text-4xl mb-1">⏳</span>
                    <span className="font-bold">أجل الأكل</span>
                </button>
                <button onClick={() => nextTurn(-20)} className="bg-white/10 hover:bg-blue-600 border-2 border-blue-400 p-4 rounded-2xl transition-all flex flex-col items-center">
                    <span className="text-4xl mb-1">🏃‍♂️</span>
                    <span className="font-bold">أتحرك قليلاً</span>
                </button>
            </div>
            
            <div className="mt-8 text-2xl font-bold text-yellow-400">النقاط: {score}</div>
        </div>
    );
};

/** 2) Insulin Hero (Modified) */
const LegendaryInsulinHeroGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [monstersDefeated, setMonstersDefeated] = useState(0);
    const [monster, setMonster] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const monsters = [
        { name: 'وحش الحلوى الزائدة', icon: '🍪', weakTo: 'insulin', hint: 'أكلتُ الكثير من السكر! أحتاج للمساعدة لضبطه.' },
        { name: 'وحش نسيان الوجبة', icon: '🍱', weakTo: 'move', hint: 'نسيتُ وجبتي السابقة وأشعر ببعض الخمول..' },
        { name: 'وحش الكسل العملاق', icon: '🛋️', weakTo: 'move', hint: 'لقد جلستُ طويلاً أمام الشاشة.. أحتاج لهزيمة الكسل!' },
        { name: 'وحش العطش المرتفع', icon: '🔥', weakTo: 'water', hint: 'سكري مرتفع وأشعر بعطش شديد!' },
    ];

    const nextMonster = useCallback(() => {
        setMonster(monsters[Math.floor(Math.random() * monsters.length)]);
    }, []);

    useEffect(() => {
        nextMonster();
    }, [nextMonster]);

    const handleTool = (tool: string) => {
        if (!monster) return;
        if (tool === monster.weakTo) {
            playSound('collect');
            setScore(s => s + 100);
            setMonstersDefeated(m => m + 1);
            setFeedback('⚡️ هجوم بطل الأنسولين! ⚡️');
            if (monstersDefeated + 1 >= 5) {
                setTimeout(() => {
                    playSound('win');
                    onGameEnd(score + 500);
                }, 1000);
            } else {
                setTimeout(() => {
                    setFeedback(null);
                    nextMonster();
                }, 1000);
            }
        } else {
            playSound('incorrect');
            setFeedback('❌ هذه الأداة لا تعمل معه!');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    if (!monster) return null;

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-gradient-to-b from-indigo-900 to-black text-white rounded-lg relative overflow-hidden">
            <h3 className="text-3xl font-black text-sky-400 mb-8 tracking-widest">بطل الأنسولين 💉</h3>
            
            <div className="relative mb-12 flex flex-col items-center">
                <div className="text-[140px] drop-shadow-[0_0_30px_rgba(255,0,0,0.5)] animate-pulse">{monster.icon}</div>
                <div className="mt-4 text-center max-w-sm">
                    <h4 className="text-2xl font-bold text-red-500 uppercase">{monster.name}</h4>
                    <p className="text-sky-100 mt-2 text-lg italic">"{monster.hint}"</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full max-w-lg mb-8">
                <button onClick={() => handleTool('insulin')} className="bg-white/10 border-2 border-sky-400 p-6 rounded-3xl hover:bg-sky-500 transition-all flex flex-col items-center group">
                    <span className="text-5xl group-hover:scale-125 transition-transform">💉</span>
                    <span className="mt-2 font-bold">أنسولين</span>
                </button>
                <button onClick={() => handleTool('move')} className="bg-white/10 border-2 border-green-400 p-6 rounded-3xl hover:bg-green-500 transition-all flex flex-col items-center group">
                    <span className="text-5xl group-hover:scale-125 transition-transform">🚶‍♂️</span>
                    <span className="mt-2 font-bold">حركة</span>
                </button>
                <button onClick={() => handleTool('water')} className="bg-white/10 border-2 border-blue-400 p-6 rounded-3xl hover:bg-blue-500 transition-all flex flex-col items-center group">
                    <span className="text-5xl group-hover:scale-125 transition-transform">💧</span>
                    <span className="mt-2 font-bold">ماء</span>
                </button>
            </div>

            <div className="text-xl font-bold text-yellow-400">الوحوش المهزومة: {monstersDefeated} / 5</div>

            {feedback && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                    <div className="text-4xl font-black text-yellow-400 animate-bounce text-center px-4">
                        {feedback}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- PREVIOUS GAMES COMPONENTS ---

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

// ... (Rest of existing games)

const kidGameDefs = [
    { id: 'catcher', name: 'صائد الأكل الصحي', icon: '🍎', description: 'امسك الأكل الصحي وتجنب غير الصحي!' },
    { id: 'chooser', name: 'لعبة الاختيار الذكي', icon: '⚖️', description: 'اختر الطعام الصحيح بين خيارين.' },
    { id: 'embarrassing', name: 'مواقف الأبطال', icon: '🦸‍♂️', description: 'كيف تتصرف في المواقف المختلفة؟' },
    { id: 'memoryMatch', name: 'ذاكرة الأبطال', icon: '🧠', description: 'اختبر ذاكرتك وطابق الرموز الصحية!' },
];

const parentGameDefs = [
    { id: 'dosageCalculator', name: 'حاسبة الجرعات', icon: '🧮', description: 'تدرب على حساب جرعات الإنسولين.' },
    { id: 'mealPlanner', name: 'مخطط الوجبات', icon: '🍱', description: 'مارس تخطيط وجبات متوازنة بالكربوهيدرات.' },
];

// --- MAIN GAMES SECTION ---

export const GamesSection: React.FC = () => {
    const stars = useStars();
    const [userType, setUserType] = useState<'kid' | 'parent' | null>(null);
    const [activeGame, setActiveGame] = useState<any>(null);

    const requiredStars = 1500;
    const isLegendaryLocked = stars < requiredStars;
    const progress = Math.min(100, (stars / requiredStars) * 100);

    const handleGameEnd = useCallback((score: number) => {
        addStars(score);
        setActiveGame(null);
    }, []);

    const renderActiveGame = () => {
        if (!activeGame) return null;
        switch(activeGame) {
            case 'catcher': return <CatcherGame onGameEnd={handleGameEnd} />;
            case 'legendarySugar': return <LegendarySugarBalanceGame onGameEnd={handleGameEnd} />;
            case 'legendaryHero': return <LegendaryInsulinHeroGame onGameEnd={handleGameEnd} />;
            default: return <div className="p-8 text-center text-2xl">لعبة قيد التطوير... <button onClick={() => handleGameEnd(10)} className="block mx-auto mt-4 bg-sky-600 text-white p-2 rounded">إنهاء</button></div>;
        }
    };

    if (!userType) {
        return (
            <div className="min-h-[calc(100vh-68px)] flex flex-col justify-center items-center bg-sky-50 p-4">
                 <h2 className="text-3xl font-bold text-sky-800 mb-8">من يلعب اليوم؟</h2>
                 <div className="flex gap-8">
                    <button onClick={() => setUserType('kid')} className="p-8 bg-white rounded-2xl shadow-lg hover:scale-105 transition-all">
                        <ChildIcon className="w-24 h-24 text-sky-500 mb-4" />
                        <span className="text-2xl font-bold">أنا طفل بطل</span>
                    </button>
                    <button onClick={() => setUserType('parent')} className="p-8 bg-white rounded-2xl shadow-lg hover:scale-105 transition-all">
                        <AdultIcon className="w-24 h-24 text-blue-500 mb-4" />
                        <span className="text-2xl font-bold">أنا ولي أمر</span>
                    </button>
                 </div>
            </div>
        );
    }

    if (activeGame) {
        return (
            <div className="w-full h-[calc(100vh-68px)] bg-gray-100 flex flex-col relative">
                <button onClick={() => setActiveGame(null)} className="absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow-md hover:bg-white z-50">
                   <BackIcon className="w-6 h-6 text-gray-700" />
                </button>
                {renderActiveGame()}
            </div>
        );
    }

    const gameDefs = userType === 'kid' ? kidGameDefs : parentGameDefs;

    return (
        <div className="py-16 px-4 bg-gradient-to-b from-sky-100 to-white min-h-screen">
            <div className="container mx-auto max-w-5xl text-center">
                <h2 className="text-4xl font-bold text-sky-800 mb-4">عالم ألعاب السكر 🎮</h2>
                <button onClick={() => setUserType(null)} className="mb-8 inline-flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-blue-600">
                    <SwitchUserIcon className="w-5 h-5" />
                    <span>تغيير اللاعب</span>
                </button>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {gameDefs.map(game => (
                        <div key={game.id} className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform border-b-8 border-sky-400">
                           <div className="text-6xl mb-4 bg-sky-50 p-4 rounded-full inline-block">{game.icon}</div>
                           <h3 className="text-xl font-bold text-sky-900 mb-2">{game.name}</h3>
                           <button onClick={() => setActiveGame(game.id)} className="w-full bg-sky-600 text-white font-bold py-2 rounded-lg hover:bg-sky-700 transition-colors">العب الآن</button>
                        </div>
                    ))}
                </div>

                {userType === 'kid' && (
                    <div className="mt-16">
                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 mb-8 uppercase tracking-widest">🏆 ركن الألعاب الأسطورية 🏆</h3>
                        <div className={`relative p-8 rounded-3xl border-4 border-yellow-400 overflow-hidden ${isLegendaryLocked ? 'bg-gray-200/50 backdrop-blur-sm' : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 shadow-2xl shadow-yellow-500/40'}`}>
                            {isLegendaryLocked ? (
                                <div className="flex flex-col items-center p-6 text-white">
                                    <LockIcon className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
                                    <h4 className="text-2xl font-bold mb-2">هذا الركن مغلق للأبطال</h4>
                                    <p className="mb-4 text-yellow-100">تحتاج إلى 1500 نجمة لدخول عالم الأساطير!</p>
                                    <div className="w-full max-w-md bg-gray-700 h-4 rounded-full overflow-hidden border border-yellow-500 mb-2">
                                        <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-300 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <span className="font-mono font-bold text-yellow-400">{stars} / 1500 ⭐</span>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-8">
                                     <div className="bg-white/10 p-6 rounded-2xl border border-yellow-400/30 text-white group hover:bg-white/20 transition-all">
                                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🍎</div>
                                        <h4 className="text-2xl font-bold mb-2">توازن السكر الإستراتيجي</h4>
                                        <p className="text-sky-100 mb-4">تعلم فن الموازنة واتخذ القرارات الصحيحة للحفاظ على طاقتك!</p>
                                        <button onClick={() => setActiveGame('legendarySugar')} className="w-full bg-yellow-500 text-blue-900 font-black py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg">إبدأ التحدي الملكي</button>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-2xl border border-yellow-400/30 text-white group hover:bg-white/20 transition-all">
                                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🦸‍♂️</div>
                                        <h4 className="text-2xl font-bold mb-2">بطل الأنسولين</h4>
                                        <p className="text-sky-100 mb-4">واجه وحوش السكر المرتفع وحافظ على صحة مدينتك!</p>
                                        <button onClick={() => setActiveGame('legendaryHero')} className="w-full bg-yellow-500 text-blue-900 font-black py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg">دخول عالم الأبطال</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
