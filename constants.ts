import { Upgrade } from './types';

export const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: 'mewing_streak',
    name: 'Mewing Streak',
    basePrice: 15,
    baseRevenue: 1,
    count: 0,
    icon: '🤫',
    description: 'Sharpen that jawline (+1 APS)'
  },
  {
    id: 'subway_surfers',
    name: 'Subway Gameplay',
    basePrice: 100,
    baseRevenue: 8,
    count: 0,
    icon: '🏃',
    description: 'Keeps attention span high (+8 APS)'
  },
  {
    id: 'grimace_shake',
    name: 'Grimace Shake',
    basePrice: 500,
    baseRevenue: 32,
    count: 0,
    icon: '🥤',
    description: 'Happy Birthday Grimace (+32 APS)'
  },
  {
    id: 'fanum_tax',
    name: 'Fanum Tax Collector',
    basePrice: 2000,
    baseRevenue: 150,
    count: 0,
    icon: '🍟',
    description: 'Yoink a bite (+150 APS)'
  },
  {
    id: 'skibidi_toilet',
    name: 'Skibidi Toilet',
    basePrice: 10000,
    baseRevenue: 600,
    count: 0,
    icon: '🚽',
    description: 'Brrr Skibidi Dop Dop (+600 APS)'
  },
  {
    id: 'ohio_final_boss',
    name: 'Ohio Final Boss',
    basePrice: 50000,
    baseRevenue: 2500,
    count: 0,
    icon: '👹',
    description: 'Made in Ohio (+2.5k APS)'
  },
  {
    id: 'gigachad_factory',
    name: 'GigaChad Factory',
    basePrice: 250000,
    baseRevenue: 10000,
    count: 0,
    icon: '🗿',
    description: 'Average enjoyer (+10k APS)'
  }
];

export const SLANG_WORDS = [
  "SKIBIDI", "GYATT", "RIZZ", "OHIO", "SIGMA", "L", "W", "CAP", "BUSSSIN", "SHEESH", "BET", "FR", "ONG", "GRIMACE", "FANUM", "TAX", "MOGGING", "MEWING"
];

export const COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'
];