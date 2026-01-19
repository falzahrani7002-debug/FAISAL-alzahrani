
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
const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
);
const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
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

/** 1) Sugar Balance Legendary Game */
const LegendarySugarBalanceGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [level, setLevel] = useState(50);
    const [timeLeft, setTimeLeft] = useState(45);
    const [options, setOptions] = useState<any[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const generateOptions = useCallback(() => {
        const pool = [
            { id: 1, icon: '🍎', label: 'تفاحة', effect: -10, type: 'healthy' },
            { id: 2, icon: '🍬', label: 'حلوى', effect: +25, type: 'unhealthy' },
            { id: 3, icon: '🚶‍♂️', label: 'مشي', effect: -15, type: 'action' },
            { id: 4, icon: '💧', label: 'ماء', effect: -5, type: 'action' },
            { id: 5, icon: '🧃', label: 'عصير', effect: +15, type: 'emergency' },
            { id: 6, icon: '🥦', label: 'بروكلي', effect: -8, type: 'healthy' },
        ];
        setOptions(shuffleArray([...pool]).slice(0, 3));
    }, []);

    useEffect(() => {
        generateOptions();
        const timer = setInterval(() => {
            if (gameOver) return;
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    playSound('win');
                    onGameEnd(score + 100);
                    return 0;
                }
                return t - 1;
            });
            // Passive sugar fluctuation
            setLevel(prev => {
                const change = (Math.random() - 0.45) * 4;
                const next = prev + change;
                if (next < 10 || next > 90) {
                    setGameOver(true);
                    playSound('lose');
                    onGameEnd(score);
                }
                if (next >= 30 && next <= 70) setScore(s => s + 1);
                return next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [generateOptions, gameOver, score, onGameEnd]);

    const handleAction = (effect: number) => {
        if (gameOver) return;
        playSound('click');
        setLevel(prev => Math.max(0, Math.min(100, prev + effect)));
        generateOptions();
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-sky-950 text-white rounded-lg">
            <h3 className="text-3xl font-black text-yellow-400 mb-4">توازن السكر الأسطوري</h3>
            <div className="flex justify-between w-full max-w-lg mb-4 text-xl">
                <span>الوقت: {timeLeft}ث</span>
                <span>النقاط: {score}</span>
            </div>
            
            <div className="w-full max-w-lg bg-gray-800 p-6 rounded-3xl border-4 border-sky-400 shadow-2xl relative mb-12">
                <div className="h-16 w-full bg-gray-900 rounded-full overflow-hidden relative border-4 border-gray-700">
                    <div className="absolute h-full w-[20%] left-0 bg-red-600"></div>
                    <div className="absolute h-full w-[40%] left-[30%] bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"></div>
                    <div className="absolute h-full w-[20%] right-0 bg-red-600"></div>
                    <div className="absolute h-full w-4 bg-white top-0 rounded-full transition-all duration-300 shadow-[0_0_15px_white]" style={{ left: `${level}%`, transform: 'translateX(-50%)' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                    <span>منخفض جداً</span>
                    <span>مثالي</span>
                    <span>مرتفع جداً</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                {options.map(opt => (
                    <button key={opt.id} onClick={() => handleAction(opt.effect)} className="bg-white/10 hover:bg-white/20 border-2 border-sky-400 p-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 group">
                        <div className="text-5xl mb-2 group-hover:animate-bounce">{opt.icon}</div>
                        <div className="font-bold text-sky-200">{opt.label}</div>
                    </button>
                ))}
            </div>
            {gameOver && <div className="mt-8 text-2xl font-bold text-red-500 animate-pulse">انتهت اللعبة! حاول موازنة سكرك بشكل أفضل.</div>}
        </div>
    );
};

/** 2) Insulin Hero Legendary Game */
const LegendaryInsulinHeroGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [monstersDefeated, setMonstersDefeated] = useState(0);
    const [monster, setMonster] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const monsters = [
        { name: 'وحش الحلوى العملاق', icon: '🍩', weakTo: 'insulin', hint: 'هذا الوحش يحتاج لجرعة إنسولين لتهدئته!' },
        { name: 'وحش الكسل النائم', icon: '🛋️', weakTo: 'move', hint: 'هذا الوحش يحتاج لبعض الحركة والنشاط لطرده!' },
        { name: 'وحش الجفاف العطشان', icon: '🌵', weakTo: 'water', hint: 'هذا الوحش القاسي يحتاج لشرب الماء للقضاء عليه!' },
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
            setScore(s => s + 50);
            setMonstersDefeated(m => m + 1);
            setFeedback('✅ ضربة قوية!');
            if (monstersDefeated + 1 >= 5) {
                setTimeout(() => {
                    playSound('win');
                    onGameEnd(score + 250);
                }, 1000);
            } else {
                setTimeout(() => {
                    setFeedback(null);
                    nextMonster();
                }, 1000);
            }
        } else {
            playSound('incorrect');
            setFeedback('❌ حاول مجدداً!');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    if (!monster) return null;

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-gradient-to-b from-indigo-900 to-black text-white rounded-lg">
            <h3 className="text-3xl font-black text-blue-400 mb-8 tracking-widest">بطل الأنسولين الأسطوري</h3>
            
            <div className="relative mb-12 group">
                <div className="absolute -inset-4 bg-blue-500/20 blur-3xl group-hover:bg-blue-500/40 transition-all"></div>
                <div className="text-[120px] animate-pulse">{monster.icon}</div>
                <div className="mt-4 text-center">
                    <h4 className="text-2xl font-bold text-red-400">{monster.name}</h4>
                    <p className="text-gray-400 mt-2 italic">"{monster.hint}"</p>
                </div>
            </div>

            <div className="text-xl font-bold mb-8 text-yellow-400">الوحوش المهزومة: {monstersDefeated} / 5</div>

            <div className="flex gap-6 w-full max-w-md">
                <button onClick={() => handleTool('insulin')} className="flex-1 bg-white/10 border-2 border-sky-400 p-6 rounded-3xl hover:bg-sky-500 transition-all flex flex-col items-center group">
                    <span className="text-5xl group-hover:scale-125 transition-transform">💉</span>
                    <span className="mt-2 font-bold">أنسولين</span>
                </button>
                <button onClick={() => handleTool('move')} className="flex-1 bg-white/10 border-2 border-green-400 p-6 rounded-3xl hover:bg-green-500 transition-all flex flex-col items-center group">
                    <span className="text-5xl group-hover:scale-125 transition-transform">🚶‍♂️</span>
                    <span className="mt-2 font-bold">حركة</span>
                </button>
                <button onClick={() => handleTool('water')} className="flex-1 bg-white/10 border-2 border-blue-400 p-6 rounded-3xl hover:bg-blue-500 transition-all flex flex-col items-center group">
                    <span className="text-5xl group-hover:scale-125 transition-transform">💧</span>
                    <span className="mt-2 font-bold">ماء</span>
                </button>
            </div>

            {feedback && (
                <div className="mt-8 text-3xl font-black animate-bounce text-center">
                    {feedback}
                </div>
            )}
        </div>
    );
};

// --- PREVIOUS GAMES ---

const CatcherGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const itemCounterRef = useRef(0);

  const createItem = useCallback(() => {
    itemCounterRef.current += 1;
    const type = Math.random() > 0.4 ? 'healthy' : 'unhealthy';
    const emoji = type === 'healthy' 
      ? healthyFoods[Math.floor(Math.random() * healthyFoods.length)]
      : unhealthyFoods[Math.floor(Math.random() * unhealthyFoods.length)];
    
    setItems(prevItems => [
      ...prevItems,
      {
        id: itemCounterRef.current,
        emoji,
        type,
        x: Math.random() * 90,
        y: -10,
        speed: 1 + Math.random() * 1.5,
      }
    ]);
  }, []);
  
  const gameTick = useCallback(() => {
    if (Math.random() < 0.05) { createItem(); }
    setItems(prevItems => 
      prevItems
        .map(item => ({ ...item, y: item.y + item.speed }))
        .filter(item => {
          if (item.y > 110) {
            if (item.type === 'healthy') {
              setLives(l => l - 1);
            }
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

  const handleItemClick = (item: FoodItem) => {
    if (item.type === 'healthy') {
        setScore(s => s + 1);
        playSound('collect');
    } else {
        setLives(l => l - 1);
        playSound('incorrect');
    }
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  return (
    <div className="w-full h-full bg-blue-200 rounded-lg relative overflow-hidden" ref={gameAreaRef}>
      <div className="absolute top-2 right-4 text-xl font-bold text-white">النتيجة: {score}</div>
      <div className="absolute top-2 left-4 text-xl font-bold text-white">المحاولات: {'❤️'.repeat(lives)}</div>
      {items.map(item => (
        <div
          key={item.id}
          className="absolute text-4xl cursor-pointer"
          style={{ top: `${item.y}%`, left: `${item.x}%`, transform: 'translate(-50%, -50%)' }}
          onClick={() => handleItemClick(item)}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
};

const healthyFoods = ['🍎', '🥦', '🥕', '🍓', '🍇', '🍗', '🥛'];
const unhealthyFoods = ['🍬', '🍭', '🍩', '🥤', '🍕', '🍟', '🍫'];

interface FoodItem { id: number; emoji: string; type: 'healthy' | 'unhealthy'; x: number; y: number; speed: number; }

const ChooserGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [shuffledPairs, setShuffledPairs] = useState<FoodPair[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    useEffect(() => { setShuffledPairs(shuffleArray([...foodPairs])); }, []);

    const handleChoice = (choice: FoodChoice) => {
        if (feedback) return;
        const isCorrect = choice.isHealthy;
        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback('correct');
            playSound('levelUp');
        } else {
            setFeedback('incorrect');
            playSound('incorrect');
        }
        setTimeout(() => {
            setFeedback(null);
            if (currentIndex + 1 < shuffledPairs.length) {
                setCurrentIndex(i => i + 1);
            } else {
                playSound('win');
                onGameEnd(score + (isCorrect ? 1 : 0));
            }
        }, 1200);
    };

    if (shuffledPairs.length === 0) return <div>تحميل...</div>;
    const currentPair = shuffledPairs[currentIndex];

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-green-100 rounded-lg">
            <h3 className="text-3xl font-bold text-green-800 mb-8 text-center">أي واحد هو الاختيار الأذكى؟</h3>
            <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                {currentPair.options.map((choice) => (
                    <button key={choice.name} onClick={() => handleChoice(choice)} disabled={!!feedback}
                        className={`p-6 rounded-2xl shadow-lg transform transition-transform hover:scale-105 disabled:cursor-not-allowed ${feedback && choice.isHealthy ? 'bg-green-300 ring-4 ring-green-500' : ''} ${feedback === 'incorrect' && !choice.isHealthy ? 'bg-red-300' : ''} ${!feedback ? 'bg-white' : ''}`}>
                        <div className="text-7xl mb-4">{choice.emoji}</div>
                        <div className="text-2xl font-bold text-gray-800">{choice.name}</div>
                    </button>
                ))}
            </div>
            <div className="mt-4 text-xl font-bold text-gray-700">النتيجة: {score}</div>
        </div>
    );
};

interface FoodChoice { emoji: string; name: string; isHealthy: boolean; }
interface FoodPair { id: number; options: [FoodChoice, FoodChoice]; }
const foodPairs: FoodPair[] = [
  { id: 1, options: [{ emoji: '🍎', name: 'تفاحة', isHealthy: true }, { emoji: '🍩', name: 'دونات', isHealthy: false }] },
  { id: 2, options: [{ emoji: '🥦', name: 'بروكلي', isHealthy: true }, { emoji: '🍟', name: 'بطاطس مقلية', isHealthy: false }] },
  { id: 3, options: [{ emoji: '💧', name: 'ماء', isHealthy: true }, { emoji: '🥤', name: 'مشروب غازي', isHealthy: false }] },
];

const EmbarrassingSituationGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [gameSituations, setGameSituations] = useState<Situation[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => { setGameSituations(shuffleArray([...situations])); }, []);

    const handleChoice = (choice: { text: string, isCorrect: boolean }) => {
        if (showFeedback) return;
        const isCorrect = choice.isCorrect;
        if (isCorrect) {
            playSound('levelUp'); setScore(s => s + 1);
        } else { playSound('incorrect'); }
        setShowFeedback(true);
        setTimeout(() => {
            setShowFeedback(false);
            if (currentIndex + 1 < gameSituations.length) {
                setCurrentIndex(i => i + 1);
            } else {
                playSound('win'); onGameEnd(score + (isCorrect ? 1 : 0));
            }
        }, 2500);
    };
    
    if (gameSituations.length === 0) return <div>تحميل...</div>;
    const currentSituation = gameSituations[currentIndex];

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-purple-100 rounded-lg text-center relative">
            <div className="absolute top-4 right-4 text-2xl font-bold text-purple-800">النتيجة: <span className="text-amber-500">{score}</span></div>
            <div className="text-6xl mb-4">{currentSituation.emoji}</div>
            <h3 className="text-2xl font-bold text-amber-500 mb-6">{currentSituation.scenario}</h3>
            <div className="space-y-4 w-full max-w-md">
                {currentSituation.options.map(option => (
                    <button key={option.text} onClick={() => handleChoice(option)} disabled={showFeedback}
                        className={`w-full p-4 rounded-lg text-lg font-semibold transition-all duration-300 ${!showFeedback ? 'bg-amber-400 text-white hover:bg-amber-500 shadow-md' : (option.isCorrect ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900 opacity-60')}`}>
                        {option.text}
                    </button>
                ))}
            </div>
            {showFeedback && (<div className="mt-6 p-4 bg-white rounded-lg shadow-inner max-w-md"><p className="text-lg font-semibold text-purple-900">{currentSituation.feedback}</p></div>)}
        </div>
    );
};

interface Situation { id: number; scenario: string; emoji: string; options: { text: string; isCorrect: boolean }[]; feedback: string; }
const situations: Situation[] = [
    { id: 1, scenario: 'أنت في حفلة عيد ميلاد، والجميع يأكل الكيك. ماذا تفعل؟', emoji: '🎂', options: [{ text: 'آكل قطعة صغيرة وأضبط جرعة الإنسولين', isCorrect: true }, { text: 'لا آكل شيئًا وأشعر بالحزن', isCorrect: false }], feedback: 'أحسنت! يمكنك الاستمتاع بكل شيء باعتدال ومع التخطيط.' },
    { id: 2, scenario: 'رن جهاز قياس السكر الخاص بك بصوت عالٍ في الفصل. ماذا تفعل؟', emoji: '🔔', options: [{ text: 'أشعر بالإحراج وأخبئه بسرعة', isCorrect: false }, { text: 'أخبر معلمتي بهدوء أنني بحاجة لفحص السكر', isCorrect: true }], feedback: 'تصرف رائع! صحتك هي الأهم، وشرح الموقف بهدوء هو الأفضل.' },
];

const MemoryMatchGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [cards, setCards] = useState<(string)[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => { setCards(shuffleArray([...memoryCards, ...memoryCards])); }, []);
    
    useEffect(() => {
        if (matchedPairs.length === memoryCards.length) {
            setTimeout(() => { playSound('win'); onGameEnd(Math.max(0, 20 - moves)); }, 800);
        }
    }, [matchedPairs, moves, onGameEnd]);

    const handleCardClick = (index: number) => {
        if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(cards[index])) return;
        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);
        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [firstIndex, secondIndex] = newFlipped;
            if (cards[firstIndex] === cards[secondIndex]) {
                playSound('collect');
                setMatchedPairs(mp => [...mp, cards[firstIndex]]);
                setFlippedIndices([]);
            } else {
                playSound('incorrect');
                setTimeout(() => setFlippedIndices([]), 1000);
            }
        }
    };

    const isFlipped = (index: number) => flippedIndices.includes(index) || matchedPairs.includes(cards[index]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 sm:p-8 bg-indigo-100 rounded-lg">
            <div className="flex justify-between w-full max-w-lg mb-6">
                 <h3 className="text-2xl sm:text-3xl font-bold text-indigo-800">لعبة الذاكرة</h3>
                 <div className="text-2xl font-bold text-indigo-700">الحركات: {moves}</div>
            </div>
            <div className="grid grid-cols-4 gap-4 w-full max-w-sm sm:max-w-md">
                {cards.map((card, index) => (
                    <div key={index} className="aspect-square [perspective:1000px]" onClick={() => handleCardClick(index)}>
                        <div className={`w-full h-full relative transition-transform duration-500 cursor-pointer [transform-style:preserve-3d] ${isFlipped(index) ? '[transform:rotateY(180deg)]' : ''}`}>
                            <div className="absolute w-full h-full rounded-lg shadow-md flex items-center justify-center text-5xl bg-indigo-400 [backface-visibility:hidden]"><span className="text-5xl text-white">?</span></div>
                            <div className="absolute w-full h-full rounded-lg shadow-md flex items-center justify-center text-5xl bg-white [backface-visibility:hidden] [transform:rotateY(180deg)]">{card}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const memoryCards = ['🍎', '🥦', '💧', '💉', '🏃‍♂️', '❤️'];

const SugarBalanceGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [level, setLevel] = useState(50); // 0 to 100
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const adjustLevel = useCallback((amount: number) => {
        if (gameOver) return;
        setLevel(prev => Math.max(0, Math.min(100, prev + amount)));
    }, [gameOver]);

    useEffect(() => {
        const gameInterval = setInterval(() => {
            if (gameOver) {
                clearInterval(gameInterval);
                return;
            }
            const change = (Math.random() - 0.47) * 4;
            const newLevel = level + change;
            if (newLevel < 0 || newLevel > 100) {
                setGameOver(true);
                playSound('lose');
                onGameEnd(score);
            } else {
                setLevel(newLevel);
                if (newLevel >= 30 && newLevel <= 70) {
                    setScore(s => s + 1);
                }
            }
        }, 200);
        return () => clearInterval(gameInterval);
    }, [level, score, gameOver, onGameEnd]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-teal-100 rounded-lg">
            <h3 className="text-3xl font-bold text-teal-800 mb-4">لعبة ميزان السكر</h3>
            <p className="text-lg text-gray-700 mb-8">حافظ على مستوى السكر في المنطقة الخضراء!</p>
            <div className="w-full max-w-lg bg-white p-4 rounded-lg shadow-lg">
                <div className="h-12 w-full bg-gray-200 rounded-full overflow-hidden relative">
                    <div className="absolute h-full w-full bg-gradient-to-r from-red-400 via-yellow-400 to-red-400"></div>
                    <div className="absolute h-full w-[40%] left-[30%] bg-green-400"></div>
                    <div className="absolute h-full w-2 bg-black top-0 rounded-full transition-all duration-100" style={{ left: `${level}%` }}></div>
                </div>
            </div>
            <div className="flex gap-8 mt-8">
                 <button onClick={() => adjustLevel(-5)} className="p-4 rounded-full bg-blue-500 text-white shadow-lg text-3xl hover:bg-blue-600"><ArrowDownIcon className="w-10 h-10" /></button>
                 <button onClick={() => adjustLevel(5)} className="p-4 rounded-full bg-red-500 text-white shadow-lg text-3xl hover:bg-red-600"><ArrowUpIcon className="w-10 h-10" /></button>
            </div>
            <div className="mt-8 text-2xl font-bold text-teal-900">النتيجة: {score}</div>
        </div>
    );
};

const StarCollectorGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [challenges] = useState(() => shuffleArray([...starCollectorChallenges]));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    
    const handleAnswer = (isCorrect: boolean) => {
        if (feedback) return;
        if (isCorrect) { setScore(s => s + 10); setFeedback('correct'); playSound('levelUp'); }
        else { setFeedback('incorrect'); playSound('incorrect'); }
        setTimeout(() => {
            setFeedback(null);
            if (currentIndex + 1 < challenges.length) setCurrentIndex(i => i + 1);
            else { playSound('win'); onGameEnd(score + (isCorrect ? 10 : 0)); }
        }, 1500);
    };

    if (challenges.length === 0) return <div>تحميل...</div>;
    const currentChallenge = challenges[currentIndex];

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 sm:p-8 bg-yellow-100 rounded-lg text-center relative overflow-hidden">
            {feedback && (
                <div className={`absolute inset-0 flex justify-center items-center z-10 ${feedback === 'correct' ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                    <span className="text-8xl text-white animate-ping">{feedback === 'correct' ? '✅' : '❌'}</span>
                </div>
            )}
            <h3 className="text-3xl font-bold text-yellow-900 mb-8">{currentChallenge.prompt}</h3>
            {currentChallenge.type === 'select' && (
                <div className="flex gap-4 sm:gap-8">
                    {currentChallenge.items.map((item: any) => (
                        <button key={item.emoji} onClick={() => handleAnswer(item.isCorrect)} className="p-4 sm:p-6 rounded-2xl bg-white shadow-lg transform transition-transform hover:scale-110">
                            <span className="text-6xl sm:text-8xl">{item.emoji}</span>
                        </button>
                    ))}
                </div>
            )}
            {currentChallenge.type === 'count' && (
                 <>
                    <div className="text-6xl mb-6"> {Array.from({ length: currentChallenge.count }).map((_, i) => currentChallenge.itemEmoji)} </div>
                    <div className="flex gap-4 sm:gap-8">
                        {currentChallenge.options.map((option: any) => (
                            <button key={option} onClick={() => handleAnswer(option === currentChallenge.count)} className="w-20 h-20 text-4xl font-bold rounded-2xl bg-white shadow-lg text-cyan-500">{option}</button>
                        ))}
                    </div>
                 </>
            )}
        </div>
    );
};
const starCollectorChallenges = [
    { type: 'select', prompt: 'اختر الطعام الصحي!', items: [{ emoji: '🥦', isCorrect: true }, { emoji: '🍔', isCorrect: false }, { emoji: '🍩', isCorrect: false }] },
    { type: 'count', prompt: 'كم عدد التفاحات؟', itemEmoji: '🍎', count: 3, options: [2, 3, 4] },
    { type: 'select', prompt: 'اختر الشراب الأفضل!', items: [{ emoji: '💧', isCorrect: true }, { emoji: '🥤', isCorrect: false }, { emoji: '🧃', isCorrect: false }] },
];

// --- PARENTS' GAMES COMPONENTS ---

const DosageCalculatorGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [qList] = useState(() => shuffleArray([...doseQuestions]));
    const [qIndex, setQIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const currentQ = qList[qIndex];

    const checkAnswer = () => {
        if(feedback) return;
        const answer = parseFloat(userAnswer);
        const isCorrect = Math.abs(answer - currentQ.answer) < 0.1;
        if(isCorrect) { setScore(s => s + 1); playSound('levelUp'); setFeedback(`صحيح! الجرعة هي ${currentQ.answer.toFixed(1)}.`); }
        else { playSound('incorrect'); setFeedback(`خاطئ. الصحيح هو ${currentQ.answer.toFixed(1)}.`); }
        setTimeout(() => {
            setFeedback(null); setUserAnswer('');
            if(qIndex + 1 < qList.length) setQIndex(i => i + 1);
            else { playSound('win'); onGameEnd(score + (isCorrect ? 1 : 0)); }
        }, 3000);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-blue-100 rounded-lg">
            <h3 className="text-3xl font-bold text-blue-800 mb-4">حاسبة الجرعات</h3>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <p>سكر الدم: {currentQ.bs} | كربوهيدرات: {currentQ.carbs} | معامل: 1/{currentQ.carbRatio} | تصحيح: {currentQ.correctionFactor} | مستهدف: {currentQ.target}</p>
                <input type="number" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} className="w-full text-center text-2xl p-2 border-2 rounded-lg mt-4" placeholder="0.0" step="0.1" />
                <button onClick={checkAnswer} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg">تحقق</button>
            </div>
            {feedback && <p className="mt-4 p-4 bg-white rounded-lg">{feedback}</p>}
        </div>
    );
};
const doseQuestions = [{ id: 1, bs: 180, carbs: 45, carbRatio: 15, correctionFactor: 50, target: 120, answer: 4.2 }];

const SymptomSpotterGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [qList] = useState(() => shuffleArray([...symptoms]));
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const currentQ = qList[qIndex];

    const handleAnswer = (answer: 'hypo' | 'hyper') => {
        if(feedback) return;
        const isCorrect = answer === currentQ.type;
        if(isCorrect) { setScore(s => s + 1); playSound('levelUp'); setFeedback("صحيح!"); }
        else { playSound('incorrect'); setFeedback("خاطئ!"); }
        setTimeout(() => {
            setFeedback(null);
            if(qIndex + 1 < qList.length) setQIndex(i => i + 1);
            else { playSound('win'); onGameEnd(score + (isCorrect ? 1 : 0)); }
        }, 2500);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-red-100 rounded-lg">
            <h3 className="text-3xl font-bold text-red-800 mb-6">علامات الخطر</h3>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <p className="text-2xl p-4">{currentQ.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <button onClick={() => handleAnswer('hypo')} className="p-4 bg-sky-500 text-white rounded-lg">انخفاض</button>
                    <button onClick={() => handleAnswer('hyper')} className="p-4 bg-orange-500 text-white rounded-lg">ارتفاع</button>
                </div>
            </div>
            {feedback && <p className="mt-4 p-4 bg-white rounded-lg">{feedback}</p>}
        </div>
    );
};
const symptoms = [{ id: 1, description: "تعرق بارد، رجفة، وجوع.", type: 'hypo' as const }];

// --- MEAL ITEM INTERFACE ---
interface MealItem {
    name: string;
    emoji: string;
    carbs: number;
}

const MealPlannerGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [targetCarbs] = useState(30);
    const [selectedItems, setSelectedItems] = useState<MealItem[]>([]);
    const totalCarbs = selectedItems.reduce((sum, item) => sum + item.carbs, 0);

    const toggleItem = (item: MealItem) => {
        setSelectedItems(prev => prev.find(i => i.name === item.name) ? prev.filter(i => i.name !== item.name) : [...prev, item]);
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-8 bg-green-100 rounded-lg">
            <h3 className="text-3xl font-bold text-green-800 mb-2">مخطط الوجبات</h3>
            <p>الهدف: {targetCarbs}g</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {mealItems.map(item => (
                    <button key={item.name} onClick={() => toggleItem(item)} className={`p-3 rounded-lg border-2 ${selectedItems.find(i => i.name === item.name) ? 'bg-green-200 border-green-500' : 'bg-gray-100'}`}>
                        {item.emoji} {item.carbs}g
                    </button>
                ))}
            </div>
            <button onClick={() => onGameEnd(10)} className="mt-8 bg-green-600 text-white py-3 px-8 rounded-lg">تأكيد</button>
            <p className="mt-4">المجموع: {totalCarbs}g</p>
        </div>
    );
};
const mealItems = [{ name: 'تفاحة', emoji: '🍎', carbs: 15 }, { name: 'بيضة', emoji: '🥚', carbs: 1 }];

const EmergencyKitGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [kitItems, setKitItems] = useState<Set<string>>(new Set());
    const toggleItem = (name: string) => {
        setKitItems(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
    };
    return (
        <div className="w-full h-full flex flex-col items-center p-8 bg-orange-100 rounded-lg">
            <h3 className="text-3xl font-bold mb-4">حقيبة الطوارئ</h3>
            <div className="grid grid-cols-3 gap-4">
                {['عصير', 'جهاز قياس', 'لعبة'].map(item => (
                    <button key={item} onClick={() => toggleItem(item)} className={`p-4 border-2 ${kitItems.has(item) ? 'bg-blue-200' : 'bg-white'}`}>{item}</button>
                ))}
            </div>
            <button onClick={() => onGameEnd(15)} className="mt-8 bg-orange-600 text-white py-3 px-8 rounded-lg">تحقق</button>
        </div>
    );
};

const MythBustersGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const myth = myths[currentIndex];
    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-gray-200 rounded-lg">
            <h3 className="text-3xl font-bold mb-6">كشف الخرافات</h3>
            <div className="bg-white p-6 rounded-lg max-w-lg mb-6"><p>{myth.statement}</p></div>
            <div className="flex gap-8">
                <button onClick={() => onGameEnd(5)} className="bg-green-500 text-white p-4 rounded-lg">حقيقة</button>
                <button onClick={() => onGameEnd(0)} className="bg-red-500 text-white p-4 rounded-lg">خرافة</button>
            </div>
        </div>
    );
};
const myths = [{ statement: 'السكر يسبب النوع الأول.', isMyth: true, explanation: 'خرافة.' }];

const CarbCountingProGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    return <div className="p-8 text-center">لعبة حساب الكارب المتقدم <button onClick={() => onGameEnd(20)} className="block mx-auto mt-4 bg-indigo-600 text-white p-2 rounded">إنهاء</button></div>;
};

// --- GAME DEFINITIONS ---

const kidGameDefs = [
    { id: 'catcher', name: 'صائد الأكل الصحي', icon: '🍎', description: 'امسك الأكل الصحي وتجنب غير الصحي!' },
    { id: 'chooser', name: 'لعبة الاختيار الذكي', icon: '⚖️', description: 'اختر الطعام الصحيح بين خيارين.' },
    { id: 'embarrassing', name: 'مواقف الأبطال', icon: '🦸‍♂️', description: 'كيف تتصرف في المواقف المختلفة؟' },
    { id: 'memoryMatch', name: 'ذاكرة الأبطال', icon: '🧠', description: 'اختبر ذاكرتك وطابق الرموز الصحية!' },
    { id: 'sugarBalance', name: 'ميزان السكر', icon: '🎢', description: 'حافظ على توازن مستوى السكر!' },
    { id: 'starCollector', name: 'جامع النجوم', icon: '⭐', description: 'أكمل التحديات السريعة لجمع النجوم!' },
];

const parentGameDefs = [
    { id: 'dosageCalculator', name: 'حاسبة الجرعات', icon: '🧮', description: 'تدرب على حساب جرعات الإنسولين.' },
    { id: 'symptomSpotter', name: 'علامات الخطر', icon: '⚠️', description: 'تعلم التمييز بين أعراض الهبوط والارتفاع.' },
    { id: 'mealPlanner', name: 'مخطط الوجبات', icon: '🍱', description: 'مارس تخطيط وجبات متوازنة بالكربوهيدرات.' },
    { id: 'emergencyKit', name: 'حقيبة الطوارئ', icon: '🎒', description: 'تأكد من معرفتك بمحتويات حقيبة الطوارئ.' },
    { id: 'mythBusters', name: 'كشف الخرافات', icon: '🔍', description: 'اختبر معلوماتك حول الخرافات الشائعة عن السكري.' },
    { id: 'carbCountingPro', name: 'حساب الكارب المتقدم', icon: '🔢', description: 'قدّر الكربوهيدرات في وجبات كاملة.' },
];

type GameId = any;

// --- MAIN GAMES SECTION COMPONENT ---

export const GamesSection: React.FC = () => {
    const stars = useStars();
    const [userType, setUserType] = useState<'kid' | 'parent' | null>(null);
    const [activeGame, setActiveGame] = useState<GameId | null>(null);
    const [lastGameScore, setLastGameScore] = useState<number | null>(null);

    const requiredStars = 1500;
    const isLegendaryLocked = stars < requiredStars;
    const progress = Math.min(100, (stars / requiredStars) * 100);

    const handleGameEnd = useCallback((score: number) => {
        addStars(score);
        setLastGameScore(score);
        setActiveGame(null);
    }, []);

    const renderActiveGame = () => {
        if (!activeGame) return null;
        switch(activeGame) {
            case 'catcher': return <CatcherGame onGameEnd={handleGameEnd} />;
            case 'chooser': return <ChooserGame onGameEnd={handleGameEnd} />;
            case 'embarrassing': return <EmbarrassingSituationGame onGameEnd={handleGameEnd} />;
            case 'memoryMatch': return <MemoryMatchGame onGameEnd={handleGameEnd} />;
            case 'sugarBalance': return <SugarBalanceGame onGameEnd={handleGameEnd} />;
            case 'starCollector': return <StarCollectorGame onGameEnd={handleGameEnd} />;
            case 'dosageCalculator': return <DosageCalculatorGame onGameEnd={handleGameEnd} />;
            case 'symptomSpotter': return <SymptomSpotterGame onGameEnd={handleGameEnd} />;
            case 'mealPlanner': return <MealPlannerGame onGameEnd={handleGameEnd} />;
            case 'emergencyKit': return <EmergencyKitGame onGameEnd={handleGameEnd} />;
            case 'mythBusters': return <MythBustersGame onGameEnd={handleGameEnd} />;
            case 'carbCountingPro': return <CarbCountingProGame onGameEnd={handleGameEnd} />;
            case 'legendarySugar': return <LegendarySugarBalanceGame onGameEnd={handleGameEnd} />;
            case 'legendaryHero': return <LegendaryInsulinHeroGame onGameEnd={handleGameEnd} />;
            default: return null;
        }
    };

    if (!userType) {
        return (
            <div className="min-h-[calc(100vh-68px)] flex flex-col justify-center items-center bg-sky-100 p-4">
                 <h2 className="text-3xl font-bold text-sky-800 mb-8">من يلعب اليوم؟</h2>
                 <div className="flex gap-8">
                    <button onClick={() => setUserType('kid')} className="p-8 bg-white rounded-2xl shadow-lg hover:scale-105 transition-all">
                        <ChildIcon className="w-24 h-24 text-sky-500 mb-4" />
                        <span className="text-2xl font-bold">أنا طفل</span>
                    </button>
                    <button onClick={() => setUserType('parent')} className="p-8 bg-white rounded-2xl shadow-lg hover:scale-105 transition-all">
                        <AdultIcon className="w-24 h-24 text-blue-500 mb-4" />
                        <span className="text-2xl font-bold">أنا خبير</span>
                    </button>
                 </div>
            </div>
        );
    }

    if (activeGame) {
        return (
            <div className="w-full h-[calc(100vh-68px)] bg-gray-100 p-4 flex flex-col">
                <button onClick={() => setActiveGame(null)} className="absolute top-20 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 z-50">
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
                <h2 className="text-4xl font-bold text-sky-800 mb-4">ألعاب السكر الممتعة!</h2>
                <button onClick={() => setUserType(userType === 'kid' ? 'parent' : 'kid')} className="mb-8 inline-flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-6 rounded-full">
                    <SwitchUserIcon className="w-5 h-5" />
                    <span>تغيير اللاعب</span>
                </button>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gameDefs.map(game => (
                        <div key={game.id} className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform border-b-8 border-sky-400">
                           <div className="text-6xl mb-4 bg-sky-50 p-4 rounded-full inline-block">{game.icon}</div>
                           <h3 className="text-2xl font-bold text-sky-900 mb-2">{game.name}</h3>
                           <p className="text-gray-600 mb-4 h-12 overflow-hidden">{game.description}</p>
                           <button onClick={() => setActiveGame(game.id)} className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition-colors">ابدأ اللعب</button>
                        </div>
                    ))}
                </div>

                {userType === 'kid' && (
                    <div className="mt-16 relative">
                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 mb-6 uppercase tracking-widest">🏆 ركن الألعاب الأسطورية 🏆</h3>
                        <div className={`relative p-8 rounded-3xl border-4 border-yellow-400 overflow-hidden ${isLegendaryLocked ? 'bg-gray-200/50 backdrop-blur-sm' : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 shadow-2xl shadow-yellow-500/50'}`}>
                            {isLegendaryLocked ? (
                                <div className="flex flex-col items-center p-6 bg-gray-900/40 text-white">
                                    <LockIcon className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
                                    <h4 className="text-2xl font-bold">هذا الركن مغلق للأبطال فقط</h4>
                                    <p className="mb-4 text-yellow-100">تحتاج إلى 1500 نجمة لدخول عالم الأساطير!</p>
                                    <div className="w-full max-w-md bg-gray-700 h-6 rounded-full overflow-hidden border-2 border-yellow-500 mb-2">
                                        <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-300 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <span className="font-mono font-bold text-yellow-400">{stars} / 1500 ⭐</span>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-8">
                                     <div className="bg-white/10 p-6 rounded-2xl border border-yellow-400/30 text-white group hover:bg-white/20 transition-all">
                                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🍎</div>
                                        <h4 className="text-2xl font-bold mb-2">توازن السكر الأسطوري</h4>
                                        <p className="text-blue-100 mb-4">حافظ على التوازن في المنطقة الخضراء باستخدام بطاقاتك الذكية!</p>
                                        <button onClick={() => setActiveGame('legendarySugar')} className="w-full bg-yellow-500 text-blue-900 font-black py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg">إبدأ التحدي الملكي</button>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-2xl border border-yellow-400/30 text-white group hover:bg-white/20 transition-all">
                                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🦸‍♂️</div>
                                        <h4 className="text-2xl font-bold mb-2">بطل الأنسولين</h4>
                                        <p className="text-blue-100 mb-4">حارب وحوش السكر المرتفع باستخدام أدواتك الخارقة!</p>
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
