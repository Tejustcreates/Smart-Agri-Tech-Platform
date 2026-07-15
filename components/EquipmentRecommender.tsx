import React, { useState } from 'react';

interface EquipmentRecommendation {
  name: string;
  image: string;
  rentPerDay: number;
  reason: string;
  suitability: string;
  recommended: boolean;
}

const EQUIPMENT_DB: Record<string, { rent: number; image: string; bestFor: string; landRange: string }> = {
  'Mini Tractor (20HP)': { rent: 1500, image: 'https://images.pexels.com/photos/162639/agriculture-field-harvest-grain-162639.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Small plots, vegetable farms', landRange: '1-5 acres' },
  'Standard Tractor (50HP)': { rent: 2500, image: 'https://images.pexels.com/photos/162639/agriculture-field-harvest-grain-162639.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Medium farms, plowing', landRange: '5-25 acres' },
  'Heavy Tractor (75HP)': { rent: 4000, image: 'https://images.pexels.com/photos/162639/agriculture-field-harvest-grain-162639.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Large farms, heavy duty', landRange: '25+ acres' },
  'Rotavator': { rent: 1500, image: 'https://images.pexels.com/photos/5638268/pexels-photo-5638268.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Soil preparation, mixing', landRange: 'All sizes' },
  'Seed Drill': { rent: 1200, image: 'https://images.pexels.com/photos/5638268/pexels-photo-5638268.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Sowing seeds uniformly', landRange: 'All sizes' },
  'Sprayer (Power)': { rent: 800, image: 'https://images.pexels.com/photos/4513940/pexels-photo-4513940.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Pesticide/fertilizer spray', landRange: 'All sizes' },
  'Harvester': { rent: 5000, image: 'https://images.pexels.com/photos/162639/agriculture-field-harvest-grain-162639.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Harvesting grains', landRange: '10+ acres' },
  'Thresher': { rent: 1000, image: 'https://images.pexels.com/photos/5638268/pexels-photo-5638268.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Separating grain from straw', landRange: 'All sizes' },
  'Plough': { rent: 600, image: 'https://images.pexels.com/photos/5638268/pexels-photo-5638268.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Initial plowing', landRange: 'All sizes' },
  'Transplanter (Rice)': { rent: 2000, image: 'https://images.pexels.com/photos/5638268/pexels-photo-5638268.jpeg?auto=compress&cs=tinysrgb&w=600', bestFor: 'Rice seedling transplanting', landRange: '5+ acres' },
};

const CROPS_FOR_EQUIPMENT: Record<string, string[]> = {
  'Wheat': ['Standard Tractor (50HP)', 'Seed Drill', 'Harvester', 'Thresher'],
  'Rice': ['Heavy Tractor (75HP)', 'Rotavator', 'Transplanter (Rice)', 'Harvester'],
  'Cotton': ['Standard Tractor (50HP)', 'Sprayer (Power)', 'Plough'],
  'Sugarcane': ['Heavy Tractor (75HP)', 'Plough', 'Harvester'],
  'Maize': ['Standard Tractor (50HP)', 'Seed Drill', 'Harvester'],
  'Potato': ['Mini Tractor (20HP)', 'Plough', 'Harvester'],
  'Soybean': ['Standard Tractor (50HP)', 'Seed Drill', 'Harvester'],
  'Onion': ['Mini Tractor (20HP)', 'Plough', 'Sprayer (Power)'],
};

const SEASON_EQUIPMENT: Record<string, string[]> = {
  'Kharif (Monsoon)': ['Mini Tractor (20HP)', 'Rotavator', 'Transplanter (Rice)', 'Sprayer (Power)'],
  'Rabi (Winter)': ['Standard Tractor (50HP)', 'Seed Drill', 'Sprayer (Power)', 'Harvester'],
  'Zaid (Summer)': ['Mini Tractor (20HP)', 'Thresher', 'Sprayer (Power)'],
};

const EquipmentRecommender: React.FC<{ onAddToCart: (product: any, type: any) => void }> = ({ onAddToCart }) => {
  const [landSize, setLandSize] = useState<number>(5);
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [selectedSeason, setSelectedSeason] = useState<string>('Kharif (Monsoon)');
  const [recommendations, setRecommendations] = useState<EquipmentRecommendation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const getRecommendations = () => {
    setHasSearched(true);
    const results: EquipmentRecommendation[] = [];

    const cropEquipment = CROPS_FOR_EQUIPMENT[selectedCrop] || [];
    const seasonEquipment = SEASON_EQUIPMENT[selectedSeason] || [];

    const combined = [...new Set([...cropEquipment, ...seasonEquipment])];

    combined.forEach((equipmentName) => {
      const data = EQUIPMENT_DB[equipmentName];
      if (data) {
        const isRecommended = landSize >= 5 && landSize <= 25 ? true : landSize < 5;
        
        let reason = '';
        if (cropEquipment.includes(equipmentName)) {
          reason += `Best for ${selectedCrop} cultivation. `;
        }
        if (seasonEquipment.includes(equipmentName)) {
          reason += `Recommended for ${selectedSeason} season. `;
        }
        reason += data.bestFor;

        results.push({
          name: equipmentName,
          image: data.image,
          rentPerDay: data.rent,
          reason: reason.trim(),
          suitability: data.landRange,
          recommended: isRecommended,
        });
      }
    });

    results.sort((a, b) => {
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;
      return 0;
    });

    setRecommendations(results);
  };

  return (
    <section id="equipment-recommender" className="py-16 md:py-24 bg-gradient-to-b from-orange-50/40 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <i className="fas fa-tractor text-xs"></i>
            Equipment Rental
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Smart Equipment <span className="text-green-600">Rental</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">Find the right farming equipment based on your land size and crops</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fas fa-tractor text-orange-600"></i>
            Enter Your Farm Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Land Size (Acres)</label>
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={landSize}
                onChange={(e) => {
                const val = parseFloat(e.target.value);
                setLandSize(isNaN(val) ? 5 : Math.min(100, Math.max(0.5, val)));
              }}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5</span>
                <span className="font-semibold text-orange-600">{landSize} acres</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Object.keys(CROPS_FOR_EQUIPMENT).map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Object.keys(SEASON_EQUIPMENT).map((season) => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={getRecommendations}
            className="w-full mt-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-search"></i>
            Get Equipment Recommendations
          </button>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-check-circle text-green-600"></i>
              Recommended Equipment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((equip, index) => (
                <div
                  key={equip.name}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                    equip.recommended ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <div className="relative">
                    <img src={equip.image} alt={equip.name} className="w-full h-40 object-cover" />
                    {equip.recommended && (
                      <span className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        <i className="fas fa-star mr-1"></i>Recommended
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-bold text-lg text-gray-800 mb-1">{equip.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">
                      <i className="fas fa-th-large mr-1"></i>
                      {equip.suitability}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{equip.reason}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Rent per day</p>
                        <p className="text-xl font-bold text-orange-600">₹{equip.rentPerDay}</p>
                      </div>
                      <button
                        onClick={() => onAddToCart({ id: index, name: equip.name, rentPerDay: equip.rentPerDay, image: equip.image }, 'Equipment')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                      >
                        <i className="fas fa-cart-plus mr-1"></i>
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-6 mt-8">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-lightbulb text-orange-600"></i>
                Pro Tips for Your {landSize}-Acre Farm
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-1">Timing Matters</p>
                  <p className="text-sm text-gray-600">Book equipment 2-3 weeks in advance during peak season to ensure availability.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-1">Cost Optimization</p>
                  <p className="text-sm text-gray-600">For {landSize} acres, renting for 2-3 days is usually sufficient. Avoid over-hiring.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-tractor text-orange-600 text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Get Smart Recommendations</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter your farm details above to receive smart equipment recommendations tailored to your needs
            </p>
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fas fa-info-circle text-blue-600"></i>
            Equipment Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Tractors</h4>
              <p className="text-sm text-gray-600">Choose based on land size: Mini for small plots, Standard for medium, Heavy for large farms.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Harvesting Equipment</h4>
              <p className="text-sm text-gray-600">Most efficient for farms over 10 acres. Saves 70% time compared to manual harvesting.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Sprayers</h4>
              <p className="text-sm text-gray-600">Essential for pesticide application. Power sprayers cover 5x more area than manual.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentRecommender;
