import React, { useState } from 'react';
import Setup from './components/Setup';
import MainGame from './components/MainGame';
import SettingsModal from './components/SettingsModal';
import { Player, Settings } from './types';
import { DEFAULT_SETTINGS } from './constants';

export default function App() {
  const [gameState, setGameState] = useState<'setup' | 'playing'>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const handleStartGame = (files: File[]) => {
    setAudioFiles(files);
    setGameState('playing');
  };

  return (
    <>
      {gameState === 'setup' ? (
        <Setup 
          players={players} 
          setPlayers={setPlayers} 
          onStart={handleStartGame} 
          onOpenSettings={() => setShowSettings(true)}
        />
      ) : (
        <MainGame 
          players={players} 
          settings={settings} 
          audioFiles={audioFiles} 
          onBack={() => setGameState('setup')} 
        />
      )}

      {showSettings && (
        <SettingsModal 
          settings={settings} 
          onSave={(newSettings) => {
            setSettings(newSettings);
            setShowSettings(false);
          }} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </>
  );
}
