import { cropFertilizerData, FertilizerData } from './cropFertilizerData';

type AreaUnit = 'hectare' | 'acre';

type FertilizerResult = {
  cropName: string;
  area: number;
  areaUnit: AreaUnit;
  totalN: number; // kg
  totalP: number; // kg
  totalK: number; // kg
  fertilizers: {
    urea: number; // kg
    dap: number;  // kg
    sop: number;  // kg
  };
};

const FERTILIZER_CONSTANTS = {
  ureaN: 0.46,   // 46% N
  dapN: 0.18,    // 18% N
  dapP: 0.46,    // 46% P
  sopK: 0.50,    // 50% K
};

export function calculateFertilizer(
  cropId: string,
  area: number,
  areaUnit: AreaUnit = 'hectare'
): FertilizerResult | null {
  const crop: FertilizerData | undefined = cropFertilizerData.find(c => c.id === cropId);
  if (!crop) return null;

  // --- Step 1: Convert area to hectare if needed
  let areaInHectare = area;
  if (areaUnit === 'acre') {
    areaInHectare = area * 0.4047;
  }

  // --- Step 2: Total nutrients
  const totalN = crop.npk.nitrogen * areaInHectare;
  const totalP = crop.npk.phosphorus * areaInHectare;
  const totalK = crop.npk.potassium * areaInHectare;

  // --- Step 3: Fertilizer calculations
  // Step 3a: Use DAP for P first
  const dapRequired = totalP / FERTILIZER_CONSTANTS.dapP;
  const nitrogenFromDAP = dapRequired * FERTILIZER_CONSTANTS.dapN;

  // Step 3b: Remaining N to be supplied by Urea
  const remainingN = totalN - nitrogenFromDAP;
  const ureaRequired = remainingN / FERTILIZER_CONSTANTS.ureaN;

  // Step 3c: K via SOP
  const sopRequired = totalK / FERTILIZER_CONSTANTS.sopK;

  return {
    cropName: crop.name,
    area,
    areaUnit,
    totalN,
    totalP,
    totalK,
    fertilizers: {
      urea: Math.round(ureaRequired),
      dap: Math.round(dapRequired),
      sop: Math.round(sopRequired),
    },
  };
}