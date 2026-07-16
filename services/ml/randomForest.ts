interface TreeNode {
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: number;
  isLeaf: boolean;
  samples: number;
  value: number;
}

interface DecisionTree {
  root: TreeNode;
  maxDepth: number;
  minSamplesSplit: number;
}

function generateTrainingData(): { features: number[][]; labels: number[] } {
  const features: number[][] = [];
  const labels: number[] = [];

  const scenarios = [
    { temp: 28, hum: 85, pres: 1008, wind: 5, cloud: 90, uv: 2, dp: 24, pp: 80, rain: 1, hour: 14, dow: 3, month: 7, td: -3, hd: 10, pd: -2, wgf: 1.2, ct: 0.3, sf: 1.0, label: 1 },
    { temp: 32, hum: 45, pres: 1018, wind: 12, cloud: 20, uv: 8, dp: 18, pp: 10, rain: 0, hour: 10, dow: 1, month: 4, td: 2, hd: -5, pd: 1, wgf: 1.0, ct: -0.1, sf: 0.5, label: 0 },
    { temp: 25, hum: 92, pres: 1005, wind: 8, cloud: 95, uv: 1, dp: 23, pp: 90, rain: 1, hour: 16, dow: 5, month: 8, td: -5, hd: 5, pd: -4, wgf: 1.5, ct: 0.5, sf: 1.0, label: 1 },
    { temp: 35, hum: 30, pres: 1020, wind: 15, cloud: 10, uv: 10, dp: 14, pp: 5, rain: 0, hour: 12, dow: 0, month: 5, td: 1, hd: -8, pd: 0, wgf: 0.8, ct: -0.2, sf: 1.0, label: 0 },
    { temp: 22, hum: 78, pres: 1010, wind: 18, cloud: 80, uv: 3, dp: 18, pp: 70, rain: 1, hour: 20, dow: 6, month: 11, td: -2, hd: 8, pd: -1, wgf: 1.3, ct: 0.2, sf: 0.6, label: 1 },
    { temp: 30, hum: 55, pres: 1015, wind: 10, cloud: 30, uv: 6, dp: 20, pp: 20, rain: 0, hour: 8, dow: 2, month: 3, td: 3, hd: -3, pd: 2, wgf: 1.1, ct: -0.1, sf: 0.5, label: 0 },
    { temp: 20, hum: 88, pres: 1006, wind: 22, cloud: 85, uv: 1, dp: 18, pp: 85, rain: 1, hour: 3, dow: 4, month: 9, td: -4, hd: 6, pd: -3, wgf: 1.8, ct: 0.4, sf: 0.6, label: 1 },
    { temp: 38, hum: 25, pres: 1022, wind: 8, cloud: 5, uv: 11, dp: 12, pp: 0, rain: 0, hour: 15, dow: 3, month: 6, td: 0, hd: -2, pd: 1, wgf: 0.9, ct: 0, sf: 1.0, label: 0 },
    { temp: 26, hum: 82, pres: 1009, wind: 14, cloud: 75, uv: 4, dp: 22, pp: 65, rain: 1, hour: 11, dow: 1, month: 7, td: -1, hd: 4, pd: -1, wgf: 1.4, ct: 0.2, sf: 1.0, label: 1 },
    { temp: 29, hum: 50, pres: 1016, wind: 20, cloud: 15, uv: 7, dp: 17, pp: 15, rain: 0, hour: 6, dow: 5, month: 2, td: 4, hd: -10, pd: 3, wgf: 1.0, ct: -0.3, sf: 0.5, label: 0 },
    { temp: 24, hum: 90, pres: 1004, wind: 25, cloud: 100, uv: 0, dp: 22, pp: 95, rain: 1, hour: 22, dow: 0, month: 8, td: -6, hd: 3, pd: -5, wgf: 2.0, ct: 0.6, sf: 1.0, label: 1 },
    { temp: 33, hum: 40, pres: 1019, wind: 6, cloud: 25, uv: 9, dp: 16, pp: 8, rain: 0, hour: 13, dow: 2, month: 4, td: 2, hd: -6, pd: 0, wgf: 0.7, ct: -0.1, sf: 0.5, label: 0 },
    { temp: 18, hum: 95, pres: 1002, wind: 3, cloud: 100, uv: 0, dp: 17, pp: 100, rain: 1, hour: 4, dow: 6, month: 12, td: -1, hd: 2, pd: -2, wgf: 1.1, ct: 0.1, sf: 0.3, label: 1 },
    { temp: 36, hum: 28, pres: 1021, wind: 11, cloud: 8, uv: 10, dp: 13, pp: 3, rain: 0, hour: 9, dow: 4, month: 5, td: 3, hd: -4, pd: 2, wgf: 0.9, ct: -0.1, sf: 1.0, label: 0 },
    { temp: 27, hum: 80, pres: 1007, wind: 16, cloud: 70, uv: 3, dp: 23, pp: 60, rain: 1, hour: 17, dow: 3, month: 9, td: -2, hd: 5, pd: -1, wgf: 1.3, ct: 0.1, sf: 0.6, label: 1 },
    { temp: 31, hum: 42, pres: 1017, wind: 9, cloud: 18, uv: 7, dp: 16, pp: 12, rain: 0, hour: 7, dow: 1, month: 1, td: 1, hd: -3, pd: 1, wgf: 1.0, ct: -0.2, sf: 0.3, label: 0 },
    { temp: 23, hum: 87, pres: 1006, wind: 20, cloud: 88, uv: 2, dp: 20, pp: 78, rain: 1, hour: 19, dow: 5, month: 10, td: -3, hd: 7, pd: -2, wgf: 1.6, ct: 0.3, sf: 0.6, label: 1 },
    { temp: 34, hum: 35, pres: 1020, wind: 7, cloud: 12, uv: 9, dp: 15, pp: 6, rain: 0, hour: 14, dow: 0, month: 3, td: 2, hd: -5, pd: 1, wgf: 0.8, ct: -0.1, sf: 0.5, label: 0 },
    { temp: 21, hum: 91, pres: 1003, wind: 28, cloud: 98, uv: 0, dp: 20, pp: 92, rain: 1, hour: 2, dow: 2, month: 7, td: -7, hd: 4, pd: -4, wgf: 2.2, ct: 0.5, sf: 1.0, label: 1 },
    { temp: 37, hum: 22, pres: 1023, wind: 5, cloud: 3, uv: 11, dp: 10, pp: 0, rain: 0, hour: 11, dow: 6, month: 6, td: 0, hd: -1, pd: 0, wgf: 0.6, ct: 0, sf: 1.0, label: 0 },
  ];

  for (const s of scenarios) {
    const f = [
      s.temp / 50, s.hum / 100, s.pres / 1100, s.wind / 50, s.cloud / 100,
      s.uv / 12, (s.dp + 20) / 50, s.pp / 100, s.rain, s.hour / 24,
      s.dow / 7, s.month / 12, (s.td + 20) / 40, (s.hd + 50) / 100,
      s.pd / 30, s.wgf / 3, (s.ct + 1) / 2, s.sf,
    ];
    features.push(f);
    labels.push(s.label);
  }

  return { features, labels };
}

function giniImpurity(labels: number[]): number {
  if (labels.length === 0) return 0;
  const p = labels.filter((l) => l === 1).length / labels.length;
  return 2 * p * (1 - p);
}

function trainTree(
  features: number[][],
  labels: number[],
  maxDepth: number,
  minSamplesSplit: number,
  depth: number = 0
): TreeNode {
  const posCount = labels.filter((l) => l === 1).length;
  const negCount = labels.length - posCount;

  if (depth >= maxDepth || labels.length < minSamplesSplit || posCount === 0 || negCount === 0) {
    return { isLeaf: true, prediction: posCount > negCount ? 1 : 0, samples: labels.length, value: posCount / labels.length };
  }

  let bestFeature = 0;
  let bestThreshold = 0;
  let bestGini = 1;
  const numFeatures = features[0].length;
  const featuresPerSplit = Math.ceil(Math.sqrt(numFeatures));
  const featureIndices = Array.from({ length: numFeatures }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, featuresPerSplit);

  for (const fi of featureIndices) {
    const values = features.map((f) => f[fi]);
    const uniqueVals = [...new Set(values)].sort((a, b) => a - b);
    const thresholds = uniqueVals.slice(0, -1).map((v, i) => (v + uniqueVals[i + 1]) / 2);

    for (const t of thresholds) {
      const leftLabels: number[] = [];
      const rightLabels: number[] = [];
      for (let i = 0; i < features.length; i++) {
        if (features[i][fi] <= t) leftLabels.push(labels[i]);
        else rightLabels.push(labels[i]);
      }
      if (leftLabels.length === 0 || rightLabels.length === 0) continue;

      const wGini =
        (leftLabels.length / labels.length) * giniImpurity(leftLabels) +
        (rightLabels.length / labels.length) * giniImpurity(rightLabels);

      if (wGini < bestGini) {
        bestGini = wGini;
        bestFeature = fi;
        bestThreshold = t;
      }
    }
  }

  if (bestGini >= giniImpurity(labels) || bestGini === 1) {
    return { isLeaf: true, prediction: posCount > negCount ? 1 : 0, samples: labels.length, value: posCount / labels.length };
  }

  const leftFeatures: number[][] = [];
  const leftLabels: number[] = [];
  const rightFeatures: number[][] = [];
  const rightLabels: number[] = [];

  for (let i = 0; i < features.length; i++) {
    if (features[i][bestFeature] <= bestThreshold) {
      leftFeatures.push(features[i]);
      leftLabels.push(labels[i]);
    } else {
      rightFeatures.push(features[i]);
      rightLabels.push(labels[i]);
    }
  }

  return {
    isLeaf: false,
    featureIndex: bestFeature,
    threshold: bestThreshold,
    left: trainTree(leftFeatures, leftLabels, maxDepth, minSamplesSplit, depth + 1),
    right: trainTree(rightFeatures, rightLabels, maxDepth, minSamplesSplit, depth + 1),
    samples: labels.length,
    value: posCount / labels.length,
  };
}

function predictTree(tree: TreeNode, features: number[]): number {
  if (tree.isLeaf) return tree.prediction!;
  if (features[tree.featureIndex!] <= tree.threshold!) return predictTree(tree.left!, features);
  return predictTree(tree.right!, features);
}

export interface RandomForestModel {
  trees: TreeNode[];
  numTrees: number;
}

export function trainRandomForest(numTrees: number = 15, maxDepth: number = 8): RandomForestModel {
  const { features, labels } = generateTrainingData();
  const trees: TreeNode[] = [];

  for (let i = 0; i < numTrees; i++) {
    const bootstrapFeatures: number[][] = [];
    const bootstrapLabels: number[] = [];
    for (let j = 0; j < features.length; j++) {
      const idx = Math.floor(Math.random() * features.length);
      bootstrapFeatures.push([...features[idx]]);
      bootstrapLabels.push(labels[idx]);
    }
    trees.push(trainTree(bootstrapFeatures, bootstrapLabels, maxDepth, 4));
  }

  return { trees, numTrees };
}

export function predictRain(model: RandomForestModel, features: number[]): { probability: number; willRain: boolean } {
  const votes = model.trees.map((tree) => predictTree(tree, features));
  const positives = votes.filter((v) => v === 1).length;
  const probability = positives / model.numTrees;
  return { probability, willRain: probability > 0.5 };
}

let cachedModel: RandomForestModel | null = null;

export function getModel(): RandomForestModel {
  if (!cachedModel) cachedModel = trainRandomForest(15, 8);
  return cachedModel;
}
