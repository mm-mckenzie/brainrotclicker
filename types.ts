export interface Upgrade {
  id: string;
  name: string;
  basePrice: number;
  baseRevenue: number; // Aura per second
  count: number;
  icon: string;
  description: string;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export interface BonusPopup {
  id: number;
  x: number;
  y: number;
  type: 'GOLDEN_SKIBIDI' | 'MYSTERY_BOX';
  expiresAt: number;
}

export interface GameState {
  aura: number;
  lifetimeAura: number;
  auraPerSecond: number;
  clickPower: number;
  startTime: number;
}

export enum SoundType {
  CLICK = 'CLICK',
  BUY = 'BUY',
  LEVEL_UP = 'LEVEL_UP'
}