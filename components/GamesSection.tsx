import React, { useState, useEffect, useCallback, useRef } from 'react';
import { addStars } from '../starManager';
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

// --- KID'S GAMES DATA & COMPONENTS ---

// Game 1: Catcher Game Types and Data
interface FoodItem {
  id: number;
  emoji: string;
  type: 'healthy' | 'unhealthy';
  x: number; // horizontal position percentage
  y: number; // vertical position (starts at -10)
  speed: number;
}
const healthyFoods = ['🍎', '🥦', '🥕', '🍓', '🍇', '🍗', '🥛'];
const unhealthyFoods = ['🍬', '🍭', '🍩', '🥤', '🍕', '🍟', '🍫'];

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

// Game 2: Chooser Game Types and Data
interface FoodChoice { emoji: string; name: string; isHealthy: boolean; }
interface FoodPair { id: number; options: [FoodChoice, FoodChoice]; }
const foodPairs: FoodPair[] = [
  { id: 1, options: [{ emoji: '🍎', name: 'تفاحة', isHealthy: true }, { emoji: '🍩', name: 'دونات', isHealthy: false }] },
  { id: 2, options: [{ emoji: '🥦', name: 'بروكلي', isHealthy: true }, { emoji: '🍟', name: 'بطاطس مقلية', isHealthy: false }] },
  { id: 3, options: [{ emoji: '💧', name: 'ماء', isHealthy: true }, { emoji: '🥤', name: 'مشروب غازي', isHealthy: false }] },
];

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


// Game 6: Embarrassing Situations Game
interface Situation { id: number; scenario: string; emoji: string; options: { text: string; isCorrect: boolean }[]; feedback: string; }
const situations: Situation[] = [
    { id: 1, scenario: 'أنت في حفلة عيد ميلاد، والجميع يأكل الكيك. ماذا تفعل؟', emoji: '🎂', options: [{ text: 'آكل قطعة صغيرة وأضبط جرعة الإنسولين', isCorrect: true }, { text: 'لا آكل شيئًا وأشعر بالحزن', isCorrect: false }], feedback: 'أحسنت! يمكنك الاستمتاع بكل شيء باعتدال ومع التخطيط.' },
    { id: 2, scenario: 'رن جهاز قياس السكر الخاص بك بصوت عالٍ في الفصل. ماذا تفعل؟', emoji: '🔔', options: [{ text: 'أشعر بالإحراج وأخبئه بسرعة', isCorrect: false }, { text: 'أخبر معلمتي بهدوء أنني بحاجة لفحص السكر', isCorrect: true }], feedback: 'تصرف رائع! صحتك هي الأهم، وشرح الموقف بهدوء هو الأفضل.' },
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

// Game 7: Memory Match Game
const memoryCards = ['🍎', '🥦', '💧', '💉', '🏃‍♂️', '❤️'];

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

// New Kid Game: Sugar Balance
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
            
            // Random fluctuation
            const change = (Math.random() - 0.47) * 4; // Tends to rise slightly
            const newLevel = level + change;

            // Check boundaries
            if (newLevel < 0 || newLevel > 100) {
                setGameOver(true);
                playSound('lose');
                onGameEnd(score);
            } else {
                setLevel(newLevel);
                // Increase score if in safe zone
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
                    <div 
                        className="absolute h-full w-2 bg-black top-0 rounded-full transition-all duration-100" 
                        style={{ left: `${level}%` }}
                    ></div>
                </div>
            </div>
            <div className="flex gap-8 mt-8">
                 <button onClick={() => adjustLevel(-5)} className="p-4 rounded-full bg-blue-500 text-white shadow-lg text-3xl hover:bg-blue-600"><ArrowDownIcon className="w-10 h-10" /></button>
                 <button onClick={() => adjustLevel(5)} className="p-4 rounded-full bg-red-500 text-white shadow-lg text-3xl hover:bg-red-600"><ArrowUpIcon className="w-10 h-10" /></button>
            </div>
            <div className="mt-8 text-2xl font-bold text-teal-900">النتيجة: {score}</div>
            {gameOver && <div className="mt-4 text-2xl font-bold text-red-600">انتهت اللعبة!</div>}
        </div>
    );
};

// New Game: Star Collector
const starCollectorChallenges = [
    { type: 'select', prompt: 'اختر الطعام الصحي!', items: [{ emoji: '🥦', isCorrect: true }, { emoji: '🍔', isCorrect: false }, { emoji: '🍩', isCorrect: false }] },
    { type: 'count', prompt: 'كم عدد التفاحات؟', itemEmoji: '🍎', count: 3, options: [2, 3, 4] },
    { type: 'select', prompt: 'اختر الشراب الأفضل!', items: [{ emoji: '💧', isCorrect: true }, { emoji: '🥤', isCorrect: false }, { emoji: '🧃', isCorrect: false }] },
    { type: 'quiz', prompt: 'ماذا تفعل عند انخفاض السكر؟', options: [{ text: 'أشرب عصير', isCorrect: true }, { text: 'أذهب للنوم', isCorrect: false }, { text: 'ألعب رياضة', isCorrect: false }] },
    { type: 'count', prompt: 'كم عدد قطرات الدم؟', itemEmoji: '🩸', count: 4, options: [3, 4, 5] },
];

const StarCollectorGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [challenges, setChallenges] = useState(() => shuffleArray([...starCollectorChallenges]));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'timeup' | null>(null);
    
    const handleAnswer = (isCorrect: boolean) => {
        if (feedback) return;

        if (isCorrect) {
            setScore(s => s + 10);
            setFeedback('correct');
            playSound('levelUp');
        } else {
            setFeedback('incorrect');
            playSound('incorrect');
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentIndex + 1 < challenges.length) {
                setCurrentIndex(i => i + 1);
            } else {
                playSound('win');
                onGameEnd(score + (isCorrect ? 10 : 0));
            }
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
            <div className="absolute top-4 right-4 text-2xl font-bold text-cyan-500 bg-white/70 px-3 py-1 rounded-full">النتيجة: <span className="font-mono text-cyan-500">{score}</span></div>
            <div className="absolute top-4 left-4 text-xl font-bold text-cyan-500">تحدي <span className="font-mono text-cyan-500">{currentIndex + 1}/{challenges.length}</span></div>
            
            <h3 className="text-3xl font-bold text-yellow-900 mb-8">{currentChallenge.prompt}</h3>
            
            {currentChallenge.type === 'select' && (
                <div className="flex gap-4 sm:gap-8">
                    {currentChallenge.items.map((item) => (
                        <button key={item.emoji} onClick={() => handleAnswer(item.isCorrect)} disabled={!!feedback}
                            className="p-4 sm:p-6 rounded-2xl bg-white shadow-lg transform transition-transform hover:scale-110 disabled:cursor-not-allowed">
                            <span className="text-6xl sm:text-8xl">{item.emoji}</span>
                        </button>
                    ))}
                </div>
            )}

            {currentChallenge.type === 'count' && (
                 <>
                    <div className="text-6xl mb-6">
                        {Array.from({ length: currentChallenge.count }).map((_, i) => currentChallenge.itemEmoji)}
                    </div>
                    <div className="flex gap-4 sm:gap-8">
                        {currentChallenge.options.map(option => (
                            <button key={option} onClick={() => handleAnswer(option === currentChallenge.count)} disabled={!!feedback}
                                className="w-20 h-20 sm:w-24 sm:h-24 text-4xl font-bold rounded-2xl bg-white shadow-lg transform transition-transform hover:scale-110 disabled:cursor-not-allowed text-cyan-500 font-mono">
                                {option}
                            </button>
                        ))}
                    </div>
                 </>
            )}

             {currentChallenge.type === 'quiz' && (
                <div className="space-y-4 w-full max-w-md">
                    {currentChallenge.options.map(option => (
                        <button key={option.text} onClick={() => handleAnswer(option.isCorrect)} disabled={!!feedback}
                            className="w-full p-4 rounded-lg text-xl font-semibold bg-white shadow-md hover:bg-yellow-50 disabled:cursor-not-allowed text-cyan-500">
                            {option.text}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- PARENTS' GAMES DATA & COMPONENTS ---

// Game 1: Dosage Calculator
interface DoseQuestion { id: number; bs: number; carbs: number; carbRatio: number; correctionFactor: number; target: number; answer: number; }
const doseQuestions: DoseQuestion[] = [
    { id: 1, bs: 180, carbs: 45, carbRatio: 15, correctionFactor: 50, target: 120, answer: 4.2 },
    { id: 2, bs: 250, carbs: 60, carbRatio: 10, correctionFactor: 40, target: 100, answer: 9.8 },
    { id: 3, bs: 90, carbs: 30, carbRatio: 15, correctionFactor: 50, target: 110, answer: 2.0 },
    { id: 4, bs: 200, carbs: 0, carbRatio: 12, correctionFactor: 50, target: 120, answer: 1.6 },
];

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
        if(isCorrect) {
            setScore(s => s + 1);
            playSound('levelUp');
            setFeedback(`صحيح! الجرعة المضبوطة هي ${currentQ.answer.toFixed(1)} وحدة.`);
        } else {
            playSound('incorrect');
            setFeedback(`غير دقيق. الجرعة الصحيحة هي ${currentQ.answer.toFixed(1)} وحدة. حاول مجددًا في السؤال التالي.`);
        }
        setTimeout(() => {
            setFeedback(null);
            setUserAnswer('');
            if(qIndex + 1 < qList.length) {
                setQIndex(i => i + 1);
            } else {
                playSound('win');
                onGameEnd(score + (isCorrect ? 1 : 0));
            }
        }, 3000);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-blue-100 rounded-lg text-center">
            <h3 className="text-3xl font-bold text-blue-800 mb-4">لعبة حاسبة الجرعات</h3>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <p className="text-xl font-semibold mb-4">السيناريو ({qIndex+1}/{qList.length}):</p>
                <div className="grid grid-cols-2 gap-4 text-left text-lg">
                    <p><strong>سكر الدم الحالي:</strong> <span className="font-mono text-blue-600">{currentQ.bs}</span> mg/dL</p>
                    <p><strong>كربوهيدرات الوجبة:</strong> <span className="font-mono text-blue-600">{currentQ.carbs}</span> g</p>
                    <p><strong>معامل الكربوهيدرات:</strong> 1 / <span className="font-mono text-blue-600">{currentQ.carbRatio}</span> g</p>
                    <p><strong>معامل التصحيح:</strong> <span className="font-mono text-blue-600">{currentQ.correctionFactor}</span> mg/dL</p>
                    <p><strong>السكر المستهدف:</strong> <span className="font-mono text-blue-600">{currentQ.target}</span> mg/dL</p>
                </div>
                <div className="mt-6">
                    <label htmlFor="dose-input" className="block text-lg font-medium text-gray-700 mb-2">ما هي جرعة الإنسولين المطلوبة (مقربة لأقرب عُشر)؟</label>
                    <input type="number" id="dose-input" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                           className="w-full text-center text-2xl p-2 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                           placeholder="0.0" step="0.1" disabled={!!feedback} />
                </div>
                <button onClick={checkAnswer} disabled={!userAnswer || !!feedback} className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                    تحقق من الجرعة
                </button>
            </div>
            {feedback && <p className="mt-4 text-xl font-bold p-4 bg-white rounded-lg">{feedback}</p>}
        </div>
    );
};

// Game 2: Symptom Spotter
interface Symptom { id: number; description: string; type: 'hypo' | 'hyper'; }
const symptoms: Symptom[] = [
    { id: 1, description: "تعرق بارد، رجفة، وشعور شديد بالجوع.", type: 'hypo' },
    { id: 2, description: "عطش شديد، كثرة تبول، وتشوش في الرؤية.", type: 'hyper' },
    { id: 3, description: "صداع، شحوب، وسرعة في ضربات القلب.", type: 'hypo' },
    { id: 4, description: "إرهاق، جفاف الفم، ورائحة نفس تشبه الفاكهة.", type: 'hyper' },
];

const SymptomSpotterGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [qList] = useState(() => shuffleArray([...symptoms]));
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<'hypo' | 'hyper' | null>(null);
    const currentQ = qList[qIndex];

    const handleAnswer = (answer: 'hypo' | 'hyper') => {
        if(feedback) return;
        setSelectedAnswer(answer);
        const isCorrect = answer === currentQ.type;
        if(isCorrect) {
            setScore(s => s + 1);
            playSound('levelUp');
            setFeedback("تشخيص صحيح! معرفة الأعراض هي الخطوة الأولى للتعامل السليم.");
        } else {
            playSound('incorrect');
            setFeedback(`إجابة خاطئة. هذه أعراض ${currentQ.type === 'hypo' ? 'انخفاض' : 'ارتفاع'} السكر.`);
        }
        setTimeout(() => {
            setFeedback(null);
            setSelectedAnswer(null);
            if(qIndex + 1 < qList.length) {
                setQIndex(i => i + 1);
            } else {
                playSound('win');
                onGameEnd(score + (isCorrect ? 1 : 0));
            }
        }, 2500);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-red-100 rounded-lg text-center">
            <h3 className="text-3xl font-bold text-red-800 mb-6">لعبة علامات الخطر</h3>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <p className="text-xl font-semibold mb-4">الأعراض الظاهرة ({qIndex+1}/{qList.length}):</p>
                <p className="text-2xl text-gray-700 p-4 border border-gray-200 rounded-md bg-gray-50 mb-6">{currentQ.description}</p>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleAnswer('hypo')} 
                        disabled={!!feedback} 
                        className={`p-4 font-bold text-xl rounded-lg transition-all duration-300 ${
                            !feedback 
                                ? 'bg-sky-500 text-white hover:bg-sky-600' 
                                : currentQ.type === 'hypo' 
                                    ? 'bg-green-500 text-white scale-105 ring-4 ring-green-300' 
                                    : selectedAnswer === 'hypo' 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-sky-500 text-white opacity-50'
                        }`}
                    >
                        انخفاض السكر
                    </button>
                    <button 
                        onClick={() => handleAnswer('hyper')} 
                        disabled={!!feedback} 
                        className={`p-4 font-bold text-xl rounded-lg transition-all duration-300 ${
                            !feedback 
                                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                : currentQ.type === 'hyper' 
                                    ? 'bg-green-500 text-white scale-105 ring-4 ring-green-300' 
                                    : selectedAnswer === 'hyper' 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-orange-500 text-white opacity-50'
                        }`}
                    >
                        ارتفاع السكر
                    </button>
                </div>
            </div>
            {feedback && <p className="mt-4 text-xl font-bold p-4 bg-white rounded-lg">{feedback}</p>}
        </div>
    );
};

// Game 3: Meal Planner
interface MealItem { name: string; emoji: string; carbs: number; }
const mealItems: MealItem[] = [
    { name: 'تفاحة', emoji: '🍎', carbs: 15 }, { name: 'شريحة خبز أسمر', emoji: '🥖', carbs: 15 }, { name: 'كوب حليب', emoji: '🥛', carbs: 12 },
    { name: 'بيضة مسلوقة', emoji: '🥚', carbs: 1 }, { name: 'صدر دجاج', emoji: '🍗', carbs: 0 }, { name: 'كوب أرز', emoji: '🍚', carbs: 45 },
    { name: 'صحن سلطة', emoji: '🥗', carbs: 5 }, { name: 'موزة', emoji: '🍌', carbs: 27 }, { name: 'كوب زبادي', emoji: '🥣', carbs: 10 },
];

const MealPlannerGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [targetCarbs] = useState(() => 30 + Math.floor(Math.random() * 4) * 5); // 30, 35, 40, 45
    const [selectedItems, setSelectedItems] = useState<MealItem[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const totalCarbs = selectedItems.reduce((sum, item) => sum + item.carbs, 0);

    const toggleItem = (item: MealItem) => {
        if(gameOver) return;
        setSelectedItems(prev => prev.find(i => i.name === item.name) ? prev.filter(i => i.name !== item.name) : [...prev, item]);
    };

    const checkMeal = () => {
        if(gameOver) return;
        setGameOver(true);
        const difference = Math.abs(totalCarbs - targetCarbs);
        let finalScore = 0;
        if (difference <= 5) {
            finalScore = 15; // Excellent
            playSound('win');
        } else if (difference <= 10) {
            finalScore = 10; // Good
            playSound('levelUp');
        } else {
            finalScore = 5; // Needs improvement
            playSound('incorrect');
        }
        setScore(finalScore);
        setTimeout(() => onGameEnd(finalScore), 3000);
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-8 bg-green-100 rounded-lg text-center">
            <h3 className="text-3xl font-bold text-green-800 mb-2">لعبة مخطط الوجبات</h3>
            <p className="text-lg text-gray-700 mb-4">اختر الأطعمة لتكوين وجبة تحتوي على حوالي <strong className="text-green-700">{targetCarbs} غرام</strong> من الكربوهيدرات.</p>
            <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {mealItems.map(item => (
                        <button key={item.name} onClick={() => toggleItem(item)}
                                className={`p-3 rounded-lg border-2 ${selectedItems.find(i => i.name === item.name) ? 'bg-green-200 border-green-500' : 'bg-gray-100 border-gray-200'}`}>
                            <span className="text-4xl">{item.emoji}</span>
                            <span className="block text-sm font-semibold">{item.name}</span>
                            <span className="block text-xs text-gray-500">{item.carbs}g</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-inner w-full max-w-lg">
                <p className="text-xl"><strong>إجمالي الكربوهيدرات:</strong> <span className={`font-bold font-mono text-2xl ${totalCarbs > targetCarbs + 5 ? 'text-red-500' : 'text-green-600'}`}>{totalCarbs}</span> / {targetCarbs} g</p>
                {!gameOver && <button onClick={checkMeal} className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">تأكيد الوجبة</button>}
                {gameOver && <p className="mt-2 text-xl font-bold">{score >= 15 ? "ممتاز! وجبة متوازنة." : (score >= 10 ? "جيد جداً! قريب من الهدف." : "تحتاج لضبط أفضل.")}</p>}
            </div>
        </div>
    );
};

// New Parent Game: Emergency Kit
const allKitItems = [
    { name: 'عصير سريع المفعول', emoji: '🧃', isEssential: true },
    { name: 'جهاز قياس السكر', emoji: '📟', isEssential: true },
    { name: 'ماء', emoji: '💧', isEssential: true },
    { name: 'أقراص جلوكوز', emoji: '🍬', isEssential: true },
    { name: 'لعبة فيديو', emoji: '🎮', isEssential: false },
    { name: 'وجبة خفيفة (بسكويت)', emoji: '🍪', isEssential: true },
    { name: 'إبرة جلوكاجون', emoji: '💉', isEssential: true },
    { name: 'كتاب تلوين', emoji: '🖍️', isEssential: false },
    { name: 'هاتف الطوارئ', emoji: '📱', isEssential: true },
];
const essentialItemNames = new Set(allKitItems.filter(i => i.isEssential).map(i => i.name));

const EmergencyKitGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [kitItems, setKitItems] = useState<Set<string>>(new Set());
    const [submitted, setSubmitted] = useState(false);

    const toggleItem = (itemName: string) => {
        if (submitted) return;
        setKitItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemName)) {
                newSet.delete(itemName);
            } else {
                newSet.add(itemName);
            }
            return newSet;
        });
    };

    const checkKit = () => {
        setSubmitted(true);
        let correctCount = 0;
        let incorrectCount = 0;

        kitItems.forEach(item => {
            if (essentialItemNames.has(item)) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });

        const score = Math.max(0, (correctCount * 3) - (incorrectCount * 2));
        playSound(score > 10 ? 'win' : 'lose');
        setTimeout(() => onGameEnd(score), 3000);
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-8 bg-orange-100 rounded-lg text-center">
            <h3 className="text-3xl font-bold text-black mb-2">لعبة حقيبة الطوارئ</h3>
            <p className="text-lg text-black mb-6">اختر كل الأغراض المهمة التي يجب أن تكون في حقيبة طوارئ السكري.</p>
            <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {allKitItems.map(item => {
                        const isSelected = kitItems.has(item.name);
                        let feedbackClass = '';
                        if (submitted) {
                            if (item.isEssential && isSelected) feedbackClass = 'bg-green-200 border-green-500'; // Correctly chosen
                            else if (item.isEssential && !isSelected) feedbackClass = 'bg-red-200 border-red-500'; // Missed
                            else if (!item.isEssential && isSelected) feedbackClass = 'bg-yellow-200 border-yellow-500'; // Incorrectly chosen
                        }
                        return (
                            <button key={item.name} onClick={() => toggleItem(item.name)} disabled={submitted}
                                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${isSelected && !submitted ? 'bg-blue-200 border-blue-500' : 'bg-gray-100 border-gray-200'} ${feedbackClass}`}>
                                <span className="text-4xl">{item.emoji}</span>
                                <span className="block text-sm font-semibold text-black">{item.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
            {!submitted ? (
                <button onClick={checkKit} className="w-full max-w-lg mt-4 bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700">تحقق من الحقيبة</button>
            ) : (
                 <p className="mt-4 text-xl font-bold p-4 bg-white rounded-lg text-black">يتم حساب نتيجتك... أحسنت!</p>
            )}
        </div>
    );
};

// New Parent Game: Myth Busters
interface Myth {
    id: number;
    statement: string;
    isMyth: boolean; // true if it's a myth, false if it's a fact
    explanation: string;
}
const myths: Myth[] = [
    { id: 1, statement: 'أكل الكثير من السكر يسبب مرض السكري من النوع الأول.', isMyth: true, explanation: 'خرافة! النوع الأول هو مرض مناعي ذاتي، وليس له علاقة مباشرة بكمية السكر المتناولة.' },
    { id: 2, statement: 'الأطفال المصابون بالسكري لا يمكنهم أكل الحلويات أبدًا.', isMyth: true, explanation: 'خرافة! يمكنهم أكل الحلويات باعتدال كجزء من خطة وجبات متوازنة مع حساب جرعة الإنسولين.' },
    { id: 3, statement: 'الإنسولين يسبب الإدمان.', isMyth: true, explanation: 'خرافة! الإنسولين هو هرمون حيوي يحتاجه الجسم للبقاء على قيد الحياة، وهو ليس مادة إدمانية.' },
    { id: 4, statement: 'يمكن "الشفاء" من مرض السكري من النوع الأول بالأعشاب.', isMyth: true, explanation: 'خرافة! حتى الآن، لا يوجد علاج شافٍ للسكري من النوع الأول، والعلاج الوحيد هو الإنسولين.' },
    { id: 5, statement: 'الرياضة خطيرة على الأطفال المصابين بالسكري.', isMyth: true, explanation: 'خرافة! الرياضة ضرورية ومفيدة جدًا، لكنها تتطلب تخطيطًا ومراقبة لمستوى السكر لتجنب الانخفاض.' },
    { id: 6, statement: 'إذا كنت مصابًا بالسكري، فلن تتمكن من ممارسة الرياضة.', isMyth: true, explanation: 'خرافة! الرياضة مهمة جدًا ومفيدة، ولكنها تتطلب تخطيطًا ومراقبة لمستوى السكر.' },
    { id: 7, statement: 'الإنسولين هو علاج نهائي للسكري.', isMyth: true, explanation: 'خرافة! الإنسولين هو علاج لإدارة السكري، ولكنه ليس شفاءً. إنه ضروري للحياة.' },
    { id: 8, statement: 'التوتر والقلق يمكن أن يؤثرا على مستويات السكر في الدم.', isMyth: false, explanation: 'حقيقة! التوتر يمكن أن يرفع أو يخفض مستويات السكر، لذلك من المهم تعلم طرق الاسترخاء.' },
    { id: 9, statement: 'يمكن أن تنتقل عدوى السكري من شخص لآخر.', isMyth: true, explanation: 'خرافة! السكري ليس مرضًا معديًا على الإطلاق، لا يمكنك "التقاطه" من شخص آخر.' },
];

const MythBustersGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [gameMyths] = useState<Myth[]>(() => shuffleArray([...myths]));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
    const currentMyth = gameMyths[currentIndex];

    const handleAnswer = (userAnswerIsMyth: boolean) => {
        if (feedback) return;
        const isCorrect = userAnswerIsMyth === currentMyth.isMyth;
        if (isCorrect) {
            setScore(s => s + 5);
            playSound('levelUp');
        } else {
            playSound('incorrect');
        }
        setFeedback({ correct: isCorrect, explanation: currentMyth.explanation });

        setTimeout(() => {
            setFeedback(null);
            if (currentIndex + 1 < gameMyths.length) {
                setCurrentIndex(i => i + 1);
            } else {
                playSound('win');
                onGameEnd(score + (isCorrect ? 5 : 0));
            }
        }, 3500);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-gray-200 rounded-lg text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">لعبة كشف الخرافات</h3>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mb-6">
                <p className="text-xl font-semibold mb-2 text-gray-500">العبارة ({currentIndex + 1}/{gameMyths.length}):</p>
                <p className="text-2xl text-gray-800">{currentMyth.statement}</p>
            </div>
            {!feedback ? (
                <div className="flex gap-8">
                    <button onClick={() => handleAnswer(false)} className="bg-green-500 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-green-600 transition">حقيقة</button>
                    <button onClick={() => handleAnswer(true)} className="bg-red-500 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-red-600 transition">خرافة</button>
                </div>
            ) : (
                <div className={`p-4 rounded-lg w-full max-w-lg ${feedback.correct ? 'bg-green-100' : 'bg-red-100'}`}>
                    <h4 className={`text-2xl font-bold ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>
                        {feedback.correct ? 'إجابة صحيحة!' : 'إجابة خاطئة!'}
                    </h4>
                    <p className="mt-2 text-gray-700">{feedback.explanation}</p>
                </div>
            )}
        </div>
    );
};

// New Parent Game: Carb Counting Pro
interface Meal { id: number; name: string; items: string; emoji: string; answer: number; }
const meals: Meal[] = [
    { id: 1, name: 'وجبة فطور', items: 'كوب حليب، نصف كوب شوفان، موزة صغيرة', emoji: '🥣', answer: 60 },
    { id: 2, name: 'وجبة غداء', items: 'صدر دجاج مشوي، كوب أرز، صحن سلطة صغير', emoji: '🍛', answer: 50 },
    { id: 3, name: 'وجبة عشاء', items: 'قطعة بيتزا مارجريتا متوسطة', emoji: '🍕', answer: 35 },
    { id: 4, name: 'وجبة خفيفة', items: 'تفاحة متوسطة مع ملعقة زبدة فول سوداني', emoji: '🍎', answer: 25 },
];

const CarbCountingProGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [gameMeals] = useState(() => shuffleArray([...meals]));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const currentMeal = gameMeals[currentIndex];

    const checkAnswer = () => {
        if (feedback) return;
        const answer = parseInt(userAnswer, 10);
        if (isNaN(answer)) {
            setFeedback("الرجاء إدخال رقم صحيح.");
            setTimeout(() => setFeedback(null), 1500);
            return;
        }

        const difference = Math.abs(answer - currentMeal.answer);
        let isCorrect = false;
        if (difference <= 5) { // within 5g is correct
            setScore(s => s + 10);
            isCorrect = true;
            playSound('levelUp');
            setFeedback(`ممتاز! الإجابة الصحيحة حوالي ${currentMeal.answer} جرام.`);
        } else {
            playSound('incorrect');
            setFeedback(`قريب! الإجابة الصحيحة حوالي ${currentMeal.answer} جرام.`);
        }

        setTimeout(() => {
            setFeedback(null);
            setUserAnswer('');
            if (currentIndex + 1 < gameMeals.length) {
                setCurrentIndex(i => i + 1);
            } else {
                playSound('win');
                onGameEnd(score + (isCorrect ? 10 : 0));
            }
        }, 3000);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-indigo-100 rounded-lg text-center">
            <h3 className="text-3xl font-bold text-indigo-800 mb-6">حساب الكربوهيدرات المتقدم</h3>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mb-6">
                <p className="text-xl font-semibold text-gray-500">الوجبة ({currentIndex + 1}/{gameMeals.length}):</p>
                <div className="text-6xl my-4">{currentMeal.emoji}</div>
                <h4 className="text-2xl font-bold text-indigo-900">{currentMeal.name}</h4>
                <p className="text-gray-600">{currentMeal.items}</p>
            </div>
            <div>
                <label htmlFor="carb-input" className="block text-lg font-medium text-gray-700 mb-2">كم جرامًا من الكربوهيدرات في هذه الوجبة (تقريبًا)؟</label>
                <input 
                    id="carb-input"
                    type="number" 
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    className="w-48 text-center text-3xl p-2 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                    disabled={!!feedback}
                />
                <button onClick={checkAnswer} disabled={!userAnswer || !!feedback} className="mt-4 ml-4 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300">
                    تأكيد
                </button>
            </div>
            {feedback && <p className="mt-4 text-xl font-bold p-4 bg-white rounded-lg">{feedback}</p>}
        </div>
    );
};


// --- GAME DEFINITIONS ---

const kidGameDefs = [
    { id: 'catcher', name: 'صائد الأكل الصحي', description: 'امسك الأكل الصحي وتجنب غير الصحي!', component: 'CatcherGame' },
    { id: 'chooser', name: 'لعبة الاختيار الذكي', description: 'اختر الطعام الصحيح بين خيارين.', component: 'ChooserGame' },
    { id: 'embarrassing', name: 'مواقف الأبطال', description: 'كيف تتصرف في المواقف المختلفة؟', component: 'EmbarrassingSituationGame' },
    { id: 'memoryMatch', name: 'ذاكرة الأبطال', description: 'اختبر ذاكرتك وطابق الرموز الصحية!', component: 'MemoryMatchGame' },
    { id: 'sugarBalance', name: 'ميزان السكر', description: 'حافظ على توازن مستوى السكر!', component: 'SugarBalanceGame' },
    { id: 'starCollector', name: 'جامع النجوم', description: 'أكمل التحديات السريعة لجمع النجوم!', component: 'StarCollectorGame' },
];

const parentGameDefs = [
    { id: 'dosageCalculator', name: 'حاسبة الجرعات', description: 'تدرب على حساب جرعات الإنسولين.', component: 'DosageCalculatorGame' },
    { id: 'symptomSpotter', name: 'علامات الخطر', description: 'تعلم التمييز بين أعراض الهبوط والارتفاع.', component: 'SymptomSpotterGame' },
    { id: 'mealPlanner', name: 'مخطط الوجبات', description: 'مارس تخطيط وجبات متوازنة بالكربوهيدرات.', component: 'MealPlannerGame' },
    { id: 'emergencyKit', name: 'حقيبة الطوارئ', description: 'تأكد من معرفتك بمحتويات حقيبة الطوارئ.', component: 'EmergencyKitGame' },
    { id: 'mythBusters', name: 'كشف الخرافات', description: 'اختبر معلوماتك حول الخرافات الشائعة عن السكري.', component: 'MythBustersGame' },
    { id: 'carbCountingPro', name: 'حساب الكارب المتقدم', description: 'قدّر الكربوهيدرات في وجبات كاملة.', component: 'CarbCountingProGame' },
];

type KidGameId = 'catcher' | 'chooser' | 'embarrassing' | 'memoryMatch' | 'sugarBalance' | 'starCollector';
type ParentGameId = 'dosageCalculator' | 'symptomSpotter' | 'mealPlanner' | 'emergencyKit' | 'mythBusters' | 'carbCountingPro';
type GameId = KidGameId | ParentGameId;

// --- MAIN GAMES SECTION COMPONENT ---

export const GamesSection: React.FC = () => {
    const [userType, setUserType] = useState<'kid' | 'parent' | null>(null);
    const [activeGame, setActiveGame] = useState<GameId | null>(null);
    const [lastGameScore, setLastGameScore] = useState<number | null>(null);

    const handleGameEnd = useCallback((score: number) => {
        let starsEarned;
        // For MythBusters, the score is already the star count (5 per correct answer)
        if (activeGame === 'mythBusters') {
            starsEarned = score;
        } else {
            // Default formula for other games
            starsEarned = Math.floor(score / 2) + 5;
        }
        addStars(starsEarned);
        setLastGameScore(starsEarned);
        setActiveGame(null);
    }, [activeGame]);

    const renderActiveGame = () => {
        if (!activeGame) return null;
        switch(activeGame) {
            // Kid Games
            case 'catcher': return <CatcherGame onGameEnd={handleGameEnd} />;
            case 'chooser': return <ChooserGame onGameEnd={handleGameEnd} />;
            case 'embarrassing': return <EmbarrassingSituationGame onGameEnd={handleGameEnd} />;
            case 'memoryMatch': return <MemoryMatchGame onGameEnd={handleGameEnd} />;
            case 'sugarBalance': return <SugarBalanceGame onGameEnd={handleGameEnd} />;
            case 'starCollector': return <StarCollectorGame onGameEnd={handleGameEnd} />;
            // Parent Games
            case 'dosageCalculator': return <DosageCalculatorGame onGameEnd={handleGameEnd} />;
            case 'symptomSpotter': return <SymptomSpotterGame onGameEnd={handleGameEnd} />;
            case 'mealPlanner': return <MealPlannerGame onGameEnd={handleGameEnd} />;
            case 'emergencyKit': return <EmergencyKitGame onGameEnd={handleGameEnd} />;
            case 'mythBusters': return <MythBustersGame onGameEnd={handleGameEnd} />;
            case 'carbCountingPro': return <CarbCountingProGame onGameEnd={handleGameEnd} />;
            default: return null;
        }
    };

    const startGame = (gameId: GameId) => {
        setLastGameScore(null);
        playSound('click');
        setActiveGame(gameId);
    }
    
    if (!userType) {
        return (
            <div className="min-h-[calc(100vh-68px)] flex flex-col justify-center items-center bg-sky-100 p-4">
                 <h2 className="text-3xl font-bold text-sky-800 mb-8 text-center">من يلعب اليوم؟</h2>
                 <div className="flex flex-col md:flex-row gap-8">
                    <button onClick={() => { playSound('click'); setUserType('kid'); }} className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        <ChildIcon className="w-24 h-24 text-sky-500 mb-4" />
                        <span className="text-2xl font-bold text-sky-800">أنا طفل</span>
                    </button>
                    <button onClick={() => { playSound('click'); setUserType('parent'); }} className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        <AdultIcon className="w-24 h-24 text-blue-500 mb-4" />
                        <span className="text-2xl font-bold text-blue-800">أنا خبير</span>
                    </button>
                 </div>
            </div>
        );
    }

    if (activeGame) {
        return (
            <div className="w-full h-[calc(100vh-68px)] bg-gray-100 p-4 flex flex-col">
                <button onClick={() => { setActiveGame(null); setUserType(null); }} className="absolute top-20 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 z-10">
                   <BackIcon className="w-6 h-6 text-gray-700" />
                </button>
                {renderActiveGame()}
            </div>
        );
    }

    const gameDefs = userType === 'kid' ? kidGameDefs : parentGameDefs;
    const title = userType === 'kid' ? 'ألعاب السكر الممتعة!' : 'ألعاب تعليمية للخبير';
    const subtitle = userType === 'kid' ? 'العب وتعلم واجمع النجوم لتصبح بطل السكري!' : 'طور مهاراتك ومعلوماتك لرعاية أفضل.';

    return (
        <div className="py-16 px-4 bg-gradient-to-b from-sky-100 to-white">
            <div className="container mx-auto max-w-5xl text-center">
                <h2 className="text-4xl font-bold text-sky-800 mb-4">{title}</h2>
                <p className="text-lg text-gray-600 mb-8">{subtitle}</p>
                
                {userType === 'kid' && (
                    <p className="text-gray-500 -mt-4 mb-8">ملحوظة: يوجد ألعاب مناسبة للصغار والكبار حسب خبرتهم في التعامل مع السكري.</p>
                )}

                <div className="mb-8">
                    {userType === 'kid' ? (
                        <button 
                            onClick={() => { playSound('click'); setUserType('parent'); }} 
                            className="inline-flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
                        >
                            <SwitchUserIcon className="w-5 h-5" />
                            <span>الانتقال إلى قسم الخبير</span>
                        </button>
                    ) : (
                        <button 
                            onClick={() => { playSound('click'); setUserType('kid'); }} 
                            className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-sky-600 transition-all duration-300"
                        >
                            <SwitchUserIcon className="w-5 h-5" />
                            <span>الانتقال إلى قسم الطفل</span>
                        </button>
                    )}
                </div>

                {lastGameScore !== null && (
                    <div className="mb-8 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg shadow-md max-w-md mx-auto" role="alert">
                        <p className="font-bold">أحسنت! لقد ربحت {lastGameScore} ⭐ نجوم!</p>
                    </div>
                )}
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gameDefs.map(game => (
                        <div key={game.id} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
                           <div className="text-5xl mb-4">
                            {
                                {
                                'catcher': '🍎', 'chooser': '🤔', 'embarrassing': '😅', 'memoryMatch': '🧠', 'sugarBalance': '⚖️', 'starCollector': '🌠',
                                'dosageCalculator': '🧮', 'symptomSpotter': '⚠️', 'mealPlanner': '🍽️', 'emergencyKit': '🎒', 'mythBusters': '🧐', 'carbCountingPro': '🥗'
                                }[game.id]
                            }
                           </div>
                           <h3 className="text-2xl font-bold text-sky-900 mb-2">{game.name}</h3>
                           <p className="text-gray-600 flex-grow mb-4">{game.description}</p>
                           <button onClick={() => startGame(game.id as GameId)} className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-300 text-lg">
                                ابدأ اللعب
                           </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};