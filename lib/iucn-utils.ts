/**
 * IUCN Category Mapping Utilities
 * Maps IUCN protected area categories to a 1-7 protection strictness scale
 */

/**
 * Map IUCN category to a 1-7 scale
 * @param category - IUCN category string (e.g., "Ia", "II", "VI")
 * @returns Protection level from 1 (least protected) to 7 (most protected)
 */
export function mapIUCNToScale(category: string): number {
  if (!category) return 0;
  
  // Trim and normalize the category string
  const normalized = category.toString().trim().toUpperCase();
  
  const mapping: Record<string, number> = {
    'IA': 7, 'I A': 7, '1A': 7,
    'IB': 6, 'I B': 6, '1B': 6,
    'II': 5, '2': 5,
    'III': 4, '3': 4,
    'IV': 3, '4': 3,
    'V': 2, '5': 2,
    'VI': 1, '6': 1,
    
    // Additional variations
    'I-A': 7, 'CATEGORY IA': 7,
    'I-B': 6, 'CATEGORY IB': 6,
    'CATEGORY II': 5, 'CAT II': 5,
    'CATEGORY III': 4, 'CAT III': 4,
    'CATEGORY IV': 3, 'CAT IV': 3,
    'CATEGORY V': 2, 'CAT V': 2,
    'CATEGORY VI': 1, 'CAT VI': 1,
  };
  
  const result = mapping[normalized];
  
  // Debug: Log unmapped categories
  if (result === undefined) {
    console.warn('⚠️ Unmapped IUCN category:', category);
    return 0;
  }
  
  return result;
}

/**
 * Get color based on IUCN protection level
 * @param level - Protection level from 1-7
 * @returns Hex color code
 */
export function getIUCNColor(level: number): string {
  if (level <= 2) return '#10b981'; // green - low protection
  if (level <= 5) return '#eab308'; // yellow - medium protection
  return '#ef4444'; // red - high/strict protection
}

