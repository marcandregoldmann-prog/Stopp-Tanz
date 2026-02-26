import { Pose } from './types';

export const EMOJIS = [
  '🦁', '🐸', '🦄', '🚀', '🐵', '🦖', '🐝', '🐙', '🦋', '🐢', '🎈', '🌟', '🍕', '🚜', '👻'
];

export const POSES: Pose[] = [
  { text: "Steh auf einem Bein wie ein Flamingo!", emoji: "🦩", audioFile: "/voices/Flamingo.wav" },
  { text: "Mach dich ganz klein wie eine Maus!", emoji: "🐭", audioFile: "/voices/Maus.wav" },
  { text: "Strecke dich so hoch du kannst wie eine Giraffe!", emoji: "🦒", audioFile: "/voices/Giraffe.wav" },
  { text: "Friere ein wie ein Schneemann!", emoji: "⛄", audioFile: "/voices/Schneemann.wav" },
  { text: "Zeig deine Muskeln wie ein Bär!", emoji: "🐻", audioFile: "/voices/Baer.wav" },
  { text: "Steh ganz still wie ein Baum!", emoji: "🌳", audioFile: "/voices/Baum.wav" },
  { text: "Mach ein richtig lustiges Gesicht!", emoji: "🤪", audioFile: "/voices/LustigesGesicht.wav" },
  { text: "Halte dir schnell die Augen zu!", emoji: "🙈", audioFile: "/voices/AugenZu.wav" },
  { text: "Hände ganz weit hoch in die Luft!", emoji: "🙌", audioFile: "/voices/HaendeHoch.wav" },
  { text: "Steh auf den Zehenspitzen!", emoji: "🩰", audioFile: "/voices/Zehenspitzen.wav" },
  { text: "Hocke dich hin wie ein Frosch!", emoji: "🐸", audioFile: "/voices/Frosch.wav" },
  { text: "Verschränke die Arme wie ein grimmiger Pirat!", emoji: "🏴‍☠️", audioFile: "/voices/Pirat.wav" },
  { text: "Wackle mit dem Po und friere ein!", emoji: "💃", audioFile: "/voices/Po wackeln.wav" },
  { text: "Streck die Zunge raus und beweg dich nicht!", emoji: "😛", audioFile: "/voices/Zungeraus.wav" },
  { text: "Schlaf im Stehen ein!", emoji: "😴", audioFile: "/voices/StehSchlafen.wav" }
];

export const DEFAULT_SETTINGS = {
  minMusicTime: 15,
  maxMusicTime: 30,
  minPauseTime: 5,
  maxPauseTime: 8,
};
