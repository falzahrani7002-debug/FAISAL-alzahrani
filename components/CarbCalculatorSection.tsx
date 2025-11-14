import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

const Spinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface CarbResult {
    food_name: string;
    serving_size: string;
    carbohydrates: string;
    found: boolean;
}

const CarbCalculatorSection: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<CarbResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const model = 'gemini-2.5-flash';
            const systemInstruction = `You are a nutritional assistant for a diabetes management app for children and parents. Your goal is to provide carbohydrate information for various foods in Arabic. When a user provides a food name, you must return the estimated carbohydrate content for a common serving size (like 100g or 1 cup). Respond ONLY with a JSON object following the provided schema. If the food is not found or is ambiguous, set 'found' to false and provide a helpful food_name like 'طعام غير معروف'.`;
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    food_name: { type: Type.STRING },
                    serving_size: { type: Type.STRING },
                    carbohydrates: { type: Type.STRING },
                    found: { type: Type.BOOLEAN },
                },
                required: ['food_name', 'serving_size', 'carbohydrates', 'found'],
            };

            const response = await ai.models.generateContent({
                model,
                contents: `احسب الكربوهيدرات في: ${query}`,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema,
                },
            });

            const jsonString = response.text.trim();
            const parsedResult: CarbResult = JSON.parse(jsonString);

            if (parsedResult.found) {
                setResult(parsedResult);
            } else {
                setError('عذرًا، لم أتمكن من العثور على معلومات حول هذا الطعام. حاول البحث باسم آخر.');
            }

        } catch (e) {
            console.error(e);
            setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-sky-50 py-16 px-4 min-h-[calc(100vh-68px)]">
            <div className="container mx-auto max-w-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-sky-800 mb-4">🧮 حاسبة الكربوهيدرات</h2>
                    <p className="text-lg text-gray-600">
                        أدخل اسم الطعام الذي تريد معرفة كمية الكربوهيدرات فيه، وسأبحث لك!
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                            placeholder="مثال: تفاحة، خبز أبيض، كوب حليب"
                            disabled={isLoading}
                            onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
                            aria-label="ادخل اسم الطعام"
                        />
                        <button
                            onClick={handleCalculate}
                            disabled={isLoading || !query.trim()}
                            className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-sky-700 transition-colors duration-300 flex items-center justify-center disabled:bg-sky-400 disabled:cursor-not-allowed"
                            aria-live="polite"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner />
                                    <span>جاري الحساب...</span>
                                </>
                            ) : (
                                'احسب'
                            )}
                        </button>
                    </div>

                    <div className="mt-8 min-h-[150px] flex items-center justify-center">
                        {result && (
                            <div className="text-center bg-green-50 p-6 rounded-lg border-l-8 border-green-400 w-full animate-fade-in" role="alert">
                                <div className="text-2xl mb-2">🍽️</div>
                                <h3 className="text-2xl font-bold text-gray-800">{result.food_name}</h3>
                                <p className="text-5xl font-bold text-green-600 my-2">{result.carbohydrates}</p>
                                <p className="text-md text-gray-600">({result.serving_size})</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center bg-red-50 p-6 rounded-lg border-l-8 border-red-400 w-full animate-fade-in" role="alert">
                                <div className="text-2xl mb-2">😟</div>
                                <p className="text-lg text-red-700">{error}</p>
                            </div>
                        )}

                         {!isLoading && !result && !error && (
                            <div className="text-center text-gray-400">
                                <p>ستظهر النتائج هنا...</p>
                            </div>
                         )}
                    </div>

                     <p className="text-xs text-gray-500 mt-6 text-center">
                        ملاحظة: هذه المعلومات تقديرية وقد تختلف. استشر طبيبك أو أخصائي التغذية دائمًا.
                    </p>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CarbCalculatorSection;
