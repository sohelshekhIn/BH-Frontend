/**
 * UN Sustainable Development Goals (SDG) Configuration
 * Official colors and definitions for carbon offset project alignment
 */

export interface SDGGoal {
  id: number;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  description: string;
  relevance: string;
}

export const SDG_GOALS: Record<number, SDGGoal> = {
  7: {
    id: 7,
    name: "Affordable and Clean Energy",
    shortName: "Clean Energy",
    color: "#FCC30B", // Official UN SDG 7 Yellow
    icon: "⚡",
    description: "Ensure access to affordable, reliable, sustainable and modern energy for all",
    relevance: "Carbon offset projects reduce emissions and promote renewable energy"
  },
  13: {
    id: 13,
    name: "Climate Action",
    shortName: "Climate Action",
    color: "#3F7E44", // Official UN SDG 13 Dark Green
    icon: "🌍",
    description: "Take urgent action to combat climate change and its impacts",
    relevance: "Direct climate impact through carbon sequestration and emission reduction"
  },
  15: {
    id: 15,
    name: "Life on Land",
    shortName: "Life on Land",
    color: "#56C02B", // Official UN SDG 15 Light Green
    icon: "🌱",
    description: "Protect, restore and promote sustainable use of terrestrial ecosystems",
    relevance: "Reforestation and ecosystem restoration support biodiversity and land health"
  },
  6: {
    id: 6,
    name: "Clean Water and Sanitation",
    shortName: "Clean Water",
    color: "#26BDE2", // Official UN SDG 6 Blue
    icon: "💧",
    description: "Ensure availability and sustainable management of water and sanitation for all",
    relevance: "Watershed protection and water quality improvement through land restoration"
  },
  11: {
    id: 11,
    name: "Sustainable Cities and Communities",
    shortName: "Sustainable Cities",
    color: "#FD9D24", // Official UN SDG 11 Orange
    icon: "🏙️",
    description: "Make cities and human settlements inclusive, safe, resilient and sustainable",
    relevance: "Urban green spaces and air quality improvement near industrial facilities"
  },
  12: {
    id: 12,
    name: "Responsible Consumption and Production",
    shortName: "Responsible Production",
    color: "#BF8B2E", // Official UN SDG 12 Brown
    icon: "♻️",
    description: "Ensure sustainable consumption and production patterns",
    relevance: "Circular economy principles and sustainable resource management"
  },
  8: {
    id: 8,
    name: "Decent Work and Economic Growth",
    shortName: "Economic Growth",
    color: "#A21942", // Official UN SDG 8 Burgundy
    icon: "💼",
    description: "Promote sustained, inclusive and sustainable economic growth",
    relevance: "Job creation in green sectors and sustainable forestry"
  }
};

/**
 * Calculate SDG alignment based on project type and metrics
 */
export function calculateSDGAlignment(
  projectType: string,
  metrics: {
    area_ha?: number;
    co2_removal?: number;
    biodiversity_score?: number;
    water_proximity?: boolean;
    urban_proximity?: boolean;
  }
): Array<{ goal: SDGGoal; score: number; impact: string }> {
  const alignments: Array<{ goal: SDGGoal; score: number; impact: string }> = [];

  // SDG 13 - Always relevant for carbon projects
  const climateScore = Math.min(100, (metrics.co2_removal || 0) / 500); // 50k tonnes = 100%
  alignments.push({
    goal: SDG_GOALS[13],
    score: Math.max(70, climateScore), // Minimum 70% for carbon projects
    impact: `${(metrics.co2_removal || 0).toLocaleString()} tonnes CO₂e removal over project lifetime`
  });

  // SDG 15 - Life on Land (for reforestation/afforestation)
  if (projectType === 'reforestation' || projectType === 'afforestation') {
    const landScore = Math.min(100, ((metrics.area_ha || 0) / 1000) * 100); // 1000 ha = 100%
    alignments.push({
      goal: SDG_GOALS[15],
      score: Math.max(60, landScore),
      impact: `${(metrics.area_ha || 0).toLocaleString()} hectares of ecosystem restoration`
    });
  }

  // SDG 7 - Clean Energy (for renewable/efficiency projects)
  if (projectType === 'renewable_energy' || projectType === 'energy_efficiency') {
    alignments.push({
      goal: SDG_GOALS[7],
      score: 85,
      impact: "Clean energy deployment reducing fossil fuel dependence"
    });
  }

  // SDG 6 - Clean Water (if near water bodies)
  if (metrics.water_proximity) {
    alignments.push({
      goal: SDG_GOALS[6],
      score: 65,
      impact: "Watershed protection and water quality improvement"
    });
  }

  // SDG 11 - Sustainable Cities (if near urban areas)
  if (metrics.urban_proximity) {
    alignments.push({
      goal: SDG_GOALS[11],
      score: 60,
      impact: "Air quality improvement and urban green space enhancement"
    });
  }

  // SDG 8 - Economic Growth (for projects with job creation)
  if ((metrics.area_ha || 0) > 500) {
    alignments.push({
      goal: SDG_GOALS[8],
      score: 55,
      impact: "Job creation in sustainable forestry and land management"
    });
  }

  return alignments.sort((a, b) => b.score - a.score);
}

/**
 * Get color for SDG score
 */
export function getSDGScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green-500
  if (score >= 60) return '#eab308'; // yellow-500
  return '#f97316'; // orange-500
}

