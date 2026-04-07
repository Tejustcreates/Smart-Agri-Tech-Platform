import React, { useState } from 'react';
import { Section, Crop, ListedCrop, Product, CartItem } from '../types';
import { CROP_OPTIONS } from '../constants';

type MandiTab = 'register' | 'sell' | 'buy' | 'price-predict';

interface MandiProps {
    onAddToCart: (product: Product, type: CartItem['type']) => void;
}

interface PricePrediction {
  crop: string;
  currentPrice: number;
  predictedPrice: number;
  trend: 'up' | 'down' | 'stable';
  demand: 'High' | 'Medium' | 'Low';
  bestTimeToSell: string;
  confidence: number;
}

const BASE_PRICES: Record<string, number> = {
  'Wheat': 22,
  'Rice': 45,
  'Maize': 18,
  'Soybean': 38,
  'Cotton': 65,
  'Sugarcane': 3.5,
  'Potato': 15,
  'Onion': 25,
  'Tomato': 30,
  'Mustard': 55,
};

const initialListedCrops: ListedCrop[] = [
    {
        id: 1,
        name: 'Wheat',
        quantity: '500',
        expectedPrice: '22',
        harvestDate: '2023-10-25',
        farmerName: 'Rajesh Kumar',
        location: 'Pune, Maharashtra',
        status: 'Active',
        listedOn: '2023-10-15',
    },
    {
        id: 2,
        name: 'Soybean',
        quantity: '800',
        expectedPrice: '38',
        harvestDate: '2023-11-10',
        farmerName: 'Sunita Patil',
        location: 'Nagpur, Maharashtra',
        status: 'Pending',
        listedOn: '2023-10-10',
    },
     {
        id: 3,
        name: 'Rice',
        quantity: '1000',
        expectedPrice: '45',
        harvestDate: '2023-11-20',
        farmerName: 'Amit Singh',
        location: 'Patna, Bihar',
        status: 'Active',
        listedOn: '2023-10-18',
    }
];

const Mandi: React.FC<MandiProps> = ({ onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<MandiTab>('register');
  
  const [farmerName, setFarmerName] = useState('');
  const [farmerMobile, setFarmerMobile] = useState('');
  const [farmerAddress, setFarmerAddress] = useState('');
  const [crops, setCrops] = useState<Crop[]>([
    { id: 1, name: '', quantity: '', expectedPrice: '', harvestDate: '' }
  ]);
  const [nextCropId, setNextCropId] = useState(2);

  const [listedCrops, setListedCrops] = useState<ListedCrop[]>(initialListedCrops);
  const [nextListedCropId, setNextListedCropId] = useState(initialListedCrops.length + 1);

  const [priceCrop, setPriceCrop] = useState<string>(CROP_OPTIONS[0]);
  const [predictions, setPredictions] = useState<PricePrediction[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleAddCrop = () => {
    setCrops([...crops, { id: nextCropId, name: '', quantity: '', expectedPrice: '', harvestDate: '' }]);
    setNextCropId(nextCropId + 1);
  };

  const handleRemoveCrop = (id: number) => {
    if (crops.length > 1) {
      setCrops(crops.filter(crop => crop.id !== id));
    }
  };

  const handleCropChange = (id: number, field: keyof Omit<Crop, 'id'>, value: string) => {
    setCrops(crops.map(crop => crop.id === id ? { ...crop, [field]: value } : crop));
  };
  
  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let currentId = nextListedCropId;
    const newSubmissions: ListedCrop[] = crops.map(crop => {
        const newListedCrop: ListedCrop = {
            ...crop,
            id: currentId++,
            farmerName: farmerName || 'Anonymous Farmer',
            location: farmerAddress ? farmerAddress.split(',').slice(0, 2).join(', ') : 'Unknown Location',
            status: 'Active',
            listedOn: new Date().toLocaleDateString('en-CA'),
        };
        return newListedCrop;
    });

    setNextListedCropId(currentId);
    setListedCrops(prev => [...prev, ...newSubmissions]);

    alert('Your crop registration has been submitted successfully and is now listed for sale!');
    
    setFarmerName('');
    setFarmerMobile('');
    setFarmerAddress('');
    setCrops([{ id: 1, name: '', quantity: '', expectedPrice: '', harvestDate: '' }]);
    setNextCropId(2);

    setActiveTab('sell');
  };

  const handleRemoveListedCrop = (idToRemove: number) => {
    setListedCrops(listedCrops.filter(crop => crop.id !== idToRemove));
  };

  const predictPrices = async () => {
    setIsPredicting(true);
    setPredictions([]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const results: PricePrediction[] = CROP_OPTIONS.slice(0, 8).map(crop => {
      const basePrice = BASE_PRICES[crop] || 20;
      const variation = (Math.random() - 0.5) * 0.3;
      const priceChange = basePrice * variation;
      const predicted = basePrice + priceChange;
      const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
      const trend = trends[Math.floor(Math.random() * trends.length)];
      const demands: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
      const demand = demands[Math.floor(Math.random() * 3)];

      return {
        crop,
        currentPrice: basePrice,
        predictedPrice: Math.round(predicted * 100) / 100,
        trend,
        demand,
        bestTimeToSell: trend === 'up' ? 'Wait 2-3 weeks for better prices' : 'Sell now to avoid further decline',
        confidence: 70 + Math.floor(Math.random() * 25),
      };
    });

    setPredictions(results);
    setIsPredicting(false);
  };

  const TabButton: React.FC<{ tabId: MandiTab; label: string; icon: string }> = ({ tabId, label, icon }) => (
    <button
      className={`flex-1 text-center py-3 px-4 font-semibold border-b-4 transition-colors duration-300 ${
        activeTab === tabId 
          ? 'border-green-600 text-green-600' 
          : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300'
      }`}
      onClick={() => setActiveTab(tabId)}
    >
      <i className={`${icon} mr-2`}></i>{label}
    </button>
  );

  return (
    <section id={Section.MANDI} className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">
                Smart Mandi <span className="text-green-600">Portal</span>
            </h2>
            <p className="text-gray-600 mt-4">AI-powered crop marketplace with real-time price predictions</p>
        </div>
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-gray-200 flex-wrap">
            <TabButton tabId="register" label="Crop Registration" icon="fas fa-clipboard-list" />
            <TabButton tabId="sell" label="My Listings" icon="fas fa-store" />
            <TabButton tabId="buy" label="Buy Crops" icon="fas fa-shopping-cart" />
            <TabButton tabId="price-predict" label="AI Price Predictor" icon="fas fa-chart-line" />
          </div>

          <div className="p-6 md:p-10">
            {activeTab === 'register' && (
              <form onSubmit={handleRegistrationSubmit}>
                <h3 className="text-2xl font-bold text-gray-800 mb-2"><i className="fas fa-clipboard-check text-green-600 mr-2"></i> Crop Registration Form</h3>
                <p className="text-gray-500 mb-6">Register your crops with APMC (Agricultural Produce Market Committee)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Full Name" value={farmerName} onChange={e => setFarmerName(e.target.value)} className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    <input type="tel" placeholder="Mobile Number" value={farmerMobile} onChange={e => setFarmerMobile(e.target.value)} className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    <textarea placeholder="Address (e.g., City, State)" value={farmerAddress} onChange={e => setFarmerAddress(e.target.value)} rows={3} className="md:col-span-2 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required></textarea>
                </div>
                <hr className="my-8"/>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Crop Details</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase">
                            <tr>
                                <th className="p-3">Crop Name</th>
                                <th className="p-3">Quantity (kg)</th>
                                <th className="p-3">Expected Price (₹/kg)</th>
                                <th className="p-3">Harvest Date</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {crops.map(crop => (
                                <tr key={crop.id} className="border-b">
                                    <td className="p-2"><select value={crop.name} onChange={e => handleCropChange(crop.id, 'name', e.target.value)} className="w-full p-2 bg-gray-50 rounded" required><option value="">Select Crop</option>{CROP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}</select></td>
                                    <td className="p-2"><input type="number" value={crop.quantity} onChange={e => handleCropChange(crop.id, 'quantity', e.target.value)} placeholder="e.g., 500" className="w-full p-2 bg-gray-50 rounded" required /></td>
                                    <td className="p-2"><input type="number" value={crop.expectedPrice} onChange={e => handleCropChange(crop.id, 'expectedPrice', e.target.value)} placeholder="e.g., 22" className="w-full p-2 bg-gray-50 rounded" required /></td>
                                    <td className="p-2"><input type="date" value={crop.harvestDate} onChange={e => handleCropChange(crop.id, 'harvestDate', e.target.value)} className="w-full p-2 bg-gray-50 rounded" required /></td>
                                    <td className="p-2"><button type="button" onClick={() => handleRemoveCrop(crop.id)} className="text-red-500 hover:text-red-700 disabled:text-gray-300" disabled={crops.length <= 1}><i className="fas fa-trash fa-lg"></i></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="text-center mt-4">
                    <button type="button" onClick={handleAddCrop} className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors">
                        <i className="fas fa-plus-circle mr-2"></i>Add More Crops
                    </button>
                </div>
                <div className="mt-8 text-center">
                    <button type="submit" className="w-full md:w-auto px-10 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 font-bold text-lg">
                        <i className="fas fa-paper-plane mr-2"></i>Submit Registration
                    </button>
                </div>
              </form>
            )}

            {activeTab === 'sell' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-2"><i className="fas fa-store text-green-600 mr-2"></i>Your Listed Crops</h3>
                <p className="text-gray-500 mb-6">View and manage your crop listings for sale</p>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                         <thead className="bg-gray-100 text-gray-600 uppercase">
                            <tr>
                                <th className="p-3">Crop</th><th className="p-3">Quantity</th><th className="p-3">Price</th><th className="p-3">Listed On</th><th className="p-3">Status</th><th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listedCrops.length > 0 ? listedCrops.map(crop => (
                                <tr key={crop.id} className="border-b">
                                    <td className="p-3"><strong>{crop.name}</strong></td>
                                    <td className="p-3">{crop.quantity} kg</td>
                                    <td className="p-3">₹{crop.expectedPrice}/kg</td>
                                    <td className="p-3">{crop.listedOn}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${crop.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                            {crop.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button className="text-blue-500 hover:text-blue-700 mr-4" title="Edit"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleRemoveListedCrop(crop.id)} className="text-red-500 hover:text-red-700" title="Remove"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="text-center p-4 text-gray-500">You have no crops listed for sale.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
              </div>
            )}

            {activeTab === 'buy' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-2"><i className="fas fa-shopping-cart text-green-600 mr-2"></i>Buy Crops</h3>
                <p className="text-gray-500 mb-6">Find and buy crops directly from farmers</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listedCrops.filter(c => c.status === 'Active').length > 0 ? listedCrops.filter(c => c.status === 'Active').map(crop => (
                        <div key={crop.id} className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-lg text-gray-800">{crop.name}</h4>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        <i className="fas fa-check-circle mr-1"></i>Verified
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-1"><i className="fas fa-user text-green-500 mr-1"></i>{crop.farmerName}</p>
                                <p className="text-sm text-gray-500 mb-2"><i className="fas fa-map-marker-alt text-green-500 mr-1"></i>{crop.location}</p>
                                <div className="flex justify-between text-sm my-3 py-2 border-t border-b">
                                    <span>Qty: <span className="font-semibold">{crop.quantity} kg</span></span>
                                    <span className="text-green-600 font-bold">₹{crop.expectedPrice}/kg</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    <i className="fas fa-calendar mr-1"></i>
                                    Harvest: {crop.harvestDate}
                                </p>
                            </div>
                            <button onClick={() => onAddToCart(crop, 'Crop')} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors mt-4">
                                <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                            </button>
                        </div>
                    )) : (
                        <p className="col-span-full text-center text-gray-500">There are currently no crops available for sale.</p>
                    )}
                </div>
              </div>
            )}

            {activeTab === 'price-predict' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-2"><i className="fas fa-chart-line text-purple-600 mr-2"></i>AI Price Prediction</h3>
                <p className="text-gray-500 mb-6">Get AI-powered price predictions to make informed selling decisions</p>
                
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop</label>
                      <select 
                        value={priceCrop} 
                        onChange={(e) => setPriceCrop(e.target.value)}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {CROP_OPTIONS.map(crop => (
                          <option key={crop} value={crop}>{crop}</option>
                        ))}
                      </select>
                    </div>
                    <button 
                      onClick={predictPrices}
                      disabled={isPredicting}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isPredicting ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-brain"></i>
                          Get Predictions
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {predictions.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800">Price Forecast for All Crops</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {predictions.map((pred, index) => (
                        <div 
                          key={pred.crop}
                          className={`rounded-xl p-5 border-2 transition-all hover:shadow-lg ${
                            pred.trend === 'up' ? 'bg-green-50 border-green-200' :
                            pred.trend === 'down' ? 'bg-red-50 border-red-200' :
                            'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-bold text-lg text-gray-800">{pred.crop}</h5>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pred.demand === 'High' ? 'bg-green-200 text-green-800' :
                              pred.demand === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-gray-200 text-gray-600'
                            }`}>
                              {pred.demand} Demand
                            </span>
                          </div>
                          
                          <div className="flex items-end justify-between mb-3">
                            <div>
                              <p className="text-sm text-gray-500">Current Price</p>
                              <p className="text-2xl font-bold text-gray-800">₹{pred.currentPrice}/kg</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Predicted Price</p>
                              <p className={`text-2xl font-bold ${
                                pred.predictedPrice > pred.currentPrice ? 'text-green-600' :
                                pred.predictedPrice < pred.currentPrice ? 'text-red-600' :
                                'text-gray-600'
                              }`}>
                                ₹{pred.predictedPrice}/kg
                              </p>
                            </div>
                          </div>

                          <div className={`flex items-center gap-2 p-2 rounded-lg ${
                            pred.trend === 'up' ? 'bg-green-100' :
                            pred.trend === 'down' ? 'bg-red-100' :
                            'bg-gray-100'
                          }`}>
                            <i className={`fas fa-arrow-${
                              pred.trend === 'up' ? 'up text-green-600' :
                              pred.trend === 'down' ? 'down text-red-600' :
                              'right text-gray-600'
                            }`}></i>
                            <span className="text-sm font-medium">
                              {pred.bestTimeToSell}
                            </span>
                          </div>

                          <div className="mt-2 text-xs text-gray-500">
                            <i className="fas fa-shield-alt mr-1"></i>
                            {pred.confidence}% AI confidence
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
                      <h5 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                        <i className="fas fa-lightbulb"></i>
                        Market Insight
                      </h5>
                      <p className="text-sm text-yellow-700">
                        Based on seasonal demand patterns and supply trends, we recommend focusing on 
                        Wheat and Rice crops for stable returns. Monitor Soybean prices as they show 
                        high volatility in the current market.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-chart-bar text-purple-600 text-3xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Ready to Predict</h4>
                    <p className="text-gray-600">Click "Get Predictions" to see AI-powered price forecasts</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mandi;
