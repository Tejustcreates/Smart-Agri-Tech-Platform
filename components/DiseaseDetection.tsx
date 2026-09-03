import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section';

/* ── Types ── */

interface DiseaseInfo {
  name: string;
  symptoms: string[];
  severity: 'Low' | 'Medium' | 'High';
  causes: string[];
  treatment: {
    pesticide?: string;
    fungicide?: string;
    fertilizer?: string;
    organic?: string;
  };
  prevention: string[];
}

interface SelectedSymptom {
  id: string;
  label: string;
  category: string;
}

/* ── Data ── */

const DISEASES: Record<string, DiseaseInfo> = {
  'leaf-blight': {
    name: 'Leaf Blight',
    symptoms: ['Yellow spots on leaves', 'Brown lesions', 'Wilting leaves', 'Leaf drop', 'yellow-spots', 'brown-lesions', 'wilting', 'leaf-drop'],
    severity: 'High',
    causes: ['Fungal infection', 'High humidity', 'Poor air circulation'],
    treatment: {
      fungicide: 'FungiCure Pro – Apply 2 ml per litre of water',
      fertilizer: 'Apply NPK 10:10:10 to boost plant immunity',
    },
    prevention: ['Use resistant varieties', 'Improve drainage', 'Avoid overhead irrigation'],
  },
  'powdery-mildew': {
    name: 'Powdery Mildew',
    symptoms: ['White powdery coating', 'Curled leaves', 'Stunted growth', 'Yellow leaves', 'white-powder', 'curled-leaves', 'stunted', 'stunted-growth'],
    severity: 'Medium',
    causes: ['Humid conditions', 'Overcrowding', 'Poor ventilation'],
    treatment: {
      pesticide: 'Neem Oil Solution – Mix 5 ml per litre',
      organic: 'Baking soda spray (1 tbsp per litre)',
    },
    prevention: ['Space plants properly', 'Ensure good air flow', 'Remove infected parts'],
  },
  'bacterial-spot': {
    name: 'Bacterial Spot',
    symptoms: ['Dark spots on leaves', 'Water-soaked lesions', 'Fruit rot', 'Leaf yellowing', 'water-soaked', 'fruit-rot'],
    severity: 'High',
    causes: ['Bacterial infection', 'Warm wet conditions', 'Insect vectors'],
    treatment: {
      pesticide: 'Copper-based bactericide',
      fertilizer: 'Zinc sulfate spray',
    },
    prevention: ['Use disease-free seeds', 'Control insects', 'Avoid working in wet fields'],
  },
  'root-rot': {
    name: 'Root Rot',
    symptoms: ['Yellowing leaves', 'Wilting despite watering', 'Soft roots', 'Stunted growth', 'soft-roots', 'wilting', 'stunted', 'stunted-growth'],
    severity: 'High',
    causes: ['Overwatering', 'Poor drainage', 'Soil fungi'],
    treatment: {
      fungicide: 'Metalaxyl-based fungicide drench',
      organic: 'Trichoderma compost tea',
    },
    prevention: ['Ensure proper drainage', 'Avoid overwatering', 'Use raised beds'],
  },
  'rust-fungus': {
    name: 'Rust Fungus',
    symptoms: ['Orange/brown pustules', 'Leaf drop', 'Reduced yield', 'Yellow spots', 'orange-pustules', 'leaf-drop', 'yellow-spots'],
    severity: 'Medium',
    causes: ['Fungal spores', 'Cool moist conditions', 'Infected plant debris'],
    treatment: {
      fungicide: 'Sulfur-based fungicide',
      fertilizer: 'Potassium-rich fertilizer to strengthen plants',
    },
    prevention: ['Remove infected leaves', 'Crop rotation', 'Clean tools'],
  },
  'mosaic-virus': {
    name: 'Mosaic Virus',
    symptoms: ['Mottled green/yellow pattern', 'Distorted leaves', 'Stunted plants', 'Reduced fruiting', 'mottled-pattern', 'stunted', 'reduced-fruit', 'reduced-fruiting'],
    severity: 'High',
    causes: ['Viral infection', 'Aphid transmission', 'Contaminated tools'],
    treatment: {
      fertilizer: 'Foliar spray with micronutrients',
      organic: 'Neem oil to control aphid vectors',
    },
    prevention: ['Control aphid populations', 'Use virus-free seeds', 'Disinfect tools'],
  },
  'anthracnose': {
    name: 'Anthracnose',
    symptoms: ['Dark sunken spots', 'Fruit rot', 'Branch dieback', 'Leaf lesions', 'sunken-spots', 'fruit-rot', 'branch-dieback'],
    severity: 'High',
    causes: ['Fungal infection', 'Warm wet weather', 'Overhead watering'],
    treatment: {
      fungicide: 'Chlorothalonil spray',
      organic: 'Copper soap fungicide',
    },
    prevention: ['Prune affected branches', 'Avoid overhead watering', 'Use mulch'],
  },
  'fusarium-wilt': {
    name: 'Fusarium Wilt',
    symptoms: ['Yellow lower leaves', 'One-sided wilting', 'Brown vascular tissue', 'Plant death', 'one-sided-wilt', 'wilting'],
    severity: 'High',
    causes: ['Soil-borne fungus', 'Root damage', 'Compacted soil'],
    treatment: {
      fungicide: 'Benomyl soil drench',
      fertilizer: 'Calcium nitrate for plant strength',
    },
    prevention: ['Use resistant varieties', 'Practice crop rotation', 'Improve soil drainage'],
  },
};

const SYMPTOM_CATEGORIES = [
  {
    name: 'Leaf Symptoms',
    iconClass: 'fas fa-leaf',
    color: 'bg-emerald-100 text-emerald-700',
    symptoms: [
      { id: 'yellow-spots', label: 'Yellow spots on leaves' },
      { id: 'brown-lesions', label: 'Brown lesions' },
      { id: 'white-powder', label: 'White powdery coating' },
      { id: 'curled-leaves', label: 'Curled or distorted leaves' },
      { id: 'wilting', label: 'Wilting leaves' },
      { id: 'leaf-drop', label: 'Premature leaf drop' },
      { id: 'mottled-pattern', label: 'Mottled green/yellow pattern' },
    ],
  },
  {
    name: 'Stem & Root Symptoms',
    iconClass: 'fas fa-seedling',
    color: 'bg-amber-100 text-amber-700',
    symptoms: [
      { id: 'soft-roots', label: 'Soft or mushy roots' },
      { id: 'brown-roots', label: 'Brown discoloration of roots' },
      { id: 'branch-dieback', label: 'Branch dieback' },
      { id: 'stem-lesions', label: 'Lesions on stem' },
    ],
  },
  {
    name: 'Fruit & Yield Symptoms',
    iconClass: 'fas fa-apple-alt',
    color: 'bg-red-100 text-red-700',
    symptoms: [
      { id: 'fruit-rot', label: 'Fruit rot or spots' },
      { id: 'sunken-spots', label: 'Sunken spots on fruit' },
      { id: 'reduced-fruit', label: 'Reduced fruiting' },
      { id: 'stunted-growth', label: 'Stunted growth' },
    ],
  },
  {
    name: 'General Symptoms',
    iconClass: 'fas fa-exclamation-triangle',
    color: 'bg-orange-100 text-orange-700',
    symptoms: [
      { id: 'stunted', label: 'General stunting' },
      { id: 'one-sided-wilt', label: 'One-sided wilting' },
      { id: 'orange-pustules', label: 'Orange/brown pustules' },
      { id: 'water-soaked', label: 'Water-soaked appearance' },
    ],
  },
];

const CROP_OPTIONS = [
  { name: 'Wheat', iconClass: 'fas fa-wheat-awn' },
  { name: 'Rice', iconClass: 'fas fa-seedling' },
  { name: 'Cotton', iconClass: 'fas fa-cloud' },
  { name: 'Tomato', iconClass: 'fas fa-apple-alt' },
  { name: 'Potato', iconClass: 'fas fa-circle' },
  { name: 'Onion', iconClass: 'fas fa-circle-half-stroke' },
  { name: 'Maize', iconClass: 'fas fa-wheat-awn' },
  { name: 'Sugarcane', iconClass: 'fas fa-tree' },
  { name: 'Soybean', iconClass: 'fas fa-leaf' },
  { name: 'Other', iconClass: 'fas fa-ellipsis-h' },
];

const STEPS = [
  { num: 1, label: 'Select Crop', shortLabel: 'Crop' },
  { num: 2, label: 'Select Symptoms', shortLabel: 'Symptoms' },
  { num: 3, label: 'Analyze Crop', shortLabel: 'Analyze' },
  { num: 4, label: 'View Report', shortLabel: 'Report' },
];

/* ── Sub-components ── */

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="max-w-2xl mx-auto mb-10 px-2">
    <div className="flex items-center justify-between">
      {STEPS.map((step, i) => {
        const isActive = currentStep === step.num;
        const isDone = currentStep > step.num;
        return (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center text-center flex-1">
              <div
                className={`min-w-[40px] min-h-[40px] w-10 h-10 sm:min-w-[48px] sm:min-h-[48px] sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isDone
                    ? 'bg-brand-600 text-white'
                    : isActive
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isDone ? <i className="fas fa-check text-xs" /> : step.num}
              </div>
              <p className={`text-[10px] sm:text-xs font-semibold mt-2 ${isActive || isDone ? 'text-brand-700' : 'text-gray-400'}`}>
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mt-[-16px] sm:mt-[-20px] transition-colors duration-300 ${
                  currentStep > step.num ? 'bg-brand-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

const CropSelector: React.FC<{ selected: string; onSelect: (c: string) => void }> = ({ selected, onSelect }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
      <i className="fas fa-seedling text-brand-600" /> Select Your Crop
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {CROP_OPTIONS.map((crop) => {
        const isSelected = selected === crop.name;
        return (
          <button
            key={crop.name}
            onClick={() => onSelect(crop.name)}
            className={`active:scale-95 flex flex-col items-center gap-2 min-h-[90px] px-4 py-4 rounded-xl font-medium text-sm transition-all duration-200 ${
              isSelected
                ? 'border-2 border-brand-600 bg-brand-50 text-brand-700 shadow-sm shadow-brand-200/50'
                : 'border-2 border-gray-100 bg-white text-gray-600 hover:border-brand-300 hover:bg-brand-50/40 hover:shadow-sm'
            }`}
          >
            <i className={`${crop.iconClass} text-xl ${isSelected ? 'text-brand-600' : 'text-gray-400'}`} />
            <span>{crop.name}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const SymptomSelector: React.FC<{
  selected: SelectedSymptom[];
  onToggle: (s: SelectedSymptom) => void;
}> = ({ selected, onToggle }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(SYMPTOM_CATEGORIES.map((c) => [c.name, true]))
  );

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
        <i className="fas fa-search text-brand-600" /> Select Observed Symptoms
      </h3>
      <div className="space-y-4">
        {SYMPTOM_CATEGORIES.map((category) => {
          const isOpen = openCategories[category.name];
          const selectedInCat = category.symptoms.filter((s) => selected.some((sel) => sel.id === s.id)).length;
          return (
            <div key={category.name} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleCategory(category.name)}
                className="tap-target w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${category.color}`}>
                    <i className={`${category.iconClass} text-xs`} />
                  </span>
                  <span className="text-sm font-bold text-gray-700">{category.name}</span>
                  {selectedInCat > 0 && (
                    <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-semibold">
                      {selectedInCat} selected
                    </span>
                  )}
                </div>
                <span className={`text-gray-400 text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {category.symptoms.map((symptom) => {
                        const isSelected = selected.some((s) => s.id === symptom.id);
                        return (
                          <button
                            key={symptom.id}
                            onClick={() => onToggle({ ...symptom, category: category.name })}
                            className={`active:scale-[0.97] tap-target flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm transition-all duration-200 ${
                              isSelected
                                ? 'border-brand-500 bg-brand-50 text-brand-800 shadow-sm'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div
                              className={`min-w-[20px] w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected ? 'bg-brand-500 border-brand-500' : 'border-gray-300'
                              }`}
                            >
                              {isSelected && (
                                <i className="fas fa-check text-[10px] text-white" />
                              )}
                            </div>
                            <span>{symptom.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ResultReport: React.FC<{
  disease: DiseaseInfo | null;
  confidence: number;
  matchedSymptoms: string[];
}> = ({ disease, confidence, matchedSymptoms }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('treatment');

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  if (!disease) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="fas fa-check text-3xl text-brand-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Healthy Crop</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          No significant disease indicators were found based on the selected symptoms. Continue monitoring your crop regularly.
        </p>
      </motion.div>
    );
  }

  const severityConfig = {
    High: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: 'fas fa-exclamation-circle' },
    Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: 'fas fa-exclamation' },
    Low: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'fas fa-info-circle' },
  };
  const sev = severityConfig[disease.severity];

  const actionSentence = {
    High: 'Immediate treatment required — apply recommended products within 24 hours.',
    Medium: 'Monitor closely and begin treatment within the next few days.',
    Low: 'Minor issue — preventive measures should be sufficient.',
  };

  const treatmentEntries = Object.entries(disease.treatment).filter(([_, v]) => v) as [string, string][];
  const treatmentMeta: Record<string, { label: string; color: string; icon: string }> = {
    organic: { label: 'Organic Treatment', color: 'bg-emerald-50 border-emerald-100 text-emerald-700', icon: 'fas fa-leaf' },
    fungicide: { label: 'Fungicide', color: 'bg-purple-50 border-purple-100 text-purple-700', icon: 'fas fa-flask' },
    pesticide: { label: 'Pesticide', color: 'bg-amber-50 border-amber-100 text-amber-700', icon: 'fas fa-bug' },
    fertilizer: { label: 'Recommended Fertilizer', color: 'bg-blue-50 border-blue-100 text-blue-700', icon: 'fas fa-tint' },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm opacity-80 mb-1">Identified Disease</p>
            <h3 className="text-2xl font-bold">{disease.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Match Strength</p>
            <p className="text-3xl font-bold">{confidence}%</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Severity badge + action sentence — shown first */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${sev.bg} ${sev.border}`}>
          <i className={`${sev.icon} text-lg ${sev.text}`} />
          <div>
            <span className={`text-sm font-bold ${sev.text}`}>{disease.severity} Severity</span>
            <p className="text-sm text-gray-600 mt-0.5">{actionSentence[disease.severity]}</p>
          </div>
        </div>

        {/* Observed Symptoms */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fas fa-search text-brand-600 text-sm" /> Observed Symptoms
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchedSymptoms.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-100">{s}</span>
            ))}
          </div>
        </div>

        {/* Likely Causes */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fas fa-lightbulb text-amber-500 text-sm" /> Likely Causes
          </h4>
          <ul className="space-y-2">
            {disease.causes.map((cause, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                {cause}
              </li>
            ))}
          </ul>
        </div>

        {/* Treatments — expandable */}
        <div>
          <button
            onClick={() => toggleSection('treatment')}
            className="tap-target w-full font-bold text-gray-800 mb-3 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <i className="fas fa-pills text-brand-600 text-sm" /> Recommended Treatment
            </span>
            <i className={`fas fa-chevron-down text-gray-400 text-xs transition-transform ${expandedSection === 'treatment' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSection === 'treatment' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {treatmentEntries.map(([key, value]) => {
                    const meta = treatmentMeta[key] || { label: key, color: 'bg-gray-50 border-gray-100 text-gray-700', icon: 'fas fa-pills' };
                    return (
                      <div key={key} className={`rounded-xl p-4 border ${meta.color}`}>
                        <p className="flex items-center gap-1.5 text-xs uppercase font-bold mb-1">
                          <i className={meta.icon} /> {meta.label}
                        </p>
                        <p className="text-sm font-medium text-gray-800">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prevention — expandable */}
        <div>
          <button
            onClick={() => toggleSection('prevention')}
            className="tap-target w-full font-bold text-gray-800 mb-3 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <i className="fas fa-shield-alt text-brand-600 text-sm" /> Prevention Tips
            </span>
            <i className={`fas fa-chevron-down text-gray-400 text-xs transition-transform ${expandedSection === 'prevention' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSection === 'prevention' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2">
                  {disease.prevention.map((tip, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-100">
                      {tip}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Component ── */

const DiseaseDetection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedDisease, setDetectedDisease] = useState<DiseaseInfo | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const canProceed = useMemo(() => {
    if (currentStep === 1) return selectedCrop !== '';
    if (currentStep === 2) return selectedSymptoms.length > 0;
    return true;
  }, [currentStep, selectedCrop, selectedSymptoms]);

  const toggleSymptom = useCallback((symptom: SelectedSymptom) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.find((s) => s.id === symptom.id);
      if (exists) return prev.filter((s) => s.id !== symptom.id);
      return [...prev, symptom];
    });
    setShowResults(false);
    setDetectedDisease(null);
  }, []);

  const analyzeSymptoms = useCallback(async () => {
    setIsAnalyzing(true);
    setShowResults(false);
    await new Promise((r) => setTimeout(r, 1200));

    const symptomIds = selectedSymptoms.map((s) => s.id);
    let bestMatch: { disease: DiseaseInfo; score: number } | null = null;

    for (const disease of Object.values(DISEASES)) {
      const matchCount = disease.symptoms.filter(
        (s) => symptomIds.includes(s) || symptomIds.some((id) => s.includes(id))
      ).length;
      if (matchCount > 0) {
        const score = (matchCount / Math.max(symptomIds.length, 1)) * 100;
        if (!bestMatch || score > bestMatch.score) bestMatch = { disease, score };
      }
    }

    if (bestMatch) {
      setDetectedDisease(bestMatch.disease);
      setConfidence(Math.min(95, Math.round(bestMatch.score)));
    } else {
      setDetectedDisease(null);
      setConfidence(0);
    }
    setShowResults(true);
    setCurrentStep(4);
    setIsAnalyzing(false);
  }, [selectedSymptoms]);

  const resetAll = useCallback(() => {
    setCurrentStep(1);
    setSelectedCrop('');
    setSelectedSymptoms([]);
    setDetectedDisease(null);
    setConfidence(0);
    setShowResults(false);
  }, []);

  const matchedLabels = useMemo(() => {
    if (!detectedDisease) return [];
    const ids = selectedSymptoms.map((s) => s.id);
    const matchedIds = detectedDisease.symptoms.filter((s) => ids.includes(s) || ids.some((id) => s.includes(id)));
    const labels = new Set<string>();
    for (const id of matchedIds) {
      const sym = selectedSymptoms.find((s) => s.id === id || id.includes(s.id));
      if (sym) labels.add(sym.label);
    }
    if (labels.size === 0) selectedSymptoms.forEach((s) => labels.add(s.label));
    return Array.from(labels);
  }, [detectedDisease, selectedSymptoms]);

  const handleNext = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(3);
      analyzeSymptoms();
    } else if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, analyzeSymptoms]);

  const handleBack = useCallback(() => {
    if (currentStep > 1 && currentStep < 4) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  return (
    <Section
      id="disease-detection"
      tone="amber"
      icon="fas fa-shield-alt"
      eyebrow="Crop Protection"
      title="Crop Disease Advisor"
      subtitle="Identify crop diseases and receive treatment and prevention recommendations for healthier crops."
    >
      <div className="w-full">

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Crop Selection */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                  <CropSelector selected={selectedCrop} onSelect={(c) => { setSelectedCrop(c); setShowResults(false); }} />
                </motion.div>
              )}

              {/* Step 2: Symptom Selection */}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                  <SymptomSelector selected={selectedSymptoms} onToggle={toggleSymptom} />
                </motion.div>
              )}

              {/* Step 3: Analyzing */}
              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} className="py-16 text-center">
                  <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-5" />
                  <p className="text-lg font-semibold text-gray-700">Analyzing your crop...</p>
                  <p className="text-sm text-gray-400 mt-1">Comparing symptoms against known conditions</p>
                </motion.div>
              )}

              {/* Step 4: Results */}
              {currentStep === 4 && showResults && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <ResultReport disease={detectedDisease} confidence={confidence} matchedSymptoms={matchedLabels} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hints */}
          {currentStep === 1 && !selectedCrop && (
            <p className="text-center text-amber-600 text-sm mb-4">Select a crop to continue</p>
          )}
          {currentStep === 2 && selectedSymptoms.length === 0 && (
            <p className="text-center text-amber-600 text-sm mb-4">Select at least one symptom to continue</p>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="tap-target py-3.5 px-8 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm"
                >
                  <i className="fas fa-arrow-left mr-1" /> Back
                </button>
              )}
              {currentStep < 3 && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="tap-target py-3.5 px-10 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm shadow-md shadow-brand-200/50"
                >
                  {currentStep === 2 ? 'Analyze Crop' : 'Next Step'} <i className="fas fa-arrow-right ml-1" />
                </button>
              )}
              <button
                onClick={resetAll}
                className="tap-target py-3.5 px-8 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm"
              >
                <i className="fas fa-redo mr-1" /> Reset
              </button>
            </div>
          )}

          {/* Step 4: Back to start */}
          {currentStep === 4 && (
            <div className="flex justify-center">
              <button
                onClick={resetAll}
                className="tap-target py-3.5 px-10 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all text-sm shadow-sm shadow-brand-200"
              >
                <i className="fas fa-redo mr-1" /> Check Another Crop
              </button>
            </div>
          )}
        </div>

        {/* Crop Care Tips */}
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <i className="fas fa-heart text-brand-600" /> Crop Care Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'fas fa-tint', title: 'Proper Watering', desc: 'Water early morning to reduce fungal growth' },
              { icon: 'fas fa-wind', title: 'Good Air Circulation', desc: 'Space plants properly to prevent disease spread' },
              { icon: 'fas fa-sync-alt', title: 'Crop Rotation', desc: 'Rotate crops yearly to break disease cycles' },
              { icon: 'fas fa-broom', title: 'Field Hygiene', desc: 'Remove crop debris and clean tools regularly' },
            ].map((tip) => (
              <div key={tip.title} className="tap-target bg-brand-50 rounded-xl p-4 min-h-[100px] flex flex-col">
                <i className={`${tip.icon} text-brand-600 text-xl mb-2`} />
                <h4 className="font-semibold text-gray-800 mb-1 text-sm">{tip.title}</h4>
                <p className="text-xs text-gray-600">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default DiseaseDetection;
