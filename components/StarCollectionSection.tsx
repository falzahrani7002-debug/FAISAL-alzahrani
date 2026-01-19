
import React, { useState, useEffect } from 'react';
import { useStars, getRewards, spendStars, unlockReward, Reward } from '../starManager';
import { playSound } from '../soundManager';

// A special effect component for the jewel reward
const JewelRainEffect: React.FC = () => {
    const jewelCount = 50;
    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
                {Array.from({ length: jewelCount }).map((_, i) => {
                    const style = {
                        left: `${Math.random() * 100}vw`,
                        fontSize: `${1 + Math.random() * 1.5}rem`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                        animationDelay: `${Math.random() * 5}s`,
                    };
                    return <i key={i} className="jeweldrop" style={style}>💎</i>;
                })}
            </div>
            <style>{`
                .jeweldrop {
                    position: absolute;
                    top: -5vh;
                    animation: fall-jewel linear forwards;
                    text-shadow: 0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(0, 255, 255, 0.5);
                }
                @keyframes fall-jewel {
                    from {
                        transform: translateY(0vh) rotate(0deg);
                    }
                    to {
                        transform: translateY(105vh) rotate(360deg);
                    }
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
            setTimeout(() => setJustBoughtId(null), 1500); // Animation timeout

            // If it's the special gem, trigger the rain effect!
            if (reward.id === 6) { // ID for "جوهرة الإلتزام"
                setShowJewelRain(true);
                setTimeout(() => setShowJewelRain(false), 5000); // Effect lasts for 5 seconds
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-yellow-50 to-sky-100 py-16 px-4 min-h-screen">
            {showJewelRain && <JewelRainEffect />}
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-sky-800 mb-4">⭐ تجميع النجوم ⭐</h2>
                    <p className="text-lg text-gray-600">استخدم نجومك التي كسبتها بجد للحصول على مكافآت رائعة!</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg mb-12 flex justify-center items-center">
                    <div className="flex items-center gap-x-4">
                        <h3 className="text-2xl font-bold text-gray-700">رصيدك الحالي:</h3>
                        <div className="flex items-center gap-x-2 bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded-full text-3xl shadow-inner">
                            <span>⭐</span>
                            <span>{stars}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border-b-8 border-sky-400">
                    <h3 className="text-3xl font-bold text-sky-900 mb-8 text-center">🛒 متجر الأبطال</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {rewards.map(reward => {
                            const canAfford = stars >= reward.cost;
                            const isJustBought = justBoughtId === reward.id;
                            return (
                                <div 
                                    key={reward.id} 
                                    className={`p-4 rounded-xl text-center border-4 flex flex-col items-center justify-between transition-all duration-300
                                        ${reward.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:border-sky-300'}
                                        ${isJustBought ? 'animate-bounce' : ''}
                                    `}
                                >
                                    <div className={`text-6xl mb-3 ${!reward.unlocked && !canAfford ? 'opacity-40 grayscale' : ''}`}>{reward.icon}</div>
                                    <h4 className={`text-lg font-bold ${reward.unlocked ? 'text-green-800' : 'text-gray-800'}`}>{reward.name}</h4>
                                    
                                    {reward.unlocked ? (
                                        <div className="mt-3 bg-green-500 text-white font-bold py-2 px-4 rounded-full w-full shadow-md">
                                            تم الشراء
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleRedeem(reward)}
                                            disabled={!canAfford}
                                            className="mt-3 w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-full hover:bg-sky-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-x-1 shadow-md"
                                        >
                                            <span>⭐</span>
                                            <span>{reward.cost}</span>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StarCollectionSection;
