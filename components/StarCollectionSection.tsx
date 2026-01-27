
import React, { useState, useEffect } from 'react';
import { useStars, getRewards, spendStars, unlockReward, Reward } from '../starManager';
import { playSound } from '../soundManager';

// Improved dynamic rain effect with multiple particle types and varied physics
const JewelRainEffect: React.FC = () => {
    const particles = ['💎', '⭐', '✨', '🌟', '💠'];
    const particleCount = 60;
    
    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[100]">
                {Array.from({ length: particleCount }).map((_, i) => {
                    const type = particles[Math.floor(Math.random() * particles.length)];
                    const size = 1 + Math.random() * 2;
                    const duration = 2 + Math.random() * 4;
                    const delay = Math.random() * 3;
                    const left = Math.random() * 100;
                    const opacity = 0.3 + Math.random() * 0.7;
                    const blur = Math.random() > 0.8 ? 'blur(1px)' : 'none';

                    return (
                        <div 
                            key={i} 
                            className="particle-drop absolute text-center select-none"
                            style={{
                                left: `${left}vw`,
                                top: '-10vh',
                                fontSize: `${size}rem`,
                                opacity: opacity,
                                filter: blur,
                                animation: `fall-dynamic ${duration}s linear ${delay}s infinite`,
                            }}
                        >
                            {type}
                        </div>
                    );
                })}
            </div>
            <style>{`
                @keyframes fall-dynamic {
                    0% {
                        transform: translateY(0vh) rotate(0deg) translateX(0px);
                    }
                    25% {
                        transform: translateY(25vh) rotate(90deg) translateX(15px);
                    }
                    50% {
                        transform: translateY(50vh) rotate(180deg) translateX(-15px);
                    }
                    75% {
                        transform: translateY(75vh) rotate(270deg) translateX(10px);
                    }
                    100% {
                        transform: translateY(110vh) rotate(360deg) translateX(0px);
                    }
                }
                .particle-drop {
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                }
            `}</style>
        </>
    );
};

const StarCollectionSection: React.FC = () => {
    const stars = useStars();
    const [rewards, setRewards] = useState<Reward[]>(getRewards());
    const [justBoughtId, setJustBoughtId] = useState<number | null>(null);
    const [showJewelRain, setShowJewelRain] = useState(false);

    const handleRedeem = (reward: Reward) => {
        if (stars >= reward.cost && !reward.unlocked) {
            spendStars(reward.cost);
            const updatedRewards = unlockReward(reward.id);
            setRewards(updatedRewards);
            setJustBoughtId(reward.id);
            playSound('levelUp');
            
            // Trigger the special rain effect
            setShowJewelRain(true);
            setTimeout(() => {
                setJustBoughtId(null);
            }, 1500);
            
            // Effect lasts for 6 seconds
            setTimeout(() => setShowJewelRain(false), 6000); 
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-yellow-50 to-sky-100 py-16 px-4 min-h-screen relative">
            {showJewelRain && <JewelRainEffect />}
            
            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-800 mb-4">⭐ تجميع النجوم ⭐</h2>
                    <p className="text-xl text-sky-700 font-bold">كل نجمة هي خطوة نحو البطولة!</p>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl mb-12 flex flex-col md:flex-row justify-between items-center border-2 border-white">
                    <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">رصيدك من النجوم</h3>
                        <p className="text-gray-500 text-sm">استمر في إنجاز المهام للحصول على المزيد!</p>
                    </div>
                    <div className="flex items-center gap-x-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black px-10 py-4 rounded-3xl text-4xl shadow-lg ring-4 ring-yellow-200">
                        <span className="animate-pulse">⭐</span>
                        <span>{stars}</span>
                    </div>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border-b-[12px] border-sky-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
                    <h3 className="text-3xl font-black text-sky-900 mb-10 text-center relative">🛒 متجر الأبطال الملكي</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {rewards.map(reward => {
                            const canAfford = stars >= reward.cost;
                            const isJustBought = justBoughtId === reward.id;
                            return (
                                <div 
                                    key={reward.id} 
                                    className={`relative p-6 rounded-3xl text-center border-2 transition-all duration-500 transform hover:-translate-y-2
                                        ${reward.unlocked 
                                            ? 'bg-gradient-to-b from-green-50 to-green-100 border-green-300 shadow-lg shadow-green-200' 
                                            : canAfford 
                                                ? 'bg-white border-sky-300 shadow-xl shadow-sky-100' 
                                                : 'bg-gray-50 border-gray-200 grayscale opacity-70'}
                                        ${isJustBought ? 'scale-110 ring-4 ring-yellow-400 z-20' : ''}
                                    `}
                                >
                                    {reward.unlocked && (
                                        <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1 shadow-md">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                        </div>
                                    )}
                                    <div className={`text-7xl mb-4 transition-transform ${isJustBought ? 'animate-bounce' : 'group-hover:scale-110'}`}>{reward.icon}</div>
                                    <h4 className={`text-xl font-black mb-4 ${reward.unlocked ? 'text-green-800' : 'text-sky-900'}`}>{reward.name}</h4>
                                    
                                    {reward.unlocked ? (
                                        <div className="bg-green-600 text-white font-bold py-2 rounded-xl w-full shadow-inner">
                                            تم الفتح!
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleRedeem(reward)}
                                            disabled={!canAfford}
                                            className={`w-full font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-x-2
                                                ${canAfford 
                                                    ? 'bg-sky-600 text-white hover:bg-sky-700 active:scale-95' 
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                            `}
                                        >
                                            <span className="text-xl">⭐</span>
                                            <span>{reward.cost}</span>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="mt-12 text-center p-6 bg-sky-900 rounded-2xl text-white shadow-xl">
                    <p className="text-lg font-bold">💡 هل تعلم؟</p>
                    <p className="text-sky-200 italic mt-1">فتح جميع المكافآت يجعلك "بطلاً أسطورياً" في مجتمعنا!</p>
                </div>
            </div>
        </div>
    );
};

export default StarCollectionSection;
