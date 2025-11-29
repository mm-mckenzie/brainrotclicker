import React, { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_UPGRADES, SLANG_WORDS, COLORS } from './constants';
import { Upgrade, FloatingText, BonusPopup } from './types';
import { generateYapping } from './services/geminiService';
import NewsTicker from './components/NewsTicker';
import StimulationFeed from './components/StimulationFeed';
import Particles from './components/Particles';
import { Zap, Brain, Trophy, Volume2, VolumeX, Flame, Ghost } from 'lucide-react';

export default function App() {
    // Game State
    const [aura, setAura] = useState<number>(0);
    const [lifetimeAura, setLifetimeAura] = useState<number>(0);
    const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);

    // Stimulation State
    const [combo, setCombo] = useState<number>(0);
    const [popups, setPopups] = useState<BonusPopup[]>([]);

    // Visual/Audio State
    const [particles, setParticles] = useState<FloatingText[]>([]);
    const [isShaking, setIsShaking] = useState<boolean>(false);
    const [yappingText, setYappingText] = useState<string>("WELCOME TO THE ROT");
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
    const [lastYapTime, setLastYapTime] = useState<number>(0);

    // Mega Mode State
    const [isMegaMode, setIsMegaMode] = useState<boolean>(false);
    const [megaModeTimeLeft, setMegaModeTimeLeft] = useState<number>(0);
    const [showFlash, setShowFlash] = useState<boolean>(false);

    // Refs for loops
    const particleIdCounter = useRef(0);
    const popupIdCounter = useRef(0);
    const shakeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clickContainerRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Constants
    const isFever = combo > 50;
    const megaMultiplier = isMegaMode ? 10 : 1;
    const feverMultiplier = isFever ? 2 : 1;
    const totalMultiplier = megaMultiplier * feverMultiplier;
    const baseAuraPerSecond = upgrades.reduce((acc, u) => acc + (u.baseRevenue * u.count), 0);
    const auraPerSecond = baseAuraPerSecond * totalMultiplier;
    const clickPower = (1 + (baseAuraPerSecond * 0.05)) * totalMultiplier;

    // Init Audio Context
    useEffect(() => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioContextRef.current = new AudioContext();
            }
        }
    }, []);

    // Sound Synth
    const playSound = useCallback((type: 'pop' | 'cha-ching' | 'vine-boom' | 'fever' | 'bonus') => {
        if (!soundEnabled || !audioContextRef.current) return;

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const now = ctx.currentTime;

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        if (type === 'pop') {
            osc.type = 'triangle';
            // Pitch goes up with combo
            const pitchMod = Math.min(combo * 10, 800);
            osc.frequency.setValueAtTime(400 + pitchMod + Math.random() * 100, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'cha-ching') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.linearRampToValueAtTime(1800, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'fever') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(500, now + 0.5);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'bonus') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.1);
            osc.frequency.linearRampToValueAtTime(1200, now + 0.2);
            gainNode.gain.setValueAtTime(0.4, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else {
            // Vine boomish
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(10, now + 0.4);
            gainNode.gain.setValueAtTime(0.8, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        }
    }, [soundEnabled, combo]);

    // TTS Yapper
    const speak = useCallback((text: string) => {
        if (!soundEnabled || !window.speechSynthesis) return;
        if (window.speechSynthesis.speaking) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.3 + (Math.random() * 0.4);
        utterance.pitch = 0.5 + Math.random() * 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            utterance.voice = voices[Math.floor(Math.random() * voices.length)];
        }

        window.speechSynthesis.speak(utterance);
    }, [soundEnabled]);

    // Main Loop (Passive Income)
    useEffect(() => {
        const interval = setInterval(() => {
            if (auraPerSecond > 0) {
                const tickAmount = auraPerSecond / 10;
                setAura(prev => prev + tickAmount);
                setLifetimeAura(prev => prev + tickAmount);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [auraPerSecond]);

    // Combo Decay Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setCombo(prev => Math.max(0, prev - 2));
        }, 200);
        return () => clearInterval(interval);
    }, []);

    // Mega Mode Timer
    useEffect(() => {
        if (isMegaMode && megaModeTimeLeft > 0) {
            const interval = setInterval(() => {
                setMegaModeTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsMegaMode(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isMegaMode, megaModeTimeLeft]);

    // Combo Watcher - Trigger Mega Mode at 50
    useEffect(() => {
        if (combo >= 50 && !isMegaMode) {
            // Trigger mega mode
            setIsMegaMode(true);
            setMegaModeTimeLeft(10);
            setCombo(0);

            // Screen flash
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 500);

            // Sound effect
            playSound('fever');
            speak('MEGA MODE ACTIVATED!');
        }
    }, [combo, isMegaMode, playSound, speak]);


    // Random Popup Spawner
    useEffect(() => {
        const interval = setInterval(() => {
            // 10% chance every 3 seconds to spawn bonus
            if (Math.random() > 0.9) {
                spawnPopup();
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [aura]); // Dep on aura just to keep it fresh

    // Periodic AI Yap
    useEffect(() => {
        const now = Date.now();
        if (now - lastYapTime > 20000 && lifetimeAura > 50) {
            setLastYapTime(now);
            generateYapping(Math.floor(aura)).then(text => {
                setYappingText(text);
                if (Math.random() > 0.6) speak(text);
            });
        }
    }, [aura, lifetimeAura, lastYapTime, speak]);

    const spawnPopup = () => {
        const padding = 100;
        const x = Math.random() * (window.innerWidth - padding * 2) + padding;
        const y = Math.random() * (window.innerHeight - padding * 2) + padding;

        const newPopup: BonusPopup = {
            id: popupIdCounter.current++,
            x,
            y,
            type: Math.random() > 0.5 ? 'GOLDEN_SKIBIDI' : 'MYSTERY_BOX',
            expiresAt: Date.now() + 5000 // 5 seconds to click
        };

        setPopups(prev => [...prev, newPopup]);
        playSound('bonus');

        // Auto remove after expiry
        setTimeout(() => {
            setPopups(prev => prev.filter(p => p.id !== newPopup.id));
        }, 5000);
    };

    const handlePopupClick = (popup: BonusPopup) => {
        setPopups(prev => prev.filter(p => p.id !== popup.id));
        triggerShake();

        let reward = 0;
        let text = "";

        if (popup.type === 'GOLDEN_SKIBIDI') {
            reward = (auraPerSecond * 60) + 1000;
            text = "SKIBIDI BONUS!";
            playSound('vine-boom');
        } else {
            reward = (auraPerSecond * 30) + 500;
            text = "MYSTERY RIZZ!";
            playSound('cha-ching');
        }

        setAura(prev => prev + reward);
        spawnParticle(popup.x, popup.y, `+${Math.floor(reward)}`, '#FFD700');
        spawnParticle(popup.x, popup.y - 50, text, '#FFFFFF');
    };

    // Click Handler
    const handleClick = (e: React.MouseEvent) => {
        const amount = clickPower;
        setAura(prev => prev + amount);
        setLifetimeAura(prev => prev + amount);
        setCombo(prev => prev + 1);

        triggerShake();
        const color = isFever ? COLORS[Math.floor(Math.random() * COLORS.length)] : '#FFFFFF';
        spawnParticle(e.clientX, e.clientY, `+${Math.floor(amount)}`, color);

        // Slang particles
        if (Math.random() > 0.7 || isFever) {
            const slang = SLANG_WORDS[Math.floor(Math.random() * SLANG_WORDS.length)];
            spawnParticle(
                e.clientX + (Math.random() * 100 - 50),
                e.clientY + (Math.random() * 100 - 50),
                slang,
                isFever ? '#FFFF00' : '#CCCCCC'
            );
        }

        playSound('pop');
    };

    const triggerShake = () => {
        setIsShaking(true);
        if (shakeTimeout.current) clearTimeout(shakeTimeout.current);
        shakeTimeout.current = setTimeout(() => setIsShaking(false), 200);
    };

    const spawnParticle = (x: number, y: number, text: string, color: string) => {
        const newParticle: FloatingText = {
            id: particleIdCounter.current++,
            x,
            y,
            text,
            color
        };
        setParticles(prev => [...prev, newParticle]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 1000);
    };

    const buyUpgrade = (upgradeId: string) => {
        setUpgrades(prev => prev.map(u => {
            if (u.id === upgradeId) {
                if (aura >= u.basePrice) {
                    setAura(a => a - u.basePrice);
                    playSound('cha-ching');
                    triggerShake();
                    const newPrice = Math.ceil(u.basePrice * 1.15);
                    if (u.id === 'skibidi_toilet') playSound('vine-boom');
                    return { ...u, count: u.count + 1, basePrice: newPrice };
                }
            }
            return u;
        }));
    };

    return (
        <div className={`w-screen h-screen overflow-hidden flex flex-col bg-black text-white relative 
        ${isShaking ? 'shake-active' : ''} 
        ${isFever ? 'shake-mild' : ''}
    `}>

            {/* FEVER MODE OVERLAY */}
            {isFever && (
                <div className="absolute inset-0 pointer-events-none z-0 rainbow-bg opacity-30 mix-blend-overlay"></div>
            )}

            {/* MEGA MODE FLASH */}
            {showFlash && (
                <div className="absolute inset-0 pointer-events-none z-[999] bg-white animate-[flash_0.5s_ease-out]"></div>
            )}


            {/* BACKGROUND STIMULATION */}
            <div className={`absolute inset-0 z-0 opacity-20 pointer-events-none ${isFever ? 'spin-bg' : ''}`}>
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzR6YWR2eXhzM3Z4eXhzM3Z4eXhzM3Z4eXhzM3Z4eXhzM3Z4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LdOyjZ7io5Msw/giphy.gif')] bg-repeat bg-center opacity-10 blur-sm"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-purple-900 via-transparent to-blue-900 mix-blend-overlay"></div>
            </div>

            <NewsTicker />

            {/* MAIN LAYOUT */}
            <div className="flex-1 flex overflow-hidden z-10 relative">

                {/* LEFT: FEED */}
                <StimulationFeed />

                {/* CENTER: CLICKER */}
                <div className="flex-1 flex flex-col items-center justify-center relative p-4" ref={clickContainerRef}>

                    {/* COMBO METER */}
                    <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-64 h-8 bg-gray-800 rounded-full border-2 ${isFever ? 'border-red-500 animate-pulse shadow-[0_0_20px_red]' : 'border-gray-600'} overflow-hidden`}>
                        <div
                            className={`h-full transition-all duration-100 ${isFever ? 'bg-gradient-to-r from-yellow-500 to-red-600' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(combo * 2, 100)}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-white drop-shadow-md">
                            {isMegaMode ? `🔥 MEGA MODE: ${megaModeTimeLeft}s 🔥` : isFever ? '🔥 GOON STREAK ACTIVE 🔥' : 'MOGGING STREAK'}
                        </div>
                    </div>

                    {/* SCORE DISPLAY */}
                    <div className="text-center mb-8 pointer-events-none mt-12">
                        <h2 className="text-2xl text-pink-400 font-bold mb-1 flex items-center justify-center gap-2">
                            {isFever && <Flame className="text-red-500 animate-bounce" />}
                            AURA POINTS
                            {isFever && <Flame className="text-red-500 animate-bounce" />}
                        </h2>
                        <h1 className={`text-6xl md:text-8xl font-black drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] ${isFever ? 'rainbow-text pulse-fast' : 'text-white'}`}>
                            {Math.floor(aura).toLocaleString()}
                        </h1>
                        <p className="text-gray-400 mt-2 font-mono text-xl bg-black/50 inline-block px-4 rounded-full">
                            {isMegaMode ? `\ud83d\udca5 10X MEGA MODE! \ud83d\udca5` : isFever ? '2X MULTIPLIER ACTIVE!' : `${Math.floor(auraPerSecond)} Aura/sec`}
                        </p>
                    </div>

                    {/* MAIN BUTTON */}
                    <button
                        onMouseDown={handleClick}
                        className={`group relative transition-transform active:scale-90 focus:outline-none ${isFever ? 'scale-110' : ''}`}
                    >
                        <div className={`absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 animate-pulse ${isFever ? 'bg-red-500 blur-3xl' : ''}`}></div>
                        <div className={`relative w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center border-8 border-white shadow-[0_0_50px_rgba(255,0,255,0.5)] ${isFever ? 'border-yellow-400 animate-spin-slow' : ''}`}>
                            <span className="text-8xl select-none group-active:rotate-12 transition-transform duration-75 block">
                                {isFever ? '👹' : '🗿'}
                            </span>
                        </div>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-active:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-5xl font-black text-red-500 stroke-black stroke-2 drop-shadow-lg">
                                {isFever ? 'GYATT!' : 'SIGMA!'}
                            </span>
                        </div>
                    </button>

                    {/* AI YAPPING BOX */}
                    <div className="mt-8 bg-black/80 border-2 border-purple-500 p-4 rounded-xl max-w-md text-center backdrop-blur-sm transform hover:scale-105 transition-transform shadow-[0_0_30px_rgba(120,0,255,0.4)]">
                        <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
                            <Brain className="w-5 h-5 animate-pulse" />
                            <span className="font-bold text-xs uppercase tracking-widest">Brainrot AI Agent</span>
                        </div>
                        <p className="text-xl font-bold text-white italic">"{yappingText}"</p>
                    </div>

                    {/* CONTROLS */}
                    <div className="absolute top-4 right-4 flex gap-2 z-50">
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors border border-gray-600"
                        >
                            {soundEnabled ? <Volume2 className="text-green-400" /> : <VolumeX className="text-red-400" />}
                        </button>
                    </div>
                </div>

                {/* RIGHT: SHOP */}
                <div className="w-full md:w-80 bg-gray-900 border-l-4 border-indigo-600 flex flex-col overflow-hidden z-20 shadow-2xl">
                    <div className="p-4 bg-indigo-900/80 border-b border-indigo-500 flex justify-between items-center backdrop-blur">
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            <Trophy className="text-yellow-400" />
                            THE SHOP
                        </h2>
                        <span className="text-xs text-indigo-300 font-mono">SPEND IT</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2 pb-20">
                        {upgrades.map(upgrade => {
                            const canAfford = aura >= upgrade.basePrice;
                            return (
                                <button
                                    key={upgrade.id}
                                    disabled={!canAfford}
                                    onClick={() => buyUpgrade(upgrade.id)}
                                    className={`w-full flex items-center p-2 rounded-xl border-2 transition-all relative overflow-hidden group ${canAfford
                                        ? 'bg-gray-800 border-indigo-500 hover:bg-gray-700 hover:scale-[1.02] active:scale-95 shadow-lg'
                                        : 'bg-gray-900/50 border-gray-700 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="text-3xl mr-3 group-hover:animate-bounce">{upgrade.icon}</div>
                                    <div className="flex-1 text-left">
                                        <div className="flex justify-between items-end">
                                            <h3 className="font-bold text-sm leading-none">{upgrade.name}</h3>
                                            <span className="text-xs font-black text-indigo-300">x{upgrade.count}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mb-1 leading-tight mt-1">{upgrade.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-mono text-xs font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                                                {upgrade.basePrice.toLocaleString()} AURA
                                            </span>
                                        </div>
                                    </div>
                                    {canAfford && (
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
                                    )}
                                </button>
                            );
                        })}

                        <div className="p-4 bg-gradient-to-r from-red-900 to-black rounded-xl border border-red-500 mt-8 text-center animate-pulse">
                            <h3 className="font-black text-red-500 text-xl mb-2">ASCEND TO OHIO?</h3>
                            <p className="text-xs text-red-300 mb-4">Reset progress for permanent multiplier.</p>
                            <button disabled className="bg-red-950 text-red-800 font-bold py-2 px-6 rounded cursor-not-allowed border border-red-900">
                                LOCKED (NEED 1B AURA)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* POPUPS LAYER */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-[50]">
                {popups.map(p => (
                    <button
                        key={p.id}
                        onClick={() => handlePopupClick(p)}
                        className="absolute pointer-events-auto transform hover:scale-110 active:scale-95 transition-transform animate-[floatUp_5s_linear]"
                        style={{ left: p.x, top: p.y }}
                    >
                        <div className="relative">
                            <span className="text-4xl animate-bounce block">
                                {p.type === 'GOLDEN_SKIBIDI' ? '🚽' : '🎁'}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <Particles particles={particles} />
        </div>
    );
}