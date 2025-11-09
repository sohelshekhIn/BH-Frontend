# IUCN Battery-Style Protection Indicator

## Overview

Added a visual "battery-style" indicator to conserved area hover popups that shows IUCN protection strictness level using colored boxes.

## Implementation

### 1. IUCN Category Mapping

**File:** `web/lib/iucn-utils.ts`

Maps IUCN categories to a 1-7 protection strictness scale:

| IUCN Category | Level | Description | Color |
|---------------|-------|-------------|-------|
| Ia | 7/7 | Strict Nature Reserve | Red |
| Ib | 6/7 | Wilderness Area | Red |
| II | 5/7 | National Park | Yellow |
| III | 4/7 | Natural Monument | Yellow |
| IV | 3/7 | Habitat Management | Yellow |
| V | 2/7 | Protected Landscape | Green |
| VI | 1/7 | Sustainable Use | Green |

### 2. Battery Indicator Component

**File:** `web/components/ui/IUCNBatteryIndicator.tsx`

Renders 7 small boxes with color-coded fill:
- Box size: 4px width × 8px height
- Gap: 2px between boxes
- Border: 1px solid gray for empty boxes
- Filled boxes: Solid color (green/yellow/red)
- Label: Shows "X/7" next to boxes

### 3. Color Logic

- **1-2 filled (Green)**: Low protection, sustainable use areas
- **3-5 filled (Yellow)**: Medium protection, managed areas
- **6-7 filled (Red)**: High/strict protection, nature reserves

### 4. Updated Popup

**File:** `web/components/map/ConservedAreasLayer.tsx`

The battery indicator now appears below "IUCN Category:" text in the hover popup.

## Visual Examples

### Example 1: National Park (II)
```
IUCN Category: II
[■][■][■][■][■][□][□] 5/7
```
5 yellow boxes filled (medium protection)

### Example 2: Strict Nature Reserve (Ia)
```
IUCN Category: Ia
[■][■][■][■][■][■][■] 7/7
```
7 red boxes filled (highest protection)

### Example 3: Sustainable Use (VI)
```
IUCN Category: VI
[■][□][□][□][□][□][□] 1/7
```
1 green box filled (lowest protection)

## User Experience

1. **Hover** over a green conserved area for 1 second
2. **Popup appears** with area information
3. **Battery indicator shows** below IUCN Category
4. **Visual cues:**
   - More boxes = stricter protection
   - Color indicates protection level (green→yellow→red)
   - Numeric label shows exact level (X/7)

## Technical Details

### mapIUCNToScale(category: string): number
Converts IUCN category string to numeric level (1-7)
- Handles case variations (Ia, IA)
- Handles Roman numerals (II, III, IV)
- Returns 0 for unknown categories

### getIUCNColor(level: number): string
Returns hex color based on protection level
- Level 1-2: #10b981 (emerald-500, green)
- Level 3-5: #eab308 (amber-500, yellow)
- Level 6-7: #ef4444 (red-500, red)

## Files Created/Modified

### Created
1. ✅ `web/lib/iucn-utils.ts` - Mapping and color utilities
2. ✅ `web/components/ui/IUCNBatteryIndicator.tsx` - Battery component

### Modified
3. ✅ `web/components/map/ConservedAreasLayer.tsx` - Added indicator to popup

## Testing Checklist

- ✅ Hover over conserved areas with IUCN categories
- ✅ Verify Ia shows 7/7 red boxes (strict reserve)
- ✅ Verify II shows 5/7 yellow boxes (national park)
- ✅ Verify VI shows 1/7 green box (sustainable use)
- ✅ Check alignment and spacing in popup
- ✅ Test in both light and dark mode
- ✅ Verify works on both `/map` and `/credit-builder`

## Design Specifications

### Box Styling
```css
width: 4px (w-1)
height: 8px (h-2)
border: 1px solid gray (border-gray-300)
border-radius: 1px (rounded-[1px])
gap: 2px (gap-0.5)
```

### Label Styling
```css
font-size: 10px (text-[10px])
color: muted-foreground
margin-left: 2px (ml-0.5)
```

## Benefits

### For Users
- Quick visual understanding of protection strictness
- Color coding provides immediate context
- Numeric label gives precise information
- Aligns with conservation knowledge (IUCN system)

### For System
- Reusable component (can be used elsewhere)
- Type-safe implementation
- Clean separation of concerns
- Easy to extend with more categories

## Future Enhancements (Optional)

1. **Tooltip on hover**: Show full IUCN category description
2. **Animation**: Fade-in boxes sequentially
3. **Click action**: Link to IUCN category information
4. **Accessibility**: Add ARIA labels for screen readers

## Conclusion

The IUCN Battery Indicator provides:
- ✅ Visual representation of protection strictness
- ✅ Color-coded severity (green → yellow → red)
- ✅ Clear numeric scale (X/7)
- ✅ Minimal space usage in popup
- ✅ Immediate understanding of conservation level

Users can now quickly assess how strictly protected an area is just by glancing at the battery indicator!

