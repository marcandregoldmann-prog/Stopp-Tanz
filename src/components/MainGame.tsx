import React, { useState, useEffect, useRef } from 'react';
import { Player, Settings, Pose } from '../types';
import { POSES } from '../constants';
import { ArrowLeft, Pause, Play, SkipForward, Music } from 'lucide-react';

interface Props {
  players: Player[];
  settings: Settings;
  audioFiles: File[];
  onBack: () => void;
}

type GameState = 'playing' | 'paused' | 'countdown' | 'cooldown';

export default function MainGame({ players, settings, audioFiles, onBack }: Props) {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [currentPose, setCurrentPose] = useState<Pose | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const poseAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Screen Wake Lock API
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch (err: any) {
        if (err.name !== 'NotAllowedError') {
          console.error('Wake Lock error:', err);
        }
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, []);

  // Stop pose audio helper
  const stopPoseAudio = () => {
    if (poseAudioRef.current) {
      poseAudioRef.current.pause();
      poseAudioRef.current.currentTime = 0;
    }
  };

  // Audio Setup
  useEffect(() => {
    if (audioFiles.length === 0) return;

    const file = audioFiles[currentSongIndex];
    const url = URL.createObjectURL(file);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
      if (gameState === 'playing') {
        audioRef.current.play().catch(e => {
          if (e.name !== 'AbortError') console.error("Audio play error:", e);
        });
      }
    } else {
      audioRef.current = new Audio(url);
      audioRef.current.addEventListener('ended', handleSongEnd);
      if (gameState === 'playing') {
        audioRef.current.play().catch(e => {
          if (e.name !== 'AbortError') console.error("Audio play error:", e);
        });
      }
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [currentSongIndex, audioFiles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopPoseAudio();
    };
  }, []);

  const handleSongEnd = () => {
    setGameState('cooldown');
    stopPoseAudio();
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // 10 second cooldown before next song
    setTimeout(() => {
      setCurrentSongIndex(prev => (prev + 1) % audioFiles.length);
      setGameState('playing');
    }, 10000);
  };

  // Game Loop
  useEffect(() => {
    if (gameState === 'playing') {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(e => {
          if (e.name !== 'AbortError') console.error("Audio play error:", e);
        });
      }

      const minTime = settings.minMusicTime * 1000;
      const maxTime = settings.maxMusicTime * 1000;
      const randomPlayTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

      timerRef.current = setTimeout(() => {
        triggerPause();
      }, randomPlayTime);
    } else if (gameState === 'paused' || gameState === 'countdown' || gameState === 'cooldown') {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, settings]);

  const triggerPause = async () => {
    setGameState('paused');
    const randomPose = POSES[Math.floor(Math.random() * POSES.length)];
    setCurrentPose(randomPose);
    
    // Stop any previous pose audio and play new one
    stopPoseAudio();

    // Fix path for GitHub Pages: remove leading slash and prepend BASE_URL
    const audioPath = `${import.meta.env.BASE_URL}${randomPose.audioFile.replace(/^\//, '')}`;

    console.log("Versuche abzuspielen:", audioPath);

    poseAudioRef.current = new Audio(audioPath);
    poseAudioRef.current.play().catch(e => {
      console.error("Pose audio play error:", e);
    });

    const minPause = settings.minPauseTime * 1000;
    const maxPause = settings.maxPauseTime * 1000;
    const randomPauseTime = Math.floor(Math.random() * (maxPause - minPause + 1)) + minPause;

    timerRef.current = setTimeout(() => {
      startCountdown();
    }, randomPauseTime);
  };

  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
    
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setGameState('playing');
        setCurrentPose(null);
        stopPoseAudio(); // Stop pose audio when game resumes
      }
    }, 1000);
  };

  const handleManualNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stopPoseAudio();
    setCurrentSongIndex(prev => (prev + 1) % audioFiles.length);
    setGameState('playing');
  };

  const handleManualToggle = () => {
    if (gameState === 'playing') {
      if (timerRef.current) clearTimeout(timerRef.current);
      triggerPause();
    } else if (gameState === 'paused') {
      startCountdown();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${
      gameState === 'playing' ? 'bg-green-200' : 
      gameState === 'countdown' ? 'bg-yellow-200' : 
      gameState === 'cooldown' ? 'bg-blue-200' : 'bg-pink-200'
    }`}>
      
      <button 
        onClick={() => {
          if (audioRef.current) audioRef.current.pause();
          stopPoseAudio();
          onBack();
        }}
        className="absolute top-6 left-6 p-4 bg-white/50 hover:bg-white rounded-full shadow-sm backdrop-blur-sm transition-all z-10"
      >
        <ArrowLeft size={32} className="text-gray-700" />
      </button>

      {/* Visual Feedback / Main Content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative">
        
        {/* Avatar Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-0 pointer-events-none">
          {players.map((player, index) => {
            const angle = (index / players.length) * 360;
            return (
              <div
                key={player.id}
                className="absolute top-0 left-0 flex items-center justify-center w-12 h-12"
                style={{
                  transform: `rotate(${angle}deg) translateY(-13rem) rotate(-${angle}deg)`
                }}
              >
                <div
                  className={`text-5xl transition-transform ${gameState === 'playing' ? 'animate-dance' : ''}`}
                  style={{
                    animationDelay: `${index * 0.15}s`
                  }}
                >
                  {player.avatar}
                </div>
              </div>
            );
          })}
        </div>

        {gameState === 'playing' && (
          <div className="flex flex-col items-center animate-fade-in z-10">
            <div className="w-52 h-52 md:w-64 md:h-64 bg-green-400 rounded-full flex items-center justify-center shadow-2xl animate-pulse-fast">
              <Music size={100} className="text-white animate-bounce-slow" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-green-800 mt-12 text-center">
              TANZ!
            </h2>
          </div>
        )}

        {gameState === 'paused' && currentPose && (
          <div className="flex flex-col items-center animate-pop-in text-center px-4 relative z-10">
            <div className="text-[150px] md:text-[200px] leading-none drop-shadow-2xl mb-8">
              {currentPose.emoji}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-pink-800 max-w-3xl leading-tight">
              {currentPose.text}
            </h2>
          </div>
        )}

        {gameState === 'countdown' && (
          <div className="flex flex-col items-center animate-pop-in relative z-10">
            <div className="text-[200px] md:text-[250px] font-black text-yellow-600 drop-shadow-2xl">
              {countdown}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-800 mt-4">
              Macht euch bereit...
            </h2>
          </div>
        )}

        {gameState === 'cooldown' && (
          <div className="flex flex-col items-center animate-fade-in text-center relative z-10">
            <div className="text-[100px] md:text-[150px] mb-8">
              🎵
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-blue-800 mb-4">
              Lied zu Ende!
            </h2>
            <p className="text-2xl text-blue-600">
              Kurze Verschnaufpause...
            </p>
          </div>
        )}

      </div>

      {/* Player Bar */}
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 truncate w-full text-center md:text-left">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Aktuelles Lied</p>
          <p className="text-xl font-bold text-gray-800 truncate">
            {audioFiles[currentSongIndex]?.name || 'Unbekannt'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleManualToggle}
            className="w-20 h-20 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            {gameState === 'playing' ? <Pause fill="currentColor" size={36} /> : <Play fill="currentColor" size={36} className="ml-2" />}
          </button>
          
          <button 
            onClick={handleManualNext}
            className="w-16 h-16 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95"
          >
            <SkipForward fill="currentColor" size={28} />
          </button>
        </div>
      </div>

      {/* Players Display */}
      {players.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-4xl">
          {players.map(player => (
            <div key={player.id} className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
              <span className="text-2xl">{player.avatar}</span>
              <span className="font-bold text-gray-800">{player.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
