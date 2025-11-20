
import { Discipline, Area, Routine, Step, Product } from './types';

// Helper to generate 9 steps
const generateSteps = (routineId: string): Step[] => 
  Array.from({ length: 9 }, (_, i) => ({
    id: `${routineId}-step-${i+1}`,
    title: `Step ${i+1}`,
    duration: '2 min',
    description: `Focus on breath and alignment in phase ${i+1}.`
  }));

// Helper to generate 9 routines
const generateRoutines = (areaId: string): Routine[] => 
  Array.from({ length: 9 }, (_, i) => ({
    id: `${areaId}-routine-${i+1}`,
    title: `Sequence ${i+1}`,
    difficulty: i < 3 ? 'Beginner' : i < 6 ? 'Intermediate' : 'Advanced',
    steps: generateSteps(`${areaId}-routine-${i+1}`)
  }));

// Helper to generate 5 areas
const generateAreas = (disciplineId: string, titles: string[]): Area[] => 
  titles.map((title, i) => ({
    id: `${disciplineId}-area-${i+1}`,
    title: title,
    routines: generateRoutines(`${disciplineId}-area-${i+1}`)
  }));

export const DISCIPLINES: Discipline[] = [
  {
    id: 'd1',
    title: 'Yoga',
    description: 'Union of breath, movement, and spiritual alignment.',
    image: 'https://cdn.pixabay.com/photo/2017/03/26/21/54/yoga-2176668_1280.jpg',
    areas: generateAreas('d1', ['Foundation Hatha', 'Vinyasa Flow', 'Power Structure', 'Restorative Yin', 'Kundalini Awakening'])
  },
  {
    id: 'd2',
    title: 'Body Weight',
    description: 'Mastery of self through gravity and leverage (Calisthenics).',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/15/40/calisthenics-1835622_1280.jpg',
    areas: generateAreas('d2', ['Static Holds', 'Dynamic Push', 'Vertical Pull', 'Explosive Power', 'Fluid Transitions'])
  },
  {
    id: 'd3',
    title: 'Meditation',
    description: 'Cognitive stillness and internal observation.',
    image: 'https://cdn.pixabay.com/photo/2016/11/21/16/55/adult-1846388_1280.jpg',
    areas: generateAreas('d3', ['Breath Awareness', 'Visual Focus', 'Body Scanning', 'Transcendence', 'Stoic Reflection'])
  },
  {
    id: 'd4',
    title: 'Truth Tables',
    description: 'Boolean logic, formal reasoning, and cognitive structuring.',
    image: 'https://cdn.pixabay.com/photo/2018/05/08/08/44/artificial-intelligence-3382507_1280.jpg',
    areas: generateAreas('d4', ['Binary Fundamentals', 'Conjunction & Disjunction', 'Conditional Logic', 'Equivalence Chains', 'Symbolic Architecture'])
  },
  {
    id: 'd5',
    title: 'Wisdom',
    description: 'Philosophical frameworks for decision making and resilience.',
    image: 'https://cdn.pixabay.com/photo/2020/04/19/12/26/bust-5063783_1280.jpg',
    areas: generateAreas('d5', ['Stoic Resilience', 'Socratic Method', 'Ethical Frameworks', 'Cognitive Bias', 'Metaphysical Inquiry'])
  },
  {
    id: 'd6',
    title: 'Velocity',
    description: 'High-intensity interval training for explosive speed.',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/12/49/man-1834091_1280.jpg',
    areas: generateAreas('d6', ['Ignite', 'Accelerate', 'Sustain', 'Peak', 'Cool'])
  },
  {
    id: 'd7',
    title: 'Intimacy',
    description: 'Transcending the physical body to achieve spiritual and emotional union.',
    image: 'https://cdn.pixabay.com/photo/2016/11/21/15/38/beach-1846009_1280.jpg',
    areas: generateAreas('d7', ['Partner Synchronization', 'Tantric Breath', 'Emotional Transmutation', 'The Divine Union', 'Sensory Integration'])
  },
  {
    id: 'd8',
    title: 'Hydro Dynamics',
    description: 'Swimming and water-based resistance.',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/13/02/swimming-1834275_1280.jpg',
    areas: generateAreas('d8', ['Buoyancy', 'Stroke', 'Breath', 'Force', 'Glide'])
  },
  {
    id: 'd9',
    title: 'Terra Trek',
    description: 'Hiking and uneven terrain adaptability.',
    image: 'https://cdn.pixabay.com/photo/2020/09/06/19/21/hiking-5549570_1280.jpg',
    areas: generateAreas('d9', ['Ascent', 'Descent', 'Endurance', 'Agility', 'Summit'])
  },
  {
    id: 'd10',
    title: 'Chromatics',
    description: 'Visual hypnosis and quantum pattern recognition for deep healing.',
    image: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg',
    areas: generateAreas('d10', ['Quantum Patterns', 'Visual Hypnosis', 'Circadian Reset', 'Light Spectrum Therapy', 'Synesthetic Focus'])
  },
  {
    id: 'd11',
    title: 'Combat',
    description: 'Tactical defense, striking mechanics, and controlled aggression.',
    image: 'https://cdn.pixabay.com/photo/2017/04/27/08/29/man-2264825_1280.jpg',
    areas: generateAreas('d11', ['Stance & Guard', 'Kinetic Striking', 'Evasion Mechanics', 'Grappling Fundamentals', 'Sparring Logic'])
  },
  {
    id: 'd12',
    title: 'Resonance',
    description: 'Cellular repair through sonic frequency, vibration, and tone.',
    image: 'https://cdn.pixabay.com/photo/2021/02/06/14/29/music-5987848_1280.jpg',
    areas: generateAreas('d12', ['Binaural Alignment', 'Solfeggio Frequencies', 'Sonic Immersion', 'Vocal Toning', 'Vibrational Repair'])
  }
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'DG Tech Hat', price: 45, category: 'Accessories', image: 'https://cdn.pixabay.com/photo/2017/05/23/10/53/marketing-2336151_1280.jpg' },
  { id: 'p2', name: 'Performance Gloves', price: 60, category: 'Gear', image: 'https://cdn.pixabay.com/photo/2015/12/14/20/34/gloves-1092826_1280.jpg' },
  { id: 'p3', name: 'Studio Tee', price: 55, category: 'Apparel', image: 'https://cdn.pixabay.com/photo/2016/11/23/06/57/isolated-t-shirt-1852114_1280.png' },
  { id: 'p4', name: 'Compression Pants', price: 95, category: 'Apparel', image: 'https://cdn.pixabay.com/photo/2016/11/18/21/27/woman-1836889_1280.jpg' },
  { id: 'p5', name: 'Recovery Hoodie', price: 110, category: 'Apparel', image: 'https://cdn.pixabay.com/photo/2017/08/02/00/49/people-2568954_1280.jpg' },
  { id: 'p6', name: 'Smart Mat', price: 150, category: 'Gear', image: 'https://cdn.pixabay.com/photo/2017/03/26/21/54/yoga-2176668_1280.jpg' },
  { id: 'p7', name: 'DeepGetty Physical Journal', price: 35, category: 'Accessories', image: 'https://cdn.pixabay.com/photo/2015/01/09/11/11/office-594132_1280.jpg' },
];

// Video Options - Curated for "Deep/Dark/Intense/Sweat" Aesthetic
export const HERO_VIDEO_OPTIONS = [
  { label: 'Battle Ropes (Intense)', url: 'https://cdn.pixabay.com/video/2017/06/16/9726-221980532_large.mp4' },
  { label: 'Shadow Boxing (Dark)', url: 'https://cdn.pixabay.com/video/2019/04/24/23011-332483109_large.mp4' },
  { label: 'Night Run (Urban)', url: 'https://cdn.pixabay.com/video/2024/05/29/214258_large.mp4' },
  { label: 'Weight Training (Shadow)', url: 'https://cdn.pixabay.com/video/2016/05/01/3023-165192769_large.mp4' },
  { label: 'Climbing (Outdoors)', url: 'https://cdn.pixabay.com/video/2020/08/05/46459-449565338_large.mp4' }, 
  { label: 'Yoga / Dance (Flow)', url: 'https://cdn.pixabay.com/video/2021/01/18/62247-502385849_large.mp4' },
  { label: 'Swimming (Hydro)', url: 'https://cdn.pixabay.com/video/2015/10/23/1106-143526520_large.mp4' }
];

// Defaulting to "Battle Ropes/Intense" for that immediate grit - High Performance Pixabay Link
export const DEFAULT_HERO_VIDEO_URL = 'https://cdn.pixabay.com/video/2017/06/16/9726-221980532_large.mp4';
export const BACKUP_VIDEO_URL = HERO_VIDEO_OPTIONS[1].url;
