import React, { useState } from 'react';
import { Settings } from '../types';
import { X } from 'lucide-react';

interface Props {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, onSave, onClose }: Props) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleChange = (key: keyof Settings, value: number) => {
    let newSettings = { ...localSettings, [key]: value };

    // Validation: Min <= Max
    if (key === 'minMusicTime' && value > newSettings.maxMusicTime) {
      newSettings.maxMusicTime = value;
    }
    if (key === 'maxMusicTime' && value < newSettings.minMusicTime) {
      newSettings.minMusicTime = value;
    }
    if (key === 'minPauseTime' && value > newSettings.maxPauseTime) {
      newSettings.maxPauseTime = value;
    }
    if (key === 'maxPauseTime' && value < newSettings.minPauseTime) {
      newSettings.minPauseTime = value;
    }

    setLocalSettings(newSettings);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Einstellungen</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Musikdauer: {localSettings.minMusicTime}s - {localSettings.maxMusicTime}s
            </label>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-500 w-8">Min</span>
              <input 
                type="range" 
                min="5" max="45" 
                value={localSettings.minMusicTime}
                onChange={(e) => handleChange('minMusicTime', parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
            <div className="flex gap-4 items-center mt-2">
              <span className="text-xs text-gray-500 w-8">Max</span>
              <input 
                type="range" 
                min="5" max="45" 
                value={localSettings.maxMusicTime}
                onChange={(e) => handleChange('maxMusicTime', parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pausendauer: {localSettings.minPauseTime}s - {localSettings.maxPauseTime}s
            </label>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-500 w-8">Min</span>
              <input 
                type="range" 
                min="3" max="10" 
                value={localSettings.minPauseTime}
                onChange={(e) => handleChange('minPauseTime', parseInt(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>
            <div className="flex gap-4 items-center mt-2">
              <span className="text-xs text-gray-500 w-8">Max</span>
              <input 
                type="range" 
                min="3" max="10" 
                value={localSettings.maxPauseTime}
                onChange={(e) => handleChange('maxPauseTime', parseInt(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onSave(localSettings)}
          className="mt-8 w-full bg-green-400 hover:bg-green-500 text-white font-bold py-4 rounded-2xl text-xl transition-transform active:scale-95 shadow-md"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}
