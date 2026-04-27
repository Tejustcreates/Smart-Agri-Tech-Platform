import React from 'react';
import { Section, Equipment, Fertilizer, Seed, Pesticide, Product, CartItem } from '../types';
import wheatImg from '../img/wheat seeds.jpg';

interface AgriMarketProps {
    onAddToCart: (product: Product, type: CartItem['type']) => void;
}

const EQUIPMENTS_DATA: Equipment[] = [
  {
    id: 1,
    name: 'Tractor',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/5/310928279/SK/RW/UH/46205119/50hp-preet-955-2wd-tractor-1000x1000.jpg',
    description: 'Powerful tractor for plowing and other heavy-duty tasks. 50 HP.',
    rentPerDay: 2500,
    available: true,
  },
  {
    id: 2,
    name: 'Harvester',
    image: 'https://www.estesperformanceconcaves.com/wp-content/uploads/2020/07/auger-platforms-R4D012314-1366x768-1.jpg',
    description: 'Combine harvester for efficient reaping, threshing, and winnowing.',
    rentPerDay: 5000,
    available: false,
  },
  {
    id: 3,
    name: 'Rotavator',
    image: 'https://img.agriexpo.online/images_ag/photo-g/178897-16664336.jpg',
    description: 'Used for soil preparation by mixing and pulverizing the soil.',
    rentPerDay: 1500,
    available: true,
  },
    {
    id: 4,
    name: 'Sprayer',
    image: 'https://5.imimg.com/data5/ST/EC/MY-1263483/seed-drills-1000x1000.jpg',
    description: 'For spraying pesticides, herbicides, and fertilizers on crops.',
    rentPerDay: 800,
    available: true,
  },
];

const FERTILIZERS_DATA: Fertilizer[] = [
    { id: 1, name: 'Urea Fertilizer', image: 'https://gogarden.co.in/cdn/shop/files/71yg6hRnpTL._SL1200_fac2b8e7-208b-482d-9493-07d03daaff6f.jpg?v=1741858085', description: 'High nitrogen content for lush green growth. Ideal for all crops.', pricePerBag: 300, brand: 'IFFCO' },
    { id: 2, name: 'DAP Fertilizer', image: 'https://m.media-amazon.com/images/I/51b0rRlEqFL._AC_SY400_.jpg', description: 'Rich in phosphorus, essential for root development and flowering.', pricePerBag: 1200, brand: 'NFL' },
    { id: 3, name: 'Organic Manure', image: 'https://organicbazar.net/cdn/shop/files/vermicompost_5kg_Organic_Bazar_fertilizer_organic_fertilizers_vermi_compost_kenchua_khaad_vermicompost_5kg.jpg', description: 'Composted manure to improve soil health and fertility naturally.', pricePerBag: 400, brand: 'FarmFresh' },
    { id: 4, name: 'Potash Fertilizer', image: 'https://m.media-amazon.com/images/I/51tMaq5qlCL._AC_SY400_.jpg', description: 'Enhances plant immunity and improves fruit quality and size.', pricePerBag: 950, brand: 'KRIBHCO' },
];

const SEEDS_DATA: Seed[] = [
    { id: 1, name: 'HD-3085 Wheat Seeds', image: wheatImg, description: 'High-yield, disease-resistant wheat seeds suitable for the Rabi season.', pricePerKg: 850, brand: 'Nirmal Seeds' },
    { id: 2, name: 'Basmati Rice Seeds', image: 'https://images.pexels.com/photos/1556410/pexels-photo-1556410.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Premium quality seeds for aromatic, long-grain Basmati rice.', pricePerKg: 650, brand: 'Kaveri Seeds' },
    { id: 3, name: 'Bollgard Cotton Seeds', image: 'https://images.pexels.com/photos/59321/pexels-photo-59321.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Genetically modified seeds for high yield and resistance to bollworms.', pricePerKg: 1200, brand: 'Mahyco' },
    { id: 4, name: 'Hybrid Vegetable Seeds', image: 'https://images.pexels.com/photos/1029045/pexels-photo-1029045.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'A variety pack of high-quality hybrid seeds for vegetables like tomatoes and peppers.', pricePerKg: 150, brand: 'Namdhari' },
];

const PESTICIDES_DATA: Pesticide[] = [
    { id: 1, name: 'Neem-Based Bio Pesticide', image: 'https://images.pexels.com/photos/4032585/pexels-photo-4032585.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Organic and eco-friendly solution for controlling aphids and mealybugs.', pricePerLiter: 350, brand: 'BioCare' },
    { id: 2, name: 'Crop Shield Insecticide', image: 'https://images.pexels.com/photos/5546261/pexels-photo-5546261.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Broad-spectrum insecticide for effective control of bollworms and mites.', pricePerLiter: 450, brand: 'AgroProtect' },
    { id: 3, name: 'FungiCure Fungicide', image: 'https://images.pexels.com/photos/7163953/pexels-photo-7163953.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Protects crops from fungal diseases like rust, mildew, and blight.', pricePerLiter: 600, brand: 'CropGuard' },
    { id: 4, name: 'WeedOut Herbicide', image: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Selective herbicide to control broadleaf weeds without harming the main crop.', pricePerLiter: 520, brand: 'WeedControl' },
];


const AgriMarket: React.FC<AgriMarketProps> = ({ onAddToCart }) => {
  const renderSection = (title: string, children: React.ReactNode) => (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-green-600 pl-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {children}
      </div>
    </div>
  );

  return (
    <section id={Section.AGRI_MARKET} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800">
            Agri-<span className="text-green-600">Market</span> Hub
          </h2>
          <p className="text-gray-600 mt-4">Your one-stop shop for all agricultural needs.</p>
        </div>

        {renderSection('Equipment Rentals', EQUIPMENTS_DATA.map((equipment) => (
          <div key={equipment.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
            <img src={equipment.image} alt={equipment.name} className="h-48 w-full object-cover"/>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{equipment.name}</h3>
              <p className="text-gray-700 text-sm leading-relaxed h-20 overflow-hidden flex-grow">{equipment.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-green-600">₹{equipment.rentPerDay}/day</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${equipment.available ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {equipment.available ? 'Available' : 'Rented'}
                </span>
              </div>
              <button onClick={() => onAddToCart(equipment, 'Equipment')} className={`w-full mt-4 py-2 text-white rounded-lg transition-colors ${equipment.available ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`} disabled={!equipment.available}>
                  <i className="fas fa-cart-plus mr-2"></i>Add to Cart
              </button>
            </div>
          </div>
        )))}

        {renderSection('Fertilizers', FERTILIZERS_DATA.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <img src={item.image} alt={item.name} className="h-48 w-full object-cover"/>
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-xs uppercase font-semibold">{item.brand}</p>
                    <p className="text-gray-700 text-sm leading-relaxed h-20 overflow-hidden flex-grow mt-2">{item.description}</p>
                    <div className="text-lg font-bold text-green-600 mt-4">₹{item.pricePerBag}/bag</div>
                    <button onClick={() => onAddToCart(item, 'Fertilizer')} className="w-full mt-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-colors">
                        <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        )))}

        {renderSection('Seeds', SEEDS_DATA.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <img src={item.image} alt={item.name} className="h-48 w-full object-cover"/>
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-xs uppercase font-semibold">{item.brand}</p>
                    <p className="text-gray-700 text-sm leading-relaxed h-20 overflow-hidden flex-grow mt-2">{item.description}</p>
                    <div className="text-lg font-bold text-green-600 mt-4">₹{item.pricePerKg}/kg</div>
                    <button onClick={() => onAddToCart(item, 'Seed')} className="w-full mt-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-colors">
                        <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        )))}

        {renderSection('Pesticides', PESTICIDES_DATA.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <img src={item.image} alt={item.name} className="h-48 w-full object-cover"/>
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-xs uppercase font-semibold">{item.brand}</p>
                    <p className="text-gray-700 text-sm leading-relaxed h-20 overflow-hidden flex-grow mt-2">{item.description}</p>
                    <div className="text-lg font-bold text-green-600 mt-4">₹{item.pricePerLiter}/liter</div>
                    <button onClick={() => onAddToCart(item, 'Pesticide')} className="w-full mt-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-colors">
                        <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        )))}

      </div>
    </section>
  );
};

export default AgriMarket;