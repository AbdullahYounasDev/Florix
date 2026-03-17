// components/PestsAndDisease.tsx
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { cropFertilizerData } from '@/utils/cropFertilizerData';
import { plantCategories } from '@/utils/plantCategories';
import { theme } from '@/utils/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

interface PestCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
}

interface Treatment {
  type: 'chemical' | 'organic' | 'preventive';
  label: string;
  detail: string;
}

interface PestEntry {
  name: string;
  severity: 'low' | 'medium' | 'high';
  symptoms: string;
  treatments: Treatment[];
}

interface PestResult {
  category: string;
  crop: string;
  overview: string;
  pests: PestEntry[];
  generalTip: string;
  warning?: string;
}

interface Props {
  onClose?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG = {
  low: { label: 'Low Risk', color: '#388E3C', bg: '#E8F5E9' },
  medium: { label: 'Moderate', color: '#F57C00', bg: '#FFF3E0' },
  high: { label: 'High Risk', color: '#D32F2F', bg: '#FFEBEE' },
};

const PEST_CATEGORIES: PestCategory[] = [
  {
    id: 'insects',
    label: 'Insect Pests',
    icon: 'bug',
    color: '#6D4C41',
    bg: '#EFEBE9',
    description: 'Aphids, borers & flies',
  },
  {
    id: 'fungal',
    label: 'Fungal Diseases',
    icon: 'mushroom',
    color: '#7B1FA2',
    bg: '#F3E5F5',
    description: 'Blight, mildew & rust',
  },
  {
    id: 'bacterial',
    label: 'Bacterial',
    icon: 'bacteria',
    color: '#D32F2F',
    bg: '#FFEBEE',
    description: 'Wilt, rot & canker',
  },
  {
    id: 'viral',
    label: 'Viral Diseases',
    icon: 'virus',
    color: '#1976D2',
    bg: '#E3F2FD',
    description: 'Mosaic & yellowing',
  },
  {
    id: 'weeds',
    label: 'Weed Control',
    icon: 'grass',
    color: '#388E3C',
    bg: '#E8F5E9',
    description: 'Broadleaf & grassy weeds',
  },
  {
    id: 'nematodes',
    label: 'Nematodes',
    icon: 'dna',
    color: '#F57C00',
    bg: '#FFF3E0',
    description: 'Root-knot & cyst',
  },
];

// ─── Dummy API ─────────────────────────────────────────────────────────────────

const fetchPestData = async (
  cropName: string,
  categoryId: string
): Promise<PestResult> => {
  await new Promise(res => setTimeout(res, 1400));

  const categoryLabel =
    PEST_CATEGORIES.find(c => c.id === categoryId)?.label ?? categoryId;

  const dummyData: Record<string, PestResult> = {
    insects: {
      category: categoryLabel,
      crop: cropName,
      overview: `${cropName} is commonly attacked by several insect pests throughout its growing cycle. Early identification and timely intervention are key to preventing significant yield losses.`,
      pests: [
        {
          name: 'Aphids',
          severity: 'medium',
          symptoms:
            'Curling and yellowing of young leaves, sticky honeydew deposits, stunted shoot growth and possible sooty mold development.',
          treatments: [
            { type: 'organic', label: 'Neem Oil Spray', detail: 'Mix 5 ml neem oil per litre of water. Spray on undersides of leaves every 7 days.' },
            { type: 'chemical', label: 'Imidacloprid 17.8 SL', detail: 'Apply at 0.3 ml/L water. Avoid spraying during flowering to protect pollinators.' },
            { type: 'preventive', label: 'Yellow Sticky Traps', detail: 'Place 10–12 traps per acre to monitor and reduce aphid population early.' },
          ],
        },
        {
          name: 'Stem Borer',
          severity: 'high',
          symptoms:
            'Dead hearts in young plants, whitish ears in mature crop, small circular holes on stems with frass (sawdust-like excreta) visible.',
          treatments: [
            { type: 'chemical', label: 'Chlorpyrifos 20 EC', detail: 'Apply 2.5 ml/L water at 20–25 days after sowing. Repeat after 15 days if infestation persists.' },
            { type: 'organic', label: 'Trichogramma Release', detail: 'Release Trichogramma chilonis @ 1 lakh/acre/week for 4 consecutive weeks.' },
            { type: 'preventive', label: 'Field Sanitation', detail: 'Destroy crop stubbles immediately after harvest to eliminate overwintering larvae.' },
          ],
        },
        {
          name: 'Whitefly',
          severity: 'medium',
          symptoms:
            'Pale yellow speckling on leaves, white waxy insects visible on leaf undersides, leaves may curl upward and drop prematurely.',
          treatments: [
            { type: 'organic', label: 'Yellow Sticky Cards', detail: 'Install yellow sticky cards at crop canopy level. Replace every 2 weeks.' },
            { type: 'chemical', label: 'Thiamethoxam 25 WG', detail: 'Apply at 0.5 g/L water. Do not apply more than twice per season to prevent resistance.' },
            { type: 'preventive', label: 'Reflective Mulch', detail: 'Use silver/reflective mulch on beds — it repels whiteflies and reduces virus transmission.' },
          ],
        },
      ],
      generalTip: `Scout ${cropName} fields at least twice per week during peak summer months. Pay special attention to the underside of leaves where most insects lay eggs.`,
      warning: 'Never apply systemic insecticides within 21 days of harvest. Always follow label instructions and use PPE during spraying.',
    },

    fungal: {
      category: categoryLabel,
      crop: cropName,
      overview: `Fungal diseases are the leading cause of crop losses in ${cropName}. Warm, humid conditions accelerate fungal spread rapidly. Preventive spraying is always more effective than curative treatment.`,
      pests: [
        {
          name: 'Powdery Mildew',
          severity: 'medium',
          symptoms:
            'White powdery coating on upper leaf surfaces, yellowing and premature leaf drop, reduced photosynthesis and weakened plant vigour.',
          treatments: [
            { type: 'organic', label: 'Sulphur 80 WP', detail: 'Apply wettable sulphur at 2 g/L water. Highly effective; do not apply above 35°C.' },
            { type: 'chemical', label: 'Hexaconazole 5 EC', detail: 'Apply at 1 ml/L water at first sign of disease. Repeat after 10–14 days.' },
            { type: 'preventive', label: 'Improve Air Circulation', detail: 'Maintain proper plant spacing and prune dense canopy to reduce humidity.' },
          ],
        },
        {
          name: 'Late Blight',
          severity: 'high',
          symptoms:
            'Water-soaked lesions on leaves that turn brown-black, white fungal growth on undersides in humid conditions, rapid crop collapse possible.',
          treatments: [
            { type: 'chemical', label: 'Mancozeb 75 WP', detail: 'Apply at 2.5 g/L water as a protective spray every 7 days during high-risk weather.' },
            { type: 'chemical', label: 'Metalaxyl + Mancozeb', detail: 'For systemic control, apply at 2 g/L water when disease is actively progressing.' },
            { type: 'preventive', label: 'Resistant Varieties', detail: 'Select certified blight-resistant varieties suited to your region from the local agri department.' },
          ],
        },
        {
          name: 'Root Rot',
          severity: 'high',
          symptoms:
            'Wilting despite adequate soil moisture, brown-black discoloration of roots and stem base, plant collapse at soil level.',
          treatments: [
            { type: 'organic', label: 'Trichoderma viride', detail: 'Mix 4 g/kg seed as seed treatment OR apply 2.5 kg/acre mixed with compost to soil.' },
            { type: 'chemical', label: 'Carbendazim 50 WP', detail: 'Drench soil at 1 g/L water around root zone at first sign of wilt symptoms.' },
            { type: 'preventive', label: 'Improve Drainage', detail: 'Avoid waterlogging — create raised beds or ridges and improve field drainage channels.' },
          ],
        },
      ],
      generalTip: `Begin preventive fungicide sprays 2–3 weeks after transplanting or during high humidity periods. Alternating fungicide modes of action (MoA) prevents resistance buildup.`,
      warning: 'Fungal spores spread rapidly via wind and water splash. Remove and burn (do not compost) heavily infected plant material immediately.',
    },

    bacterial: {
      category: categoryLabel,
      crop: cropName,
      overview: `Bacterial diseases of ${cropName} are often spread through infected seeds, soil, water splashing, and farm tools. There are no curative treatments — prevention and early action are everything.`,
      pests: [
        {
          name: 'Bacterial Wilt',
          severity: 'high',
          symptoms:
            'Sudden wilting of entire plants without yellowing, water-soaked streaks in stem cross-sections, white bacterial ooze visible when stem is cut and dipped in water.',
          treatments: [
            { type: 'preventive', label: 'Crop Rotation', detail: 'Avoid growing the same crop family in the same field for at least 3 years.' },
            { type: 'organic', label: 'Soil Solarisation', detail: 'Cover moist soil with clear polythene for 4–6 weeks in summer to kill soil bacteria.' },
            { type: 'preventive', label: 'Resistant Varieties', detail: 'Use wilt-resistant certified varieties where bacterial wilt is endemic.' },
          ],
        },
        {
          name: 'Bacterial Leaf Blight',
          severity: 'medium',
          symptoms:
            'Water-soaked lesions along leaf margins that turn yellow then brown, bacterial ooze drying into yellow crusts, premature leaf fall.',
          treatments: [
            { type: 'chemical', label: 'Copper Oxychloride 50 WP', detail: 'Apply at 3 g/L water. Acts as a protective bactericide; repeat every 10 days.' },
            { type: 'chemical', label: 'Streptomycin Sulphate', detail: 'Apply at 0.5 g/L water as a curative spray at disease onset.' },
            { type: 'preventive', label: 'Seed Treatment', detail: 'Treat seeds with Streptomycin 1g + Copper Oxychloride 2g per litre of water for 30 minutes before sowing.' },
          ],
        },
        {
          name: 'Soft Rot',
          severity: 'medium',
          symptoms:
            'Soft, water-soaked, foul-smelling rot of fleshy tissues (roots, tubers, fruits), rapid tissue breakdown, usually starts at wounds or soil entry points.',
          treatments: [
            { type: 'preventive', label: 'Avoid Injury', detail: 'Handle crop carefully during thinning and weeding to prevent entry wounds for bacteria.' },
            { type: 'chemical', label: 'Copper-based Bactericide', detail: 'Dip planting material in copper hydroxide solution (2 g/L) before planting.' },
            { type: 'preventive', label: 'Cold Storage', detail: 'Store harvested produce promptly at recommended temperature to slow bacterial spread.' },
          ],
        },
      ],
      generalTip: `Disinfect all farm tools with 1% bleach solution between uses, especially after working in infected areas. Bacterial diseases have no cure once established — prevention is the only strategy.`,
      warning: 'Infected plant debris in soil can remain infective for 2–3 seasons. Practise deep ploughing and crop rotation religiously in affected fields.',
    },

    viral: {
      category: categoryLabel,
      crop: cropName,
      overview: `Viral diseases of ${cropName} are primarily transmitted by insect vectors like aphids, whiteflies, and thrips. Controlling the vector is the most effective management strategy.`,
      pests: [
        {
          name: 'Mosaic Virus',
          severity: 'high',
          symptoms:
            'Irregular light and dark green mottling on leaves, leaf distortion and puckering, stunted plant growth and significantly reduced yield.',
          treatments: [
            { type: 'preventive', label: 'Vector Control', detail: 'Control aphid populations (the primary vector) aggressively with neem oil or Imidacloprid.' },
            { type: 'preventive', label: 'Roguing', detail: 'Remove and destroy infected plants immediately to prevent virus spread to healthy plants.' },
            { type: 'preventive', label: 'Certified Virus-Free Seed', detail: 'Always use certified virus-tested seed from reputable suppliers. Never save seed from infected crops.' },
          ],
        },
        {
          name: 'Leaf Curl Virus',
          severity: 'high',
          symptoms:
            'Upward curling and cupping of young leaves, thickening and brittleness of affected leaves, severe stunting and flower drop.',
          treatments: [
            { type: 'chemical', label: 'Imidacloprid Seed Treatment', detail: 'Treat seeds at 5 ml/kg to protect seedlings from whitefly feeding in early growth.' },
            { type: 'preventive', label: 'Reflective Mulch', detail: 'Silver mulch repels whiteflies and reduces early-season virus transmission significantly.' },
            { type: 'preventive', label: 'Border Crops', detail: 'Plant maize or sorghum as tall border rows to act as physical barriers against whitefly migration.' },
          ],
        },
        {
          name: 'Yellow Vein Mosaic',
          severity: 'medium',
          symptoms:
            'Network of yellow veins on green leaves giving a yellowed appearance, gradual leaf yellowing and plant decline over several weeks.',
          treatments: [
            { type: 'chemical', label: 'Thiamethoxam 25 WG', detail: 'Apply at 0.5 g/L to control whitefly vectors. Two sprays at 10-day intervals.' },
            { type: 'preventive', label: 'Whitefly Monitoring', detail: 'Set yellow sticky traps at 10–12 per acre to detect and monitor whitefly activity early.' },
            { type: 'preventive', label: 'Resistant Cultivars', detail: 'Use locally recommended YVMV-resistant varieties — ask your local Krishi Vikas Kendra.' },
          ],
        },
      ],
      generalTip: `There is no chemical cure for viral diseases. All management must focus on eliminating insect vectors before they can transmit the virus. Early-season protection is critical.`,
      warning: 'Viral diseases spread exponentially. A single infected plant can infect an entire field within weeks through vector insects. Act immediately on any suspicious symptoms.',
    },

    weeds: {
      category: categoryLabel,
      crop: cropName,
      overview: `Weed competition is one of the largest causes of yield loss in ${cropName}, particularly in the first 30–45 days after planting. Timely weeding during the critical weed-free period is essential.`,
      pests: [
        {
          name: 'Broadleaf Weeds',
          severity: 'medium',
          symptoms:
            'Fast-growing wide-leafed plants competing for light, nutrients and moisture; examples include Parthenium, Amaranthus, and Chenopodium.',
          treatments: [
            { type: 'chemical', label: '2,4-D Sodium Salt 80 WP', detail: 'Apply at 1 kg/acre in 200L water at 20–25 days after sowing for selective control.' },
            { type: 'organic', label: 'Manual Weeding', detail: 'Hand-weed at 15 and 30 days after sowing. First weeding is the most critical.' },
            { type: 'preventive', label: 'Mulching', detail: 'Apply paddy straw or black polythene mulch to suppress weed germination by up to 80%.' },
          ],
        },
        {
          name: 'Grassy Weeds',
          severity: 'medium',
          symptoms:
            'Narrow-leafed grass-like plants resembling the crop in early stages; Phalaris minor, Echinochloa, and Cynodon are common examples.',
          treatments: [
            { type: 'chemical', label: 'Clodinafop 15 WP', detail: 'Apply at 60 g/acre in 150L water at 30–35 days after sowing for grassy weed control.' },
            { type: 'chemical', label: 'Pendimethalin 30 EC', detail: 'Apply as pre-emergence herbicide at 1.3 L/acre within 3 days of sowing.' },
            { type: 'preventive', label: 'Clean Seed', detail: 'Use only certified weed-free seed to prevent introduction of new weed species to the field.' },
          ],
        },
        {
          name: 'Sedges (Nutgrass)',
          severity: 'low',
          symptoms:
            'Triangular-stemmed plants with tough underground tubers; Cyperus rotundus (nutsedge) is very difficult to eradicate once established.',
          treatments: [
            { type: 'chemical', label: 'Halosulfuron-methyl 75 WG', detail: 'Apply post-emergence at 130 g/ha in 200L water. Highly specific to sedge species.' },
            { type: 'organic', label: 'Repeated Cultivation', detail: 'Repeat deep ploughing every 10–14 days in summer to exhaust underground tuber reserves.' },
            { type: 'preventive', label: 'Avoid Moving Infested Soil', detail: 'Do not transport soil or farm equipment from nutgrass-infested fields to clean fields.' },
          ],
        },
      ],
      generalTip: `The critical weed-free period for most crops is 30–45 days after germination. Weeding even once during this window can save 40–60% of potential yield losses.`,
    },

    nematodes: {
      category: categoryLabel,
      crop: cropName,
      overview: `Root-knot and other nematodes cause serious hidden damage to ${cropName} by disrupting nutrient and water uptake. Damage is often mistaken for nutrient deficiency or drought stress.`,
      pests: [
        {
          name: 'Root-Knot Nematode',
          severity: 'high',
          symptoms:
            'Small galls or knots on roots, stunted and yellowing plants, wilting in hot conditions despite adequate irrigation, poor response to fertilizers.',
          treatments: [
            { type: 'organic', label: 'Carbofuran 3G', detail: 'Apply 1 kg a.i./acre in soil at sowing time. Highly effective granular nematicide.' },
            { type: 'organic', label: 'Neem Cake', detail: 'Apply 250 kg/acre neem cake while preparing the field. Improves soil health and suppresses nematodes.' },
            { type: 'preventive', label: 'Marigold Intercropping', detail: 'Grow French marigold as a trap crop or intercrop — its root exudates are toxic to root-knot nematodes.' },
          ],
        },
        {
          name: 'Cyst Nematode',
          severity: 'high',
          symptoms:
            'Patchy yellowing in fields, severe stunting, white or yellow cysts (lemon-shaped) visible on roots, roots may appear shredded.',
          treatments: [
            { type: 'chemical', label: 'Ethoprophos 10G', detail: 'Apply 5 kg/acre in soil before planting. Provides 60–90 days protection to developing roots.' },
            { type: 'organic', label: 'Trichoderma harzianum', detail: 'Apply 2.5 kg/acre mixed with compost. Biological control agent effective against cyst nematodes.' },
            { type: 'preventive', label: 'Crop Rotation', detail: 'Rotate with non-host crops (cereals, maize) for 2–3 seasons to naturally reduce nematode populations.' },
          ],
        },
        {
          name: 'Lesion Nematode',
          severity: 'medium',
          symptoms:
            'Brown-black lesions on roots, roots appear stunted and discoloured, plants show general weakness and lower-than-expected yields.',
          treatments: [
            { type: 'organic', label: 'Paecilomyces lilacinus', detail: 'Apply 2.5 kg/acre as soil application. Fungal biocontrol agent that parasitises nematode eggs.' },
            { type: 'preventive', label: 'Soil Solarisation', detail: 'Solarise moist soil with clear polythene for 4–6 weeks during peak summer before planting.' },
            { type: 'preventive', label: 'Organic Matter Addition', detail: 'Incorporate 5–10 tonnes FYM/acre to boost beneficial soil microbes that suppress nematodes.' },
          ],
        },
      ],
      generalTip: `Nematode damage is irreversible — once roots are damaged, yield is lost. Prevention through crop rotation, soil solarisation, and biological agents before planting is the best strategy.`,
      warning: 'Nematode-infested soil particles spread on farm equipment, footwear, and irrigation water. Clean equipment thoroughly when moving between fields.',
    },
  };

  return dummyData[categoryId] ?? dummyData['insects'];
};

// ─── Sub-component: Treatment Tag ─────────────────────────────────────────────

const TREATMENT_TYPE_CONFIG = {
  chemical: { label: 'Chemical', color: '#D32F2F', bg: '#FFEBEE', icon: 'flask' },
  organic: { label: 'Organic', color: '#388E3C', bg: '#E8F5E9', icon: 'leaf' },
  preventive: { label: 'Preventive', color: '#1976D2', bg: '#E3F2FD', icon: 'shield-check' },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function PestsAndDisease({ onClose }: Props) {
  const fertilizerCropIds = cropFertilizerData.map(c => c.id);

  const allCrops = plantCategories
    .flatMap((cat: any) =>
      cat.crops.map((crop: any) => ({
        id: crop.id,
        name: crop.name,
        icon: crop.icon,
        category: cat.region,
      }))
    )
    .filter(crop => fertilizerCropIds.includes(crop.id));

  const [selectedCropId, setSelectedCropId] = useState<string>('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PestResult | null>(null);
  const [expandedPest, setExpandedPest] = useState<number | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const selectedCrop = allCrops.find(c => c.id === selectedCropId);
  const activeCategoryObj = PEST_CATEGORIES.find(c => c.id === activeCategory);

  const handleSelectCrop = (cropId: string) => {
    setSelectedCropId(cropId);
    setShowCropModal(false);
    setActiveCategory(null);
    setResult(null);
  };

  const handleCategoryPress = async (category: PestCategory) => {
    if (!selectedCropId) return;
    if (activeCategory === category.id && result) return;

    setActiveCategory(category.id);
    setResult(null);
    setExpandedPest(null);
    setLoading(true);
    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    try {
      const data = await fetchPestData(selectedCrop?.name ?? selectedCropId, category.id);
      setResult(data);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCropId('');
    setActiveCategory(null);
    setResult(null);
    if (onClose) onClose();
  };

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Pests & Disease</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.8}>
            <Feather name="x" size={22} color={theme.colors.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* ── Compact Crop Selector ── */}
        <TouchableOpacity
          style={styles.compactCropSelector}
          onPress={() => setShowCropModal(true)}
          activeOpacity={0.85}
        >
          {selectedCrop ? (
            <>
              <View style={styles.compactCropIcon}>
                <Text style={{ fontSize: 20 }}>{selectedCrop.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.compactCropName}>{selectedCrop.name}</Text>
                <Text style={styles.compactCropSub}>{selectedCrop.category}</Text>
              </View>
              <View style={styles.changeBadge}>
                <Text style={styles.changeBadgeText}>Change</Text>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.compactCropIcon, { backgroundColor: '#F0F0F0' }]}>
                <MaterialCommunityIcons name="leaf" size={20} color="#999" />
              </View>
              <Text style={[styles.compactCropName, { color: '#999', fontWeight: '500' }]}>
                Select a crop to begin
              </Text>
              <Feather name="chevron-down" size={18} color="#999" />
            </>
          )}
        </TouchableOpacity>

        {/* ── Section Title ── */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Pest & Disease Categories</Text>
          {selectedCrop && (
            <Text style={styles.sectionSubtitle}>Tap to diagnose</Text>
          )}
        </View>

        {/* ── Category Grid ── */}
        <View style={styles.categoryGrid}>
          {PEST_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            const disabled = !selectedCropId;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  isActive && { borderColor: cat.color, borderWidth: 2, backgroundColor: cat.bg },
                  disabled && styles.categoryCardDisabled,
                ]}
                onPress={() => handleCategoryPress(cat)}
                activeOpacity={0.8}
                disabled={disabled}
              >
                <View style={[styles.categoryIconWrap, { backgroundColor: isActive ? cat.color : cat.bg }]}>
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={22}
                    color={isActive ? '#fff' : cat.color}
                  />
                </View>
                <Text style={[styles.categoryCardLabel, disabled && { color: '#BDBDBD' }]}>
                  {cat.label}
                </Text>
                <Text style={[styles.categoryCardDesc, disabled && { color: '#E0E0E0' }]}>
                  {cat.description}
                </Text>
                {isActive && (
                  <View style={[styles.categoryActiveDot, { backgroundColor: cat.color }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Loading ── */}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>
              Scanning {activeCategoryObj?.label} for {selectedCrop?.name}…
            </Text>
          </View>
        )}

        {/* ── Result ── */}
        {result && !loading && activeCategoryObj && (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* Overview Card */}
            <View style={[styles.overviewCard, { borderLeftColor: activeCategoryObj.color }]}>
              <View style={styles.overviewTop}>
                <View style={[styles.categoryBadge, { backgroundColor: activeCategoryObj.bg }]}>
                  <MaterialCommunityIcons
                    name={activeCategoryObj.icon as any}
                    size={13}
                    color={activeCategoryObj.color}
                  />
                  <Text style={[styles.categoryBadgeText, { color: activeCategoryObj.color }]}>
                    {result.category}
                  </Text>
                </View>
                <Text style={styles.overviewCropName}>{result.crop}</Text>
              </View>
              <Text style={styles.overviewText}>{result.overview}</Text>
            </View>

            {/* Pest Entries */}
            <Text style={styles.pestListTitle}>Common {activeCategoryObj.label}</Text>

            {result.pests.map((pest, idx) => {
              const sev = SEVERITY_CONFIG[pest.severity];
              const isExpanded = expandedPest === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.pestCard}
                  onPress={() => setExpandedPest(isExpanded ? null : idx)}
                  activeOpacity={0.85}
                >
                  {/* Pest Header */}
                  <View style={styles.pestCardHeader}>
                    <View style={styles.pestCardLeft}>
                      <View style={[styles.pestSeverityDot, { backgroundColor: sev.color }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pestName}>{pest.name}</Text>
                        <View style={[styles.severityBadge, { backgroundColor: sev.bg }]}>
                          <Text style={[styles.severityBadgeText, { color: sev.color }]}>
                            {sev.label}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Feather
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#999"
                    />
                  </View>

                  {/* Symptoms */}
                  <View style={styles.symptomsRow}>
                    <Feather name="eye" size={13} color="#888" style={{ marginTop: 2 }} />
                    <Text style={styles.symptomsText}>{pest.symptoms}</Text>
                  </View>

                  {/* Treatments (expanded) */}
                  {isExpanded && (
                    <View style={styles.treatmentsContainer}>
                      <View style={styles.treatmentsDivider} />
                      <Text style={styles.treatmentsTitle}>Treatment Options</Text>
                      {pest.treatments.map((treatment, tIdx) => {
                        const tConfig = TREATMENT_TYPE_CONFIG[treatment.type];
                        return (
                          <View key={tIdx} style={[styles.treatmentItem, { borderLeftColor: tConfig.color }]}>
                            <View style={styles.treatmentHeader}>
                              <View style={[styles.treatmentTypeBadge, { backgroundColor: tConfig.bg }]}>
                                <MaterialCommunityIcons
                                  name={tConfig.icon as any}
                                  size={11}
                                  color={tConfig.color}
                                />
                                <Text style={[styles.treatmentTypeText, { color: tConfig.color }]}>
                                  {tConfig.label}
                                </Text>
                              </View>
                              <Text style={styles.treatmentLabel}>{treatment.label}</Text>
                            </View>
                            <Text style={styles.treatmentDetail}>{treatment.detail}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* General Tip */}
            <View style={styles.generalTipBox}>
              <View style={styles.generalTipHeader}>
                <MaterialCommunityIcons name="lightbulb-on" size={16} color={theme.colors.primary} />
                <Text style={styles.generalTipTitle}>Expert Tip</Text>
              </View>
              <Text style={styles.generalTipText}>{result.generalTip}</Text>
            </View>

            {/* Warning */}
            {result.warning && (
              <View style={styles.warningBox}>
                <Feather name="alert-triangle" size={16} color="#F57C00" style={{ marginTop: 2 }} />
                <Text style={styles.warningText}>{result.warning}</Text>
              </View>
            )}

            <View style={{ height: 40 }} />
          </Animated.View>
        )}

        {/* ── Empty States ── */}
        {!selectedCropId && !loading && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="shield-search" size={64} color="#FFCDD2" />
            <Text style={styles.emptyTitle}>Select a Crop</Text>
            <Text style={styles.emptySubtitle}>
              Choose your crop above, then tap a pest category to see diagnosis and treatment options.
            </Text>
          </View>
        )}

        {selectedCropId && !activeCategory && !loading && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="gesture-tap" size={52} color="#FFCDD2" />
            <Text style={styles.emptyTitle}>Pick a Category</Text>
            <Text style={styles.emptySubtitle}>
              Tap any pest or disease category above to get expert diagnosis and treatment advice for {selectedCrop?.name}.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* ── Crop Selection Modal ── */}
      <Modal
        visible={showCropModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCropModal(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowCropModal(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Crop</Text>
              <TouchableOpacity onPress={() => setShowCropModal(false)} activeOpacity={0.8}>
                <Feather name="x" size={22} color={theme.colors.secondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={allCrops}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cropListItem}
                  onPress={() => handleSelectCrop(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cropListIcon}>
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cropListName}>{item.name}</Text>
                    <Text style={styles.cropListCat}>{item.category}</Text>
                  </View>
                  {item.id === selectedCropId && (
                    <Feather name="check-circle" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_W = (width - 56) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFEBEE',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },

  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Compact Crop Selector
  compactCropSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  compactCropIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactCropName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  compactCropSub: {
    fontSize: 11,
    color: '#999',
    marginTop: 1,
  },
  changeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  changeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Section Title
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#999',
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  categoryCard: {
    width: CARD_W,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  categoryCardDisabled: {
    opacity: 0.4,
  },
  categoryIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 3,
  },
  categoryCardDesc: {
    fontSize: 11,
    color: '#999',
  },
  categoryActiveDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Loading
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Overview Card
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  overviewCropName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  overviewText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },

  // Pest List
  pestListTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 10,
  },
  pestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  pestCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pestCardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  pestSeverityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    flexShrink: 0,
  },
  pestName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 5,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  severityBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  symptomsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 8,
  },
  symptomsText: {
    flex: 1,
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },

  // Treatments
  treatmentsContainer: {
    marginTop: 10,
  },
  treatmentsDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 12,
  },
  treatmentsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 10,
  },
  treatmentItem: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  treatmentTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  treatmentTypeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  treatmentLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
    flex: 1,
  },
  treatmentDetail: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },

  // General Tip
  generalTipBox: {
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  generalTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 7,
  },
  generalTipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  generalTipText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },

  // Warning
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F57C00',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#795548',
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  cropListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 14,
  },
  cropListIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropListName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  cropListCat: {
    fontSize: 12,
    color: '#999',
    marginTop: 1,
  },
});