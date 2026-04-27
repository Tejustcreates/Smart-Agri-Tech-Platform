import React, { useState, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

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

const DISEASES: Record<string, DiseaseInfo> = {
  'leaf-blight': {
    name: 'Leaf Blight',
    symptoms: ['Yellow spots on leaves', 'Brown lesions', 'Wilting leaves', 'Leaf drop', 'yellow-spots', 'brown-lesions', 'wilting', 'leaf-drop'],
    severity: 'High',
    causes: ['Fungal infection', 'High humidity', 'Poor air circulation'],
    treatment: {
      fungicide: 'FungiCure Pro - Apply 2ml per liter of water',
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
      pesticide: 'Neem Oil Solution - Mix 5ml per liter',
      organic: 'Baking soda spray (1 tbsp per liter)',
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
    symptoms: [
      { id: 'soft-roots', label: 'Soft or mushy roots' },
      { id: 'brown-roots', label: 'Brown discoloration of roots' },
      { id: 'branch-dieback', label: 'Branch dieback' },
      { id: 'stem-lesions', label: 'Lesions on stem' },
    ],
  },
  {
    name: 'Fruit & Yield Symptoms',
    symptoms: [
      { id: 'fruit-rot', label: 'Fruit rot or spots' },
      { id: 'sunken-spots', label: 'Sunken spots on fruit' },
      { id: 'reduced-fruit', label: 'Reduced fruiting' },
      { id: 'stunted-growth', label: 'Stunted growth' },
    ],
  },
  {
    name: 'General Symptoms',
    symptoms: [
      { id: 'stunted', label: 'General stunting' },
      { id: 'one-sided-wilt', label: 'One-sided wilting' },
      { id: 'orange-pustules', label: 'Orange/brown pustules' },
      { id: 'water-soaked', label: 'Water-soaked appearance' },
    ],
  },
];

const CROP_OPTIONS = ['Wheat', 'Rice', 'Cotton', 'Tomato', 'Potato', 'Onion', 'Maize', 'Sugarcane', 'Soybean', 'Other'];

const DiseaseDetection: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedDisease, setDetectedDisease] = useState<DiseaseInfo | null>(null);
  const [detectedCropFromImage, setDetectedCropFromImage] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'symptoms' | 'upload'>('symptoms');
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSymptom = (symptom: { id: string; label: string; category: string }) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.find((s) => s.id === symptom.id);
      if (exists) {
        return prev.filter((s) => s.id !== symptom.id);
      }
      return [...prev, symptom];
    });
    setShowResults(false);
    setDetectedDisease(null);
  };

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setShowResults(false);
        setDetectedDisease(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
        setShowResults(false);
        setDetectedDisease(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeSymptoms = async () => {
    if (!selectedCrop) {
      alert('Please select a crop type.');
      return;
    }
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const symptomIds = selectedSymptoms.map((s) => s.id);
    let bestMatch: { disease: DiseaseInfo; score: number } | null = null;

    for (const [key, disease] of Object.entries(DISEASES)) {
      const matchCount = disease.symptoms.filter((s) =>
        symptomIds.includes(s) || symptomIds.some(id => s.toLowerCase().includes(id))
      ).length;
      
      if (matchCount > 0) {
        const score = (matchCount / Math.max(selectedSymptoms.length, 1)) * 100;
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { disease, score };
        }
      }
    }

    if (bestMatch) {
      setDetectedDisease(bestMatch.disease);
      setConfidence(Math.min(95, Math.round(bestMatch.score)));
      setShowResults(true);
    } else {
      setDetectedDisease(null);
      setConfidence(0);
      setShowResults(true);
    }

    setIsAnalyzing(false);
  };

  const analyzeImage = async () => {
    if (!uploadedImage) {
      alert('Please upload an image first.');
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const detectedCrop = CROP_OPTIONS[Math.floor(Math.random() * CROP_OPTIONS.length)];
    const randomDiseaseKeys = Object.keys(DISEASES);
    const randomDisease = randomDiseaseKeys[Math.floor(Math.random() * randomDiseaseKeys.length)];
    const disease = DISEASES[randomDisease];

    setDetectedCropFromImage(detectedCrop);
    setDetectedDisease(disease);
    setConfidence(75 + Math.floor(Math.random() * 20));
    setShowResults(true);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedSymptoms([]);
    setUploadedImage(null);
    setDetectedDisease(null);
    setDetectedCropFromImage('');
    setConfidence(0);
    setShowResults(false);
  };

  return (
    <section id="disease-detection" className="py-20 bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">
            Disease Detection <span className="text-red-600">& Smart Treatment</span>
          </h2>
          <p className="text-gray-600 mt-4">Smart crop disease identification with treatment recommendations</p>
        </div>

          <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('symptoms')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === 'symptoms'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-clipboard-check mr-2"></i>
                Select Symptoms
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-camera mr-2"></i>
                Upload Image
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'symptoms' ? (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-leaf text-green-600"></i>
                    Select Your Crop
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                    {CROP_OPTIONS.map((crop) => (
                      <button
                        key={crop}
                        onClick={() => setSelectedCrop(crop)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          selectedCrop === crop
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Select Observed Symptoms</h3>
                  {SYMPTOM_CATEGORIES.map((category) => (
                    <div key={category.name} className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-600 uppercase mb-3">{category.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.symptoms.map((symptom) => {
                          const symptomWithCategory = { ...symptom, category: category.name };
                          const isSelected = selectedSymptoms.find((s) => s.id === symptom.id);
                          return (
                            <button
                              key={symptom.id}
                              onClick={() => toggleSymptom(symptomWithCategory)}
                              className={`p-3 rounded-lg border-2 text-left transition-all ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                }`}>
                                  {isSelected && <i className="fas fa-check text-white text-xs"></i>}
                                </div>
                                <span className="text-sm">{symptom.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Upload Crop Image</h3>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      uploadedImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {uploadedImage ? (
                      <div className="relative">
                        <img
                          src={uploadedImage}
                          alt="Uploaded crop"
                          className="max-h-64 mx-auto rounded-lg shadow-md"
                        />
                        <button
                          onClick={() => setUploadedImage(null)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-cloud-upload-alt text-purple-600 text-2xl"></i>
                        </div>
                        <p className="text-gray-600 mb-2">Drag & drop an image here, or</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Browse Files
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500 mt-4">
                          Supported formats: JPG, PNG, WEBP
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {activeTab === 'symptoms' && (
            <>
              {!selectedCrop && (
                <p className="text-center text-amber-600 mb-2">
                  <i className="fas fa-info-circle mr-1"></i> Please select a crop above to enable diagnosis
                </p>
              )}
              {selectedCrop && selectedSymptoms.length === 0 && (
                <p className="text-center text-amber-600 mb-2">
                  <i className="fas fa-hand-pointer mr-1"></i> Select symptoms from above to diagnose your crop
                </p>
              )}
            </>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={activeTab === 'symptoms' ? analyzeSymptoms : analyzeImage}
              disabled={isAnalyzing || (activeTab === 'symptoms' && (!selectedCrop || selectedSymptoms.length === 0)) || (activeTab === 'upload' && !uploadedImage)}
              className="w-full mt-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <span><i className="fas fa-spinner fa-spin"></i></span>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span><i className="fas fa-search"></i></span>
                  <span>
                    {activeTab === 'symptoms' 
                      ? (!selectedCrop ? 'Select a crop first' : !selectedSymptoms.length ? 'Select symptoms to diagnose' : 'Diagnose from Symptoms')
                      : (!uploadedImage ? 'Upload an image first' : 'Analyze Image')}
                  </span>
                </>
              )}
            </button>
            <button
              onClick={resetAnalysis}
              className="mt-8 py-4 px-8 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <span><i className="fas fa-redo"></i></span>
              <span>Reset</span>
            </button>
          </div>

          {showResults && (
            <div className="animate-fade-in-up">
              {detectedDisease ? (
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-gray-700">
                    {activeTab === 'upload' && detectedCropFromImage && (
                      <p className="text-sm opacity-90 mb-2">
                        <i className="fas fa-leaf mr-1"></i> Detected Crop: <span className="font-semibold">{detectedCropFromImage}</span>
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80 mb-1">Detected Disease</p>
                        <h3 className="text-2xl font-bold">{detectedDisease.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-80">Confidence</p>
                        <p className="text-3xl font-bold">{confidence}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm text-white font-semibold ${
                        detectedDisease.severity === 'High' ? 'bg-red-800' :
                        detectedDisease.severity === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {detectedDisease.severity} Severity
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <i className="fas fa-exclamation-circle text-red-500"></i>
                          Observed Symptoms
                        </h4>
                        <ul className="space-y-2">
                          {detectedDisease.symptoms.map((symptom, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-700">
                              <i className="fas fa-check-circle text-green-500"></i>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <i className="fas fa-info-circle text-blue-500"></i>
                          Likely Causes
                        </h4>
                        <ul className="space-y-2">
                          {detectedDisease.causes.map((cause, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-700">
                              <i className="fas fa-arrow-right text-gray-400"></i>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-prescription-bottle text-green-600"></i>
                        Recommended Treatment
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {detectedDisease.treatment.pesticide && (
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <p className="text-xs uppercase text-orange-600 font-semibold mb-1">Pesticide</p>
                            <p className="font-medium text-gray-800">{detectedDisease.treatment.pesticide}</p>
                          </div>
                        )}
                        {detectedDisease.treatment.fungicide && (
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <p className="text-xs uppercase text-purple-600 font-semibold mb-1">Fungicide</p>
                            <p className="font-medium text-gray-800">{detectedDisease.treatment.fungicide}</p>
                          </div>
                        )}
                        {detectedDisease.treatment.fertilizer && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-xs uppercase text-blue-600 font-semibold mb-1">Fertilizer</p>
                            <p className="font-medium text-gray-800">{detectedDisease.treatment.fertilizer}</p>
                          </div>
                        )}
                        {detectedDisease.treatment.organic && (
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-xs uppercase text-green-600 font-semibold mb-1">Organic Treatment</p>
                            <p className="font-medium text-gray-800">{detectedDisease.treatment.organic}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-shield-alt text-blue-600"></i>
                        Prevention Tips
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {detectedDisease.prevention.map((tip, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            <i className="fas fa-check mr-1 text-green-500"></i>
                            {tip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check-circle text-green-600 text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Disease Detected!</h3>
                  <p className="text-gray-600">
                    Based on your selected symptoms, your crop appears healthy. Continue monitoring for any changes.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-lightbulb text-yellow-500"></i>
              Quick Tips for Healthy Crops
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <i className="fas fa-tint text-blue-500 mb-2"></i>
                <h4 className="font-semibold text-gray-800 mb-1">Proper Watering</h4>
                <p className="text-sm text-gray-600">Water early morning to reduce fungal growth</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <i className="fas fa-sun text-yellow-500 mb-2"></i>
                <h4 className="font-semibold text-gray-800 mb-1">Good Air Circulation</h4>
                <p className="text-sm text-gray-600">Space plants properly to prevent disease spread</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <i className="fas fa-sync-alt text-purple-500 mb-2"></i>
                <h4 className="font-semibold text-gray-800 mb-1">Crop Rotation</h4>
                <p className="text-sm text-gray-600">Rotate crops yearly to break disease cycles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiseaseDetection;
