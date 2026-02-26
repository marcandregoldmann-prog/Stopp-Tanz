import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { X } from 'lucide-react';

interface Props {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, onSave, onClose }: Props) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  // Effect to update local state if props change (though typically modal is unmounted)
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: keyof Settings, value: number) => {
    let newSettings = { ...localSettings, [key]: value };

    // Validation Logic: Push values to prevent invalid ranges

    // Dance Time (5 - 45s)
    if (key === 'minMusicTime') {
      if (value > newSettings.maxMusicTime) {
        newSettings.maxMusicTime = value;
      }
    }
    if (key === 'maxMusicTime') {
      if (value < newSettings.minMusicTime) {
        newSettings.minMusicTime = value;
      }
    }

    // Freeze Time (3 - 10s)
    if (key === 'minPauseTime') {
      if (value > newSettings.maxPauseTime) {
        newSettings.maxPauseTime = value;
      }
    }
    if (key === 'maxPauseTime') {
      if (value < newSettings.minPauseTime) {
        newSettings.minPauseTime = value;
      }
    }

    setLocalSettings(newSettings);
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Modal Container: Cloud/Card style */}
      <div className="bg-white/95 rounded-[2rem] shadow-2xl p-6 max-w-md w-full mx-4 relative overflow-hidden flex flex-col gap-6 animate-pop-in">

        {/* Close Icon (Optional, since we have the big button at the bottom, but good for UX) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100/50 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Schließen"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 font-fredoka mt-2">
          Einstellungen
        </h2>

        {/* Section 1: Dance Time 💃🕺 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-orange-500 font-fredoka">
              Wie lange wird getanzt? 💃
            </h3>
          </div>

          {/* Min Dance Slider */}
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-orange-700">Minimum</span>
              <span className="text-lg font-bold text-orange-600 font-fredoka">{localSettings.minMusicTime}s</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={localSettings.minMusicTime}
              onChange={(e) => handleChange('minMusicTime', parseInt(e.target.value))}
              className="w-full h-3 bg-orange-200 rounded-full appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600 transition-all"
            />
          </div>

          {/* Max Dance Slider */}
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-orange-700">Maximum</span>
              <span className="text-lg font-bold text-orange-600 font-fredoka">{localSettings.maxMusicTime}s</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={localSettings.maxMusicTime}
              onChange={(e) => handleChange('maxMusicTime', parseInt(e.target.value))}
              className="w-full h-3 bg-orange-200 rounded-full appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600 transition-all"
            />
          </div>

          <p className="text-sm text-center text-gray-600 italic px-2">
            Die Musik spielt zufällig zwischen <strong className="text-orange-600">{localSettings.minMusicTime}</strong> und <strong className="text-orange-600">{localSettings.maxMusicTime}</strong> Sekunden.
          </p>
        </div>

        {/* Section 2: Freeze Time 🧊⛄ */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-1 mt-2">
            <h3 className="text-xl font-bold text-cyan-600 font-fredoka">
              Wie lange frieren wir ein? 🧊
            </h3>
          </div>

          {/* Min Freeze Slider */}
          <div className="bg-cyan-50 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-cyan-700">Minimum</span>
              <span className="text-lg font-bold text-cyan-600 font-fredoka">{localSettings.minPauseTime}s</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              value={localSettings.minPauseTime}
              onChange={(e) => handleChange('minPauseTime', parseInt(e.target.value))}
              className="w-full h-3 bg-cyan-200 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-600 transition-all"
            />
          </div>

          {/* Max Freeze Slider */}
          <div className="bg-cyan-50 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-cyan-700">Maximum</span>
              <span className="text-lg font-bold text-cyan-600 font-fredoka">{localSettings.maxPauseTime}s</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              value={localSettings.maxPauseTime}
              onChange={(e) => handleChange('maxPauseTime', parseInt(e.target.value))}
              className="w-full h-3 bg-cyan-200 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-600 transition-all"
            />
          </div>

          <p className="text-sm text-center text-gray-600 italic px-2">
            Wir frieren zufällig zwischen <strong className="text-cyan-600">{localSettings.minPauseTime}</strong> und <strong className="text-cyan-600">{localSettings.maxPauseTime}</strong> Sekunden ein.
          </p>
        </div>

        {/* Save & Close Button */}
        <div className="mt-4">
          <button
            onClick={handleSave}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold font-fredoka py-4 rounded-full shadow-lg transform transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            Speichern & Schließen
          </button>
        </div>

      </div>
    </div>
  );
}
