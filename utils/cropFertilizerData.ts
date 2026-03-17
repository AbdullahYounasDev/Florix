export type FertilizerData = {
  id: string;
  name: string;
  npk: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
};

export const cropFertilizerData: FertilizerData[] = [
  // --- Grains & Cereals ---
  { id: "wheat", name: "Wheat", npk: { nitrogen: 120, phosphorus: 60, potassium: 40 } },
  { id: "rice", name: "Rice", npk: { nitrogen: 100, phosphorus: 50, potassium: 50 } },
  { id: "corn", name: "Corn", npk: { nitrogen: 150, phosphorus: 80, potassium: 60 } },
  { id: "barley", name: "Barley", npk: { nitrogen: 90, phosphorus: 45, potassium: 35 } },
  { id: "sorghum", name: "Sorghum", npk: { nitrogen: 100, phosphorus: 50, potassium: 50 } },
  { id: "millet", name: "Millet", npk: { nitrogen: 80, phosphorus: 40, potassium: 30 } },
  { id: "oats", name: "Oats", npk: { nitrogen: 90, phosphorus: 45, potassium: 35 } },
  { id: "rye", name: "Rye", npk: { nitrogen: 85, phosphorus: 40, potassium: 30 } },

  // --- Vegetables ---
  { id: "tomato", name: "Tomato", npk: { nitrogen: 140, phosphorus: 70, potassium: 60 } },
  { id: "potato", name: "Potato", npk: { nitrogen: 160, phosphorus: 80, potassium: 100 } },
  { id: "onion", name: "Onion", npk: { nitrogen: 120, phosphorus: 60, potassium: 80 } },
  { id: "chili", name: "Chili", npk: { nitrogen: 120, phosphorus: 60, potassium: 70 } },
  { id: "cabbage", name: "Cabbage", npk: { nitrogen: 100, phosphorus: 50, potassium: 70 } },
  { id: "carrot", name: "Carrot", npk: { nitrogen: 90, phosphorus: 50, potassium: 80 } },
  { id: "eggplant", name: "Eggplant", npk: { nitrogen: 100, phosphorus: 50, potassium: 70 } },
  { id: "broccoli", name: "Broccoli", npk: { nitrogen: 90, phosphorus: 50, potassium: 60 } },
  { id: "spinach", name: "Spinach", npk: { nitrogen: 80, phosphorus: 40, potassium: 60 } },
  { id: "lettuce", name: "Lettuce", npk: { nitrogen: 70, phosphorus: 35, potassium: 50 } },

  // --- Fruits ---
  { id: "mango", name: "Mango", npk: { nitrogen: 200, phosphorus: 100, potassium: 150 } },
  { id: "banana", name: "Banana", npk: { nitrogen: 250, phosphorus: 120, potassium: 200 } },
  { id: "apple", name: "Apple", npk: { nitrogen: 180, phosphorus: 90, potassium: 150 } },
  { id: "orange", name: "Orange", npk: { nitrogen: 160, phosphorus: 80, potassium: 120 } },
  { id: "grapes", name: "Grapes", npk: { nitrogen: 140, phosphorus: 70, potassium: 90 } },

  // --- Cash Crops ---
  { id: "cotton", name: "Cotton", npk: { nitrogen: 130, phosphorus: 60, potassium: 60 } },
  { id: "sugarcane", name: "Sugarcane", npk: { nitrogen: 250, phosphorus: 100, potassium: 120 } },
  { id: "coffee", name: "Coffee", npk: { nitrogen: 180, phosphorus: 80, potassium: 160 } },
  { id: "tea", name: "Tea", npk: { nitrogen: 150, phosphorus: 70, potassium: 140 } },

  // --- Pulses & Legumes ---
  { id: "lentil", name: "Lentil", npk: { nitrogen: 30, phosphorus: 25, potassium: 20 } },
  { id: "chickpea", name: "Chickpea", npk: { nitrogen: 35, phosphorus: 30, potassium: 25 } },
  { id: "mungbean", name: "Mung Bean", npk: { nitrogen: 40, phosphorus: 30, potassium: 25 } },
  { id: "soybean", name: "Soybean", npk: { nitrogen: 50, phosphorus: 40, potassium: 35 } },

  // --- Oilseed Crops ---
  { id: "sunflower", name: "Sunflower", npk: { nitrogen: 120, phosphorus: 60, potassium: 70 } },
  { id: "mustard", name: "Mustard", npk: { nitrogen: 100, phosphorus: 50, potassium: 50 } },
  { id: "groundnut", name: "Groundnut", npk: { nitrogen: 80, phosphorus: 40, potassium: 60 } },

  // --- Spices & Herbs ---
  { id: "ginger", name: "Ginger", npk: { nitrogen: 150, phosphorus: 60, potassium: 80 } },
  { id: "turmeric", name: "Turmeric", npk: { nitrogen: 140, phosphorus: 60, potassium: 70 } },
  { id: "mint", name: "Mint", npk: { nitrogen: 100, phosphorus: 50, potassium: 50 } },
];