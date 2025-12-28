import { PlantCategory } from '@/components/ui/PlantsSelector';

export const plantCategories: PlantCategory[] = [
  {
    region: 'Grains & Cereals',
    crops: [
      { id: 'wheat', name: 'Wheat', icon: '🌾' },
      { id: 'rice', name: 'Rice', icon: '🍚' },
      { id: 'corn', name: 'Corn', icon: '🌽' },
      { id: 'barley', name: 'Barley', icon: '🌾' },
      { id: 'sorghum', name: 'Sorghum', icon: '🌾' },
    ]
  },
  {
    region: 'Vegetables',
    crops: [
      { id: 'tomato', name: 'Tomato', icon: '🍅' },
      { id: 'potato', name: 'Potato', icon: '🥔' },
      { id: 'onion', name: 'Onion', icon: '🧅' },
      { id: 'chili', name: 'Chili', icon: '🌶️' },
      { id: 'cabbage', name: 'Cabbage', icon: '🥬' },
    ]
  },
  {
    region: 'Fruits',
    crops: [
      { id: 'mango', name: 'Mango', icon: '🥭' },
      { id: 'banana', name: 'Banana', icon: '🍌' },
      { id: 'apple', name: 'Apple', icon: '🍎' },
      { id: 'orange', name: 'Orange', icon: '🍊' },
      { id: 'grapes', name: 'Grapes', icon: '🍇' },
    ]
  },
  {
    region: 'Cash Crops',
    crops: [
      { id: 'cotton', name: 'Cotton', icon: '🧵' },
      { id: 'sugarcane', name: 'Sugarcane', icon: '🎍' },
      { id: 'coffee', name: 'Coffee', icon: '☕' },
      { id: 'tea', name: 'Tea', icon: '🫖' },
      { id: 'tobacco', name: 'Tobacco', icon: '🍂' },
    ]
  },
  {
    region: 'Others',
    crops: [
      { id: 'soybean', name: 'Soybean', icon: '🫘' },
      { id: 'sunflower', name: 'Sunflower', icon: '🌻' },
      { id: 'pulses', name: 'Pulses', icon: '🫘' },
      { id: 'oilseeds', name: 'Oilseeds', icon: '🫒' },
    ]
  }
];