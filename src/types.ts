export interface Player {
  id: string;
  name: string;
  avatar: string;
}

export interface Settings {
  minMusicTime: number;
  maxMusicTime: number;
  minPauseTime: number;
  maxPauseTime: number;
}

export interface Pose {
  text: string;
  emoji: string;
}
