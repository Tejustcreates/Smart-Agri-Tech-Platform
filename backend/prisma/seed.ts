import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── Users ──────────────────────────────────────────────

  const farmerPassword = await bcrypt.hash('farmer123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const officerPassword = await bcrypt.hash('officer123', 10);

  const farmerPin = await bcrypt.hash('1234', 10);
  const adminPin = await bcrypt.hash('0001', 10);
  const officerPin = await bcrypt.hash('0002', 10);

  const farmer1 = await prisma.user.upsert({
    where: { mobileNumber: '9876543210' },
    update: { pinHash: farmerPin },
    create: {
      name: 'Rajesh Patil',
      mobileNumber: '9876543210',
      passwordHash: farmerPassword,
      pinHash: farmerPin,
      role: 'FARMER',
      preferredLanguage: 'hi',
      village: 'Wadgaon',
      taluka: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      landholdingSize: 3.5,
      farmerCategory: 'SMALL',
      isOnboarded: true,
    },
  });

  const farmer2 = await prisma.user.upsert({
    where: { mobileNumber: '9876543211' },
    update: { pinHash: farmerPin },
    create: {
      name: 'Suresh Kumar',
      mobileNumber: '9876543211',
      passwordHash: farmerPassword,
      pinHash: farmerPin,
      role: 'FARMER',
      preferredLanguage: 'en',
      village: 'Kondhwa',
      taluka: 'Pune',
      district: 'Pune',
      state: 'Maharashtra',
      landholdingSize: 8,
      farmerCategory: 'LARGE',
      isOnboarded: true,
    },
  });

  const farmer3 = await prisma.user.upsert({
    where: { mobileNumber: '9876543212' },
    update: { pinHash: farmerPin },
    create: {
      name: 'Priya Deshmukh',
      mobileNumber: '9876543212',
      passwordHash: farmerPassword,
      pinHash: farmerPin,
      role: 'FARMER',
      preferredLanguage: 'mr',
      village: 'Devgad',
      taluka: 'Devgad',
      district: 'Sindhudurg',
      state: 'Maharashtra',
      landholdingSize: 1.5,
      farmerCategory: 'MARGINAL',
      isOnboarded: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { mobileNumber: '9000000001' },
    update: { pinHash: adminPin },
    create: {
      name: 'Admin User',
      mobileNumber: '9000000001',
      passwordHash: adminPassword,
      pinHash: adminPin,
      role: 'ADMIN',
      preferredLanguage: 'en',
      district: 'Pune',
      state: 'Maharashtra',
      isOnboarded: true,
    },
  });

  const officer = await prisma.user.upsert({
    where: { mobileNumber: '9000000002' },
    update: { pinHash: officerPin },
    create: {
      name: 'Field Officer Sharma',
      mobileNumber: '9000000002',
      passwordHash: officerPassword,
      pinHash: officerPin,
      role: 'FIELD_OFFICER',
      preferredLanguage: 'en',
      district: 'Nashik',
      state: 'Maharashtra',
      isOnboarded: true,
    },
  });

  console.log('  ✅ Users created (3 farmers, 1 admin, 1 field officer)');

  // ─── Farms ──────────────────────────────────────────────

  const farm1 = await prisma.farm.create({
    data: {
      userId: farmer1.id,
      farmName: 'Patil Farm',
      areaAcres: 3.5,
      soilType: 'Black Cotton',
      latitude: 18.5204,
      longitude: 73.8567,
    },
  });

  const farm2 = await prisma.farm.create({
    data: {
      userId: farmer2.id,
      farmName: 'Kumar Agro Farm',
      areaAcres: 8,
      soilType: 'Red Soil',
      latitude: 18.4857,
      longitude: 73.8921,
    },
  });

  const farm3 = await prisma.farm.create({
    data: {
      userId: farmer3.id,
      farmName: 'Deshmukh Family Farm',
      areaAcres: 1.5,
      soilType: 'Laterite',
      latitude: 16.0,
      longitude: 73.5,
    },
  });

  // Crop records
  await prisma.cropRecord.createMany({
    data: [
      { farmId: farm1.id, cropName: 'Wheat', sowingDate: new Date('2025-11-15'), expectedHarvestDate: new Date('2026-03-15'), status: 'GROWING' },
      { farmId: farm1.id, cropName: 'Onion', sowingDate: new Date('2025-10-01'), expectedHarvestDate: new Date('2026-02-01'), status: 'HARVESTED' },
      { farmId: farm2.id, cropName: 'Sugarcane', sowingDate: new Date('2025-02-01'), expectedHarvestDate: new Date('2026-12-01'), status: 'GROWING' },
      { farmId: farm2.id, cropName: 'Soybean', sowingDate: new Date('2025-07-01'), expectedHarvestDate: new Date('2025-10-30'), status: 'HARVESTED' },
      { farmId: farm3.id, cropName: 'Rice', sowingDate: new Date('2025-06-15'), expectedHarvestDate: new Date('2025-11-15'), status: 'HARVESTED' },
      { farmId: farm3.id, cropName: 'Tomato', sowingDate: new Date('2025-09-01'), expectedHarvestDate: new Date('2026-01-15'), status: 'GROWING' },
    ],
  });

  console.log('  ✅ Farms and crop records created');

  // ─── Mandi Prices ───────────────────────────────────────

  const mandiData = [
    // Wheat across 3 mandis
    { cropName: 'Wheat', mandiName: 'Pune APMC', district: 'Pune', state: 'Maharashtra', pricePerQuintal: 2250, minPrice: 2100, maxPrice: 2400, priceDate: new Date() },
    { cropName: 'Wheat', mandiName: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', pricePerQuintal: 2180, minPrice: 2050, maxPrice: 2300, priceDate: new Date() },
    { cropName: 'Wheat', mandiName: 'Nagpur APMC', district: 'Nagpur', state: 'Maharashtra', pricePerQuintal: 2310, minPrice: 2200, maxPrice: 2450, priceDate: new Date() },
    // Rice across 3 mandis
    { cropName: 'Rice', mandiName: 'Pune APMC', district: 'Pune', state: 'Maharashtra', pricePerQuintal: 3200, minPrice: 3000, maxPrice: 3400, priceDate: new Date() },
    { cropName: 'Rice', mandiName: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', pricePerQuintal: 3150, minPrice: 2950, maxPrice: 3350, priceDate: new Date() },
    { cropName: 'Rice', mandiName: 'Nagpur APMC', district: 'Nagpur', state: 'Maharashtra', pricePerQuintal: 3300, minPrice: 3100, maxPrice: 3500, priceDate: new Date() },
    // Onion across 3 mandis
    { cropName: 'Onion', mandiName: 'Pune APMC', district: 'Pune', state: 'Maharashtra', pricePerQuintal: 1800, minPrice: 1500, maxPrice: 2100, priceDate: new Date() },
    { cropName: 'Onion', mandiName: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', pricePerQuintal: 1950, minPrice: 1700, maxPrice: 2200, priceDate: new Date() },
    { cropName: 'Onion', mandiName: 'Nagpur APMC', district: 'Nagpur', state: 'Maharashtra', pricePerQuintal: 1700, minPrice: 1400, maxPrice: 2000, priceDate: new Date() },
    // Sugarcane
    { cropName: 'Sugarcane', mandiName: 'Pune APMC', district: 'Pune', state: 'Maharashtra', pricePerQuintal: 310, minPrice: 290, maxPrice: 330, priceDate: new Date() },
    { cropName: 'Sugarcane', mandiName: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', pricePerQuintal: 305, minPrice: 285, maxPrice: 325, priceDate: new Date() },
    // Soybean
    { cropName: 'Soybean', mandiName: 'Pune APMC', district: 'Pune', state: 'Maharashtra', pricePerQuintal: 4200, minPrice: 4000, maxPrice: 4400, priceDate: new Date() },
    { cropName: 'Soybean', mandiName: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', pricePerQuintal: 4150, minPrice: 3950, maxPrice: 4350, priceDate: new Date() },
    { cropName: 'Soybean', mandiName: 'Nagpur APMC', district: 'Nagpur', state: 'Maharashtra', pricePerQuintal: 4300, minPrice: 4100, maxPrice: 4500, priceDate: new Date() },
    // Tomato
    { cropName: 'Tomato', mandiName: 'Pune APMC', district: 'Pune', state: 'Maharashtra', pricePerQuintal: 2500, minPrice: 2000, maxPrice: 3000, priceDate: new Date() },
    { cropName: 'Tomato', mandiName: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', pricePerQuintal: 2300, minPrice: 1800, maxPrice: 2800, priceDate: new Date() },
    // Potato
    { cropName: 'Potato', mandiName: 'Pune APMC', district: 'Pune', state: 'Maharashtra', pricePerQuintal: 1200, minPrice: 1000, maxPrice: 1400, priceDate: new Date() },
    { cropName: 'Potato', mandiName: 'Nagpur APMC', district: 'Nagpur', state: 'Maharashtra', pricePerQuintal: 1150, minPrice: 950, maxPrice: 1350, priceDate: new Date() },
  ];

  // Add some historical prices (past 30 days)
  const historicalPrices = [];
  for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    for (const base of mandiData.slice(0, 9)) {
      const variation = (Math.random() - 0.5) * base.pricePerQuintal * 0.1;
      historicalPrices.push({
        ...base,
        pricePerQuintal: Math.round(base.pricePerQuintal + variation),
        priceDate: date,
      });
    }
  }

  await prisma.mandiPrice.createMany({ data: [...mandiData, ...historicalPrices] });
  console.log(`  ✅ Mandi prices created (${mandiData.length} current + ${historicalPrices.length} historical)`);

  // ─── Equipment Listings ─────────────────────────────────

  const equipmentData = [
    { ownerId: farmer2.id, equipmentName: 'Mahindra 575 DI Tractor', category: 'Tractor', rentalRate: 2500, rentalUnit: 'day', availabilityStatus: 'AVAILABLE', latitude: 18.53, longitude: 73.85, description: '47 HP tractor suitable for all farming operations. Well-maintained, diesel-powered.' },
    { ownerId: farmer1.id, equipmentName: 'John Deere 5310 Tractor', category: 'Tractor', rentalRate: 3000, rentalUnit: 'day', availabilityStatus: 'AVAILABLE', latitude: 18.52, longitude: 73.86, description: '55 HP premium tractor with power steering and AC cabin.' },
    { ownerId: farmer2.id, equipmentName: 'Dasmesh Harvester 912', category: 'Harvester', rentalRate: 8000, rentalUnit: 'day', availabilityStatus: 'AVAILABLE', latitude: 18.49, longitude: 73.89, description: 'Combine harvester for wheat, rice, and other grains. Includes transportation.' },
    { ownerId: farmer1.id, equipmentName: 'Swaraj Rotavator 1.8m', category: 'Rotavator', rentalRate: 1200, rentalUnit: 'day', availabilityStatus: 'RENTED_OUT', latitude: 18.52, longitude: 73.87, description: 'Rotavator for soil preparation. Good condition, 6 blades.' },
    { ownerId: farmer3.id, equipmentName: 'Kirloskar Sprayer 200L', category: 'Sprayer', rentalRate: 800, rentalUnit: 'day', availabilityStatus: 'AVAILABLE', latitude: 16.01, longitude: 73.51, description: 'Power sprayer with 200L tank. Suitable for pesticide and fertilizer application.' },
    { ownerId: farmer2.id, equipmentName: 'Seed Drill - 9 Row', category: 'Seeder', rentalRate: 1500, rentalUnit: 'day', availabilityStatus: 'AVAILABLE', latitude: 18.48, longitude: 73.90, description: '9-row seed drill for wheat, soybean, and other row crops.' },
    { ownerId: farmer1.id, equipmentName: 'JCB 3DX Backhoe', category: 'Excavator', rentalRate: 5000, rentalUnit: 'day', availabilityStatus: 'MAINTENANCE', latitude: 18.51, longitude: 73.85, description: 'Backhoe loader for land leveling, digging, and construction work.' },
    { ownerId: farmer3.id, equipmentName: 'Trailer 10 Ton', category: 'Trailer', rentalRate: 1800, rentalUnit: 'day', availabilityStatus: 'AVAILABLE', latitude: 16.02, longitude: 73.50, description: 'Heavy-duty trailer for crop and material transportation.' },
    { ownerId: farmer2.id, equipmentName: 'Boom Sprayer 600L', category: 'Sprayer', rentalRate: 2000, rentalUnit: 'day', availabilityStatus: 'AVAILABLE', latitude: 18.50, longitude: 73.88, description: 'Tractor-mounted boom sprayer. Covers large areas efficiently.' },
  ];

  await prisma.equipmentListing.createMany({
    data: equipmentData.map(e => ({
      ...e,
      availabilityStatus: e.availabilityStatus as any,
    })) as any,
  });
  console.log('  ✅ Equipment listings created (9 items)');

  // ─── Government Schemes (DB-backed) ─────────────────────

  const schemesData = [
    {
      schemeName: 'PM-KISAN',
      description: 'Income support of ₹6,000/year to farmer families.',
      eligibilityJson: { farmerCategory: ['SMALL', 'MARGINAL'], landholdingMax: 5 },
      benefits: '₹6,000 per year in 3 installments',
      requiredDocuments: 'Aadhaar, Bank details, Land records',
      applicationLink: 'https://pmkisan.gov.in',
    },
    {
      schemeName: 'PMFBY Crop Insurance',
      description: 'Comprehensive crop insurance against natural calamities.',
      eligibilityJson: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'] },
      benefits: 'Full crop loss coverage at subsidized premium',
      requiredDocuments: 'Aadhaar, Bank passbook, Land records, Sowing certificate',
      applicationLink: 'https://pmfby.gov.in',
    },
    {
      schemeName: 'Kisan Credit Card',
      description: 'Affordable credit for agricultural activities at 4% interest.',
      eligibilityJson: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'] },
      benefits: 'Crop loan at 4% p.a., up to ₹3 lakh',
      requiredDocuments: 'Aadhaar, Land documents, Photos, Income certificate',
      applicationLink: '#',
    },
    {
      schemeName: 'Soil Health Card',
      description: 'Free soil testing and nutrient recommendations.',
      eligibilityJson: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'] },
      benefits: 'Free soil analysis and fertilizer guidance',
      requiredDocuments: 'Aadhaar, Land records',
      applicationLink: 'https://soilhealth.dac.gov.in',
    },
  ];

  for (const scheme of schemesData) {
    await prisma.governmentScheme.upsert({
      where: { id: scheme.schemeName.toLowerCase().replace(/[^a-z0-9]/g, '-') },
      update: scheme,
      create: { ...scheme, id: scheme.schemeName.toLowerCase().replace(/[^a-z0-9]/g, '-') },
    });
  }

  console.log('  ✅ Government schemes created (4 seeded in DB)');

  // ─── News Articles ──────────────────────────────────────

  const newsData = [
    {
      title: 'Wheat MSP Increased to ₹2,350/quintal for Rabi 2025-26',
      summary: 'Government announces minimum support price hike for wheat, benefiting millions of farmers across northern India.',
      category: 'MSP Updates',
      language: 'en',
      source: 'PIB',
      publishedAt: new Date(),
    },
    {
      title: 'Heavy Rainfall Expected in Maharashtra Next Week',
      summary: 'IMD forecasts heavy to very rainfall in western Maharashtra districts including Pune, Satara, and Kolhapur.',
      category: 'Weather Alerts',
      language: 'en',
      source: 'IMD',
      publishedAt: new Date(Date.now() - 86400000),
    },
    {
      title: 'पीएम किसान सम्मान निधि की अगली किस्त जल्द',
      summary: 'केंद्र सरकार पीएम किसान योजना की 18वीं किस्त जल्द जारी करने वाली है। करोड़ों किसानों को मिलेंगे 2,000 रुपये।',
      category: 'Government Schemes',
      language: 'hi',
      source: 'PM Kisan Portal',
      publishedAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      title: 'Onion Prices Surge 20% Due to Supply Shortage',
      summary: 'Onion prices rise sharply in major mandis as late monsoon delays harvest in Nashik and Maharashtra.',
      category: 'Market Updates',
      language: 'en',
      source: 'AgriMarket',
      publishedAt: new Date(Date.now() - 3 * 86400000),
    },
    {
      title: 'तुर उत्पादन योजनेचा लाभ घ्या',
      summary: 'महाराष्ट्रात तुर (pigeon pea) लागवडीसाठी सरकारी योजना उपलब्ध. सब्सिडीवर बियाणे मिळवा.',
      category: 'Farming Tips',
      language: 'mr',
      source: 'Krishi Bhavan',
      publishedAt: new Date(Date.now() - 4 * 86400000),
    },
    {
      title: 'New Drip Irrigation Subsidy: 55% for Small Farmers',
      summary: 'Agriculture ministry announces enhanced subsidy on micro-irrigation systems. Apply through your nearest agriculture office.',
      category: 'Government Schemes',
      language: 'en',
      source: 'Ministry of Agriculture',
      publishedAt: new Date(Date.now() - 5 * 86400000),
    },
    {
      title: 'कृषी यंत्र सब्सिडी 2026 साठी अर्ज सुरू',
      summary: 'सरकारने कृषी यंत्रांवर सब्सिडीसाठी अर्ज प्रक्रिया सुरू केली आहे. ट्रॅक्टर, हार्वेस्टर आणि इतर यंत्रांवर 40-50% सब्सिडी.',
      category: 'Government Schemes',
      language: 'mr',
      source: 'MahaAgri',
      publishedAt: new Date(Date.now() - 6 * 86400000),
    },
    {
      title: 'AI-Based Disease Detection App Now Available for Android',
      summary: 'New mobile app uses machine learning to identify crop diseases from photos. Download from Play Store for free.',
      category: 'Technology',
      language: 'en',
      source: 'AgriTech Today',
      publishedAt: new Date(Date.now() - 7 * 86400000),
    },
    {
      title: 'कपास उत्पादनात भारताने विक्रम नोंदवला',
      summary: 'भारताने कपास उत्पादनात विश्वविक्रम नोंदवला आहे. 375 दशलक्ष गुंठ्यांचे उत्पादन झाले.',
      category: 'Market Updates',
      language: 'hi',
      source: 'Textile Ministry',
      publishedAt: new Date(Date.now() - 8 * 86400000),
    },
    {
      title: 'Organic Farming Training Workshop — Pune District',
      summary: 'Free 3-day training on organic farming techniques at Krishi Vigyan Kendra, Pune. Register now.',
      category: 'Farming Tips',
      language: 'en',
      source: 'KVK Pune',
      publishedAt: new Date(Date.now() - 10 * 86400000),
    },
    {
      title: 'महसूल दर वाढला: शेतकऱ्यांना फायदा',
      summary: 'रबी हंगामातील पिकांचे महसूल दर वाढवले गेले आहेत. गहू, चावल आणि डाळींच्या भावात वाढ.',
      category: 'MSP Updates',
      language: 'mr',
      source: 'Nashik APMC',
      publishedAt: new Date(Date.now() - 11 * 86400000),
    },
    {
      title: 'Winter Crop Advisory: Protect Against Frost',
      summary: 'Agricultural experts advise farmers to use frost protection measures for standing winter crops. Cover sensitive plants at night.',
      category: 'Farming Tips',
      language: 'en',
      source: 'ICAR',
      publishedAt: new Date(Date.now() - 12 * 86400000),
    },
  ];

  await prisma.newsArticle.createMany({ data: newsData });
  console.log(`  ✅ News articles created (${newsData.length} articles)`);

  // ─── Sample Notifications ────────────────────────────────

  await prisma.notification.createMany({
    data: [
      { userId: farmer1.id, type: 'WEATHER', title: 'Rain Alert', body: 'Rain expected in next 2 days in Pune district', language: 'en' },
      { userId: farmer1.id, type: 'MARKET', title: 'Wheat Price Update', body: 'Wheat price at Pune APMC: ₹2,250/quintal', language: 'en' },
      { userId: farmer1.id, type: 'SCHEME', title: 'PM-KISAN', body: '18th installment likely to be released soon', language: 'hi' },
    ],
  });

  console.log('  ✅ Notifications created');
  console.log('\n🎉 Seed completed successfully!\n');
  console.log('  Demo Accounts:');
  console.log('  ─────────────────────────────────────────────');
  console.log('  Login via mobile number + OTP (shown in server console)');
  console.log('  Quick PIN login (4-digit):');
  console.log('  Farmer 1: 9876543210 / PIN 1234 (Rajesh Patil, Pune)');
  console.log('  Farmer 2: 9876543211 / PIN 1234 (Suresh Kumar, Pune)');
  console.log('  Farmer 3: 9876543212 / PIN 1234 (Priya Deshmukh, Sindhudurg)');
  console.log('  Admin:    9000000001 / PIN 0001');
  console.log('  Officer:  9000000002 / PIN 0002\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
