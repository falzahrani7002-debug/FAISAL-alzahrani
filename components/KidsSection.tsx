
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { useStars } from '../starManager';

// Icons
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);
const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
);
const Spinner: React.FC = () => (
  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Audio helper functions
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface Story {
  icon: string;
  title: string;
  content: string;
  voice: 'Kore' | 'Puck' | 'Charon' | 'Zephyr' | 'Fenrir';
}

const stories: Story[] = [
    {
        icon: '🦸‍♂️',
        title: 'سامي بطل السكر',
        content: `كان يا مكان، في قرية جميلة، يعيش ولد شجاع اسمه سامي. اكتشف سامي أن لديه قوة خاصة في دمه، قوة السكر! لكن أحيانًا، كانت هذه القوة تزيد أو تقل كثيرًا.\n\nتعلم سامي أن يستخدم جهازًا صغيرًا يشبه الهاتف ليقيس قوة السكر. كان الجهاز يخبره متى يحتاج جسمه للطاقة. وكان لديه قلم سحري صغير، "قلم الإنسولين"، يساعده على تنظيم هذه القوة.\n\nفي البداية، كان سامي يخاف قليلاً من وخزة الإصبع، لكنه سرعان ما أدرك أنها مثل لمسة البطل الخارقة التي تعطيه معلومات سرية عن جسمه. أصبح سامي يأكل الخضروات والفواكه اللذيذة ويلعب مع أصدقائه بكل نشاط، لأنه عرف كيف يكون "بطل السكر" ويسيطر على قوته الخاصة!`,
        voice: 'Kore'
    },
    {
        icon: '🕵️‍♀️',
        title: 'المحققة ليلى والطعام الصحي',
        content: `ليلى فتاة ذكية تحب الألغاز. عندما أخبرها الطبيب أنها مصابة بالسكري، قررت أن تصبح "محققة طعام"!\n\nمهمتها كانت اكتشاف الأطعمة الصديقة التي تعطيها طاقة، وتلك التي يجب أن تأكل منها باعتدال. كانت تستخدم عدستها المكبرة لتقرأ مكونات الأطعمة وتفهمها. اكتشفت أن الفواكه والخضروات أصدقاؤها الأقوياء، بينما الحلوى تحتاج إلى حذر. أصبحت ليلى خبيرة، وشاركت أسرارها مع كل أصدقائها الأبطال.`,
        voice: 'Puck'
    },
    {
        icon: '🚀',
        title: 'فريق السكر الخارق',
        content: `في كل مرة تقيس فيها سكرك، أو تأخذ الإنسولين، أو تختار طعامًا صحيًا، أنت لا تقوم بذلك وحدك! هناك فريق كامل من الأصدقاء الخارقين معك. "كابتن إنسولين" يمنحك القوة، و"شيف التغذية" يساعدك في اختيار الوقود المناسب، و"مدرب الرياضة" يجعلك نشيطًا. أنتم معًا "فريق السكر الخارق"، وتحمون صحتكم كل يوم!`,
        voice: 'Charon'
    }
];

interface InfoCard {
  icon: string;
  title: string;
  content: string;
}

const infoCards: InfoCard[] = [
  {
    icon: '🩸',
    title: 'ما هو سكر الدم؟',
    content: 'إنه وقود جسمك! مثل البنزين للسيارة. أنت تحتاج الكمية المناسبة من الوقود لتكون نشيطًا وسعيدًا.',
  },
  {
    icon: '🏃‍♀️',
    title: 'لماذا الرياضة مهمة؟',
    content: 'اللعب والجري يساعدان جسمك على استخدام وقود السكر بشكل أفضل. كلما تحركت أكثر، أصبحت أقوى وأكثر صحة!',
  },
];

const KidsSection: React.FC = () => {
    const [playingStory, setPlayingStory] = useState<string | null>(null);
    const [loadingStory, setLoadingStory] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const audioCacheRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        return () => {
            stopPlayback();
            audioContextRef.current?.close();
        };
    }, []);

    const stopPlayback = () => {
        if (audioSourceRef.current) {
            try { audioSourceRef.current.stop(); } catch (e) {}
            audioSourceRef.current.disconnect();
            audioSourceRef.current = null;
        }
        setPlayingStory(null);
    };

    const handlePlayStory = async (story: Story) => {
        if (playingStory === story.title) { stopPlayback(); return; }
        if (loadingStory) return;

        stopPlayback();
        setLoadingStory(story.title);
        setError(null);

        try {
            let base64Audio = audioCacheRef.current.get(story.title);
            if (!base64Audio) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-preview-tts",
                    contents: [{ parts: [{ text: `Say with a friendly and engaging tone for a child: ${story.content}` }] }],
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: { voiceName: story.voice },
                            },
                        },
                    },
                });
                base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (base64Audio) audioCacheRef.current.set(story.title, base64Audio);
            }
            
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
            
            if (base64Audio && audioContextRef.current) {
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.start();
                audioSourceRef.current = source;
                setPlayingStory(story.title);
                source.onended = () => {
                    if (audioSourceRef.current === source) { setPlayingStory(null); audioSourceRef.current = null; }
                };
            }
        } catch (err) {
            setError("عذرًا، حدث خطأ أثناء تشغيل القصة.");
        } finally {
            setLoadingStory(null);
        }
    };
    
    return (
        <div className="bg-gradient-to-br from-sky-100 to-blue-100 py-16 px-4 min-h-screen">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-sky-800 mb-4">أهلاً بك يا بطل!</h2>
                    <p className="text-lg text-gray-600">عالمك الخاص المليء بالمرح والمفاجآت!</p>
                </div>

                {/* Info Cards */}
                <div className="mb-16 grid md:grid-cols-2 gap-8">
                    {infoCards.map((card) => (
                        <div key={card.title} className="bg-white p-6 rounded-xl shadow-lg flex items-start gap-x-5 border-l-8 border-yellow-400 transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl bg-yellow-100 p-3 rounded-full">{card.icon}</div>
                            <div>
                                <h4 className="text-xl font-bold text-sky-800">{card.title}</h4>
                                <p className="text-gray-600 mt-1">{card.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stories Section */}
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-16">
                    <h3 className="text-3xl font-bold text-center text-sky-900 mb-8">📖 قصص الأبطال</h3>
                    <div className="space-y-6">
                        {stories.map(story => (
                            <div key={story.title} className="bg-sky-50 p-6 rounded-xl shadow-md flex items-center gap-x-5 border-l-8 border-sky-300">
                                <div className="text-5xl bg-white p-3 rounded-full shadow">{story.icon}</div>
                                <div className="flex-grow">
                                    <h4 className="text-xl font-bold text-sky-800">{story.title}</h4>
                                    <p className="text-gray-600 text-sm mt-1">استمع للقصة بصوت ممتع!</p>
                                </div>
                                <button 
                                    onClick={() => handlePlayStory(story)}
                                    className="bg-sky-500 text-white rounded-full p-3 hover:bg-sky-600 transition-all duration-300 shadow-lg flex items-center justify-center w-12 h-12"
                                    disabled={loadingStory !== null && loadingStory !== story.title}
                                >
                                    {loadingStory === story.title ? <Spinner /> : (playingStory === story.title ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>)}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KidsSection;
