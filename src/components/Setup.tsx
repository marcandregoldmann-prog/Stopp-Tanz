import React, { useState, useRef } from 'react';
import { Player } from '../types';
import { EMOJIS } from '../constants';
import { Settings as SettingsIcon, Play, Plus, Trash2, Music, CheckCircle } from 'lucide-react';

interface Props {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onStart: (files: File[]) => void;
  onOpenSettings: () => void;
}

export default function Setup({ players, setPlayers, onStart, onOpenSettings }: Props) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    if (players.length >= 10) {
      setError('Maximal 10 Spieler erlaubt!');
      return;
    }
    setPlayers([...players, { id: Date.now().toString(), name: newPlayerName.trim(), avatar: selectedEmoji }]);
    setNewPlayerName('');
    setError('');
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const audioFiles = files.filter(file => file.type.startsWith('audio/'));
      if (audioFiles.length > 0) {
        setAudioFiles(audioFiles);
        setError('');
      } else {
        setError('Keine Audio-Dateien im ausgewählten Ordner gefunden.');
      }
    }
  };

  const isReady = audioFiles.length > 0 && players.length > 0;

  const handleStart = () => {
    if (!isReady) return;
    onStart(audioFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white/50 p-4 rounded-3xl shadow-sm backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-fredoka flex-1 text-center drop-shadow-sm flex items-center justify-center gap-2">
            Der verrückte Stopptanz <span className="text-4xl">🦩</span>
          </h1>
          <button 
            onClick={onOpenSettings}
            className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm text-gray-600 hover:text-blue-500"
            title="Einstellungen"
          >
            <SettingsIcon size={28} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-xl animate-fade-in shadow-md">
            <p className="font-bold">Hoppla!</p>
            <p>{error}</p>
          </div>
        )}

        {/* 1. Musik auswählen */}
        <div className="mb-8 bg-white/90 p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-200/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3 font-fredoka">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
              <Music size={28} />
            </div>
            1. Musik auswählen
          </h2>

          <input 
            type="file" 
            // @ts-ignore
            webkitdirectory="true" 
            directory="true"
            multiple 
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full font-bold py-5 rounded-2xl text-xl transition-all shadow-md transform active:scale-95 duration-200 flex items-center justify-center gap-3
              ${audioFiles.length > 0
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
                : 'bg-blue-400 hover:bg-blue-500 text-white shadow-blue-200'
              }`}
          >
            {audioFiles.length > 0 ? (
              <>
                <CheckCircle size={28} />
                ✅ {audioFiles.length} Lieder geladen
              </>
            ) : (
              'Musikordner wählen'
            )}
          </button>
        </div>

        {/* 2. Mitspieler */}
        <div className="mb-8 bg-white/90 p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-200/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center gap-3 font-fredoka">
             <div className="bg-pink-100 p-2 rounded-xl text-pink-600">
               <span className="text-2xl">👶</span>
             </div>
             2. Mitspieler <span className="text-pink-400 text-lg">({players.length}/10)</span>
          </h2>
          
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input 
              type="text" 
              placeholder="Name des Kindes" 
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
              className="flex-1 px-5 py-3 rounded-2xl border-2 border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none text-lg bg-pink-50/50 transition-all placeholder:text-pink-300"
            />
            <button 
              onClick={handleAddPlayer}
              disabled={players.length >= 10 || !newPlayerName.trim()}
              className="bg-pink-400 hover:bg-pink-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-pink-200"
            >
              <Plus size={24} strokeWidth={3} /> Hinzufügen
            </button>
          </div>

          <div className="mb-8">
            <p className="text-sm font-bold text-pink-500 uppercase tracking-wider mb-3 ml-1">Wähle deinen Avatar:</p>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-3xl p-3 rounded-2xl transition-all duration-200 active:scale-90 ${selectedEmoji === emoji
                    ? 'bg-pink-200 scale-110 shadow-lg ring-2 ring-pink-400 rotate-3'
                    : 'hover:bg-pink-100 hover:scale-105 bg-white border border-pink-50'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Die Bühne (The Stage) */}
          {players.length > 0 && (
            <div className="mt-8 pt-6 border-t-2 border-dashed border-pink-100">
               <p className="text-center text-pink-300 text-sm font-bold uppercase tracking-widest mb-4">Auf der Tanzfläche</p>
               <div className="flex flex-wrap justify-center gap-3">
                {players.map(player => (
                  <div key={player.id} className="bg-white pl-4 pr-2 py-2 rounded-full shadow-md border border-pink-100 flex items-center gap-3 animate-pop-in hover:shadow-lg transition-shadow group">
                    <span className="text-2xl transform group-hover:scale-125 transition-transform duration-300">{player.avatar}</span>
                    <span className="font-bold text-gray-700">{player.name}</span>
                    <button
                      onClick={() => handleRemovePlayer(player.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 p-1.5 rounded-full transition-colors"
                      title="Entfernen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Start Button */}
        <button 
          onClick={handleStart}
          disabled={!isReady}
          className={`w-full py-6 rounded-3xl text-3xl font-black transition-all shadow-xl flex items-center justify-center gap-4 font-fredoka
            ${isReady
              ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse cursor-pointer active:scale-95 shadow-green-300 hover:shadow-green-400'
              : 'bg-gray-300 opacity-70 cursor-not-allowed text-gray-100 shadow-none'
            }`}
        >
          <Play fill="currentColor" size={36} /> LOS GEHT'S!
        </button>

        {!isReady && (
           <p className="text-center text-blue-300/80 mt-4 text-sm font-medium">
             Wähle Musik und mindestens einen Spieler aus.
           </p>
        )}
      </div>
    </div>
  );
}
