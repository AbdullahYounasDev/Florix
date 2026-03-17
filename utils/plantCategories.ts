import { PlantCategory } from '@/components/ui/PlantsSelector';

export const plantCategories: PlantCategory[] = [
  {
    region: 'Grains & Cereals',
    crops: [
      { id: 'wheat', name: 'Wheat', icon: '🌾' },
      { id: 'rice', name: 'Rice', icon: '🍚' },
      { id: 'corn', name: 'Corn', icon: '🌽' },
      { id: 'barley', name: 'Barley', icon: '🌾' },
      { id: 'sorghum', name: 'Sorghum', icon: '🌿' },
      { id: 'millet', name: 'Millet', icon: '🌾' },
      { id: 'oats', name: 'Oats', icon: '🥣' },
      { id: 'rye', name: 'Rye', icon: '🌾' },
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
      { id: 'carrot', name: 'Carrot', icon: '🥕' },
      { id: 'eggplant', name: 'Eggplant', icon: '🍆' },
      { id: 'broccoli', name: 'Broccoli', icon: '🥦' },
      { id: 'spinach', name: 'Spinach', icon: '🍃' },
      { id: 'lettuce', name: 'Lettuce', icon: '🥗' },
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
      { id: 'cotton', name: 'Cotton', icon: '☁️' },
      { id: 'sugarcane', name: 'Sugarcane', icon: '🎋' },
      { id: 'coffee', name: 'Coffee', icon: '☕' },
      { id: 'tea', name: 'Tea', icon: '🍵' },
    ]
  },
  {
    region: 'Pulses & Legumes',
    crops: [
      { id: 'lentil', name: 'Lentil', icon: '🫘' },
      { id: 'chickpea', name: 'Chickpea', icon: '🧆' },
      { id: 'mungbean', name: 'Mung Bean', icon: '🫛' },
      { id: 'soybean', name: 'Soybean', icon: '🫘' },
    ]
  },
  {
    region: 'Oilseed Crops',
    crops: [
      { id: 'sunflower', name: 'Sunflower', icon: '🌻' },
      { id: 'mustard', name: 'Mustard', icon: '🌼' },
      { id: 'groundnut', name: 'Groundnut', icon: '🥜' },
    ]
  },
  {
    region: 'Spices & Herbs',
    crops: [
      { id: 'ginger', name: 'Ginger', icon: '🫚' },
      { id: 'turmeric', name: 'Turmeric', icon: '🟡' },
      { id: 'mint', name: 'Mint', icon: '🌱' },
    ]
  }
];