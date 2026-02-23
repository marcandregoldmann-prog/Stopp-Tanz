import { Pose } from './types';

export const EMOJIS = [
  '🦁', '🐸', '🦄', '🚀', '🐵', '🦖', '🐝', '🐙', '🦋', '🐢', '🎈', '🌟', '🍕', '🚜', '👻'
];

export const POSES: Pose[] = [
  { text: "Steh auf einem Bein wie ein Flamingo!", emoji: "🦩" },
  { text: "Mach dich ganz klein wie eine Maus!", emoji: "🐭" },
  { text: "Strecke dich so hoch du kannst wie eine Giraffe!", emoji: "🦒" },
  { text: "Friere ein wie ein Schneemann!", emoji: "⛄" },
  { text: "Zeig deine Muskeln wie ein Bär!", emoji: "🐻" },
  { text: "Steh ganz still wie ein Baum!", emoji: "🌳" },
  { text: "Mach ein richtig lustiges Gesicht!", emoji: "🤪" },
  { text: "Halte dir schnell die Augen zu!", emoji: "🙈" },
  { text: "Hände ganz weit hoch in die Luft!", emoji: "🙌" },
  { text: "Steh auf den Zehenspitzen!", emoji: "🩰" },
  { text: "Hocke dich hin wie ein Frosch!", emoji: "🐸" },
  { text: "Verschränke die Arme wie ein grimmiger Pirat!", emoji: "🏴‍☠️" },
  { text: "Wackle mit dem Po und friere ein!", emoji: "💃" },
  { text: "Streck die Zunge raus und beweg dich nicht!", emoji: "😛" },
  { text: "Schlaf im Stehen ein!", emoji: "😴" }
];

export const DEFAULT_SETTINGS = {
  minMusicTime: 15,
  maxMusicTime: 30,
  minPauseTime: 5,
  maxPauseTime: 8,
};
