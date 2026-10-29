import { Router, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// ─── File Upload Config ─────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, process.env.UPLOAD_DIR || './uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `disease-${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WebP) are allowed'));
    }
  },
});

// ─── MOCK Disease Prediction ────────────────────────────────
// In production, this calls a CNN/ML model service.
// Structure is designed so a Python FastAPI microservice can be swapped in.

interface DiseaseResult {
  disease: string;
  diseaseHi: string;
  diseaseMr: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  treatment: string[];
  prevention: string[];
}

const MOCK_DISEASES: DiseaseResult[] = [
  {
    disease: 'Leaf Blight', diseaseHi: 'पत्ती झुलसा', diseaseMr: 'पान विषाणू',
    confidence: 0.92, severity: 'High',
    description: 'Bacterial or fungal infection causing brown/black lesions on leaves.',
    treatment: ['Apply copper-based fungicide', 'Remove infected plant parts', 'Improve air circulation between plants'],
    prevention: ['Use disease-resistant varieties', 'Avoid overhead irrigation', 'Practice crop rotation'],
  },
  {
    disease: 'Powdery Mildew', diseaseHi: 'चूर्णिल फफूंद', diseaseMr: 'पांढरी बुरशी',
    confidence: 0.88, severity: 'Medium',
    description: 'White powdery fungal growth on leaf surfaces, common in dry conditions.',
    treatment: ['Spray sulfur-based fungicide', 'Apply neem oil solution', 'Remove heavily infected leaves'],
    prevention: ['Ensure proper plant spacing', 'Avoid excessive nitrogen fertilization', 'Choose resistant varieties'],
  },
  {
    disease: 'Root Rot', diseaseHi: 'जड़ सड़न', diseaseMr: 'मुळ सडना',
    confidence: 0.85, severity: 'High',
    description: 'Fungal disease affecting roots, causing wilting and plant death.',
    treatment: ['Apply Trichoderma-based biocontrol agent', 'Drench soil with metalaxyl fungicide', 'Improve field drainage'],
    prevention: ['Avoid waterlogged conditions', 'Use well-drained seedbeds', 'Treat seeds before sowing'],
  },
  {
    disease: 'Rust Fungus', diseaseHi: 'गेरूआ रोग', diseaseMr: 'रस्ट रोग',
    confidence: 0.90, severity: 'Medium',
    description: 'Orange-brown pustules on stems and leaves, spread by wind.',
    treatment: ['Apply propiconazole fungicide', 'Remove and destroy infected plant debris', 'Spray during early morning'],
    prevention: ['Plant early to avoid peak infection', 'Use certified clean seeds', 'Maintain field hygiene'],
  },
  {
    disease: 'Mosaic Virus', diseaseHi: 'मोज़ेक वायरस', diseaseMr: 'मोझॅइक व्हायरस',
    confidence: 0.82, severity: 'Medium',
    description: 'Yellow-green mottling pattern on leaves, stunted growth.',
    treatment: ['No cure — remove and destroy infected plants', 'Control aphid vectors with neem spray', 'Use virus-free planting material'],
    prevention: ['Use resistant varieties', 'Control insect vectors', 'Disinfect tools between plants'],
  },
  {
    disease: 'Anthracnose', diseaseHi: 'एंथ्रैक्नोज़', diseaseMr: 'एंथ्रॅक्नोज',
    confidence: 0.79, severity: 'Medium',
    description: 'Dark sunken lesions on fruits, stems, or leaves.',
    treatment: ['Apply mancozeb fungicide', 'Harvest fruits at proper maturity', 'Improve drainage'],
    prevention: ['Use disease-free seeds', 'Avoid working with wet plants', 'Practice crop rotation'],
  },
];

/**
 * MOCK prediction function — replace with real ML model call in production.
 * Documented: In production, POST image to Python FastAPI service
 * which loads a trained CNN (e.g., ResNet50 fine-tuned on PlantVillage dataset)
 * and returns top predictions with confidence scores.
 */
async function predictDisease(imagePath: string, imageUrl: string): Promise<DiseaseResult> {
  // Deterministic stand-in for the CNN. Hashing the uploaded image means the
  // same photo always produces the same prediction, which makes demos and tests
  // reproducible while the real ML service is not configured.
  let seed = imageUrl;
  try {
    const image = await fs.promises.readFile(imagePath);
    seed = crypto.createHash('sha256').update(image).digest('hex');
  } catch {
    // Fall back to the stored URL when the file cannot be read.
  }

  const hash = parseInt(seed.slice(0, 12), 16) || 1;
  const idx = hash % MOCK_DISEASES.length;
  const confidence = 0.78 + ((hash >>> 8) % 16) / 100;
  return { ...MOCK_DISEASES[idx], confidence: Math.round(confidence * 100) / 100 };
}

// POST /api/disease/detect — upload image and get disease prediction
router.post('/detect', authenticate, upload.single('image'), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded', code: 'NO_IMAGE' });
    return;
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  const result = await predictDisease(req.file.path, imageUrl);

  // Save detection record
  const detection = await prisma.diseaseDetection.create({
    data: {
      userId: req.user!.id,
      farmId: req.body.farmId as string | undefined,
      imageUrl,
      predictedDisease: result.disease,
      confidenceScore: result.confidence,
      recommendedTreatment: result.treatment.join('\n'),
      preventionTips: result.prevention.join('\n'),
    },
  });

  await prisma.notification.create({
    data: {
      userId: req.user!.id,
      type: 'DISEASE_ALERT',
      title: `${result.disease} detected`,
      body: `${Math.round(result.confidence * 100)}% confidence · ${result.severity} severity. Open the disease report for treatment steps.`,
    },
  });

  res.json({
    id: detection.id,
    imageUrl,
    disease: result.disease,
    diseaseHi: result.diseaseHi,
    diseaseMr: result.diseaseMr,
    confidence: Math.round(result.confidence * 100),
    severity: result.severity,
    description: result.description,
    treatment: result.treatment,
    prevention: result.prevention,
  });
});

// GET /api/disease/history — user's past detections
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
  const detections = await prisma.diseaseDetection.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  res.json({ detections });
});

export default router;
