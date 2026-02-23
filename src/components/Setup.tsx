import React, { useState, useRef } from 'react';
import { Player } from '../types';
import { EMOJIS } from '../constants';
import { Settings as SettingsIcon, Play, Plus, Trash2, Music } from 'lucide-react';

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

  const handleStart = () => {
    if (audioFiles.length === 0) {
      setError('Bitte wähle zuerst Musik aus!');
      return;
    }
    onStart(audioFiles);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600 text-center flex-1">
            Der verrückte Stopptanz
          </h1>
          <button 
            onClick={onOpenSettings}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            title="Einstellungen"
          >
            <SettingsIcon size={28} className="text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-xl animate-fade-in">
            <p className="font-bold">Hoppla!</p>
            <p>{error}</p>
          </div>
        )}

        <div className="mb-8 bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Music className="text-blue-500" /> 1. Musik auswählen
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
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-sm"
          >
            {audioFiles.length > 0 ? `${audioFiles.length} Lieder ausgewählt` : 'Musikordner wählen'}
          </button>
        </div>

        <div className="mb-8 bg-pink-50 p-6 rounded-2xl border-2 border-pink-200">
          <h2 className="text-xl font-bold text-pink-800 mb-4">2. Mitspieler ({players.length}/10)</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Name des Kindes" 
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none text-lg"
            />
            <button 
              onClick={handleAddPlayer}
              disabled={players.length >= 10 || !newPlayerName.trim()}
              className="bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={24} /> Hinzufügen
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-pink-700 mb-2">Wähle ein Tierchen:</p>
            <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-3xl p-2 rounded-xl transition-all ${selectedEmoji === emoji ? 'bg-pink-200 scale-110 shadow-md ring-2 ring-pink-400' : 'hover:bg-pink-100'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {players.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {players.map(player => (
                <div key={player.id} className="bg-white px-4 py-2 rounded-full shadow-sm border border-pink-100 flex items-center gap-2 animate-fade-in">
                  <span className="text-2xl">{player.avatar}</span>
                  <span className="font-bold text-gray-700">{player.name}</span>
                  <button onClick={() => handleRemovePlayer(player.id)} className="text-red-400 hover:text-red-600 ml-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={handleStart}
          className="w-full bg-green-400 hover:bg-green-500 text-white font-black py-6 rounded-2xl text-3xl transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-4 animate-bounce-slow"
        >
          <Play fill="currentColor" size={36} /> LOS GEHT'S!
        </button>
      </div>
    </div>
  );
}
