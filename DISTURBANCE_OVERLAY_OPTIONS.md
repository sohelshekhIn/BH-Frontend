# Potential Disturbance Map Overlays

This document outlines additional data layers that can be added to the map to show various types of disturbances and constraints for offset project planning.

## Currently Implemented ✅

1. **Conserved Areas (CPCAD)** - Emerald green overlay
   - Shows protected and conserved lands
   - Toggle on/off with checkbox
   - Vector tiles for efficient loading

2. **Facilities** - Clustered emission points
   - Color-coded by emission levels
   - Viewport-based loading
   - Clustering at low zoom

3. **Disturbed Land Assessment** - Satellite imagery
   - Real satellite photos from Mapbox
   - Facility marker overlay
   - Coordinates display

## Ready to Implement (Data Available)

### 3. Indigenous Territories Layer
- **Data Source**: `indigenous_territories` table in Supabase
- **Backend**: PostGIS RPC function `check_indigenous_territories` exists
- **Color**: Purple/Violet (`#a855f7`)
- **Toggle**: Add checkbox in MapControls
- **Shows**: Treaty areas, traditional territories, reserve lands
- **Use Case**: Identify consultation requirements

### 4. Water Bodies Layer
- **Data Source**: Could use OSM water data or Canadian Water Bodies dataset
- **Color**: Blue (`#3b82f6`)
- **Shows**: Lakes, rivers, wetlands
- **Use Case**: 100m buffer zone compliance for offset projects

### 5. Infrastructure Layer
- **Data Source**: OpenStreetMap or Infrastructure Canada
- **Color**: Orange/Yellow (`#f59e0b`)
- **Shows**: Roads, railways, pipelines, power lines
- **Use Case**: Identify infrastructure-free zones

## Requires Additional Data

### 6. NDVI (Vegetation Index) Heatmap
- **Data Source**: Sentinel-2 satellite imagery processing
- **Backend**: Stub exists at `api/supabase/functions/calculate-ndvi/`
- **Color**: Gradient (Red=bare soil, Green=healthy vegetation)
- **Shows**: Vegetation health, degraded land, disturbed areas
- **Use Case**: Identify degraded land for reforestation

### 7. Slope/Elevation Analysis
- **Data Source**: Digital Elevation Model (DEM) data
- **Color**: Heat gradient
- **Shows**: Terrain slope percentage
- **Use Case**: Projects require slope <30%

### 8. Tailings Ponds / Mining Disturbances
- **Data Source**: Could use NDVI + mining facility buffering
- **Color**: Red/Orange overlay
- **Shows**: Tailings storage facilities, open pits, mine waste
- **Use Case**: Prime candidates for land reclamation offsets

### 9. Land Use Classification
- **Data Source**: Canadian Land Use dataset
- **Color**: Multi-color classification
- **Shows**: Agricultural, forested, urban, industrial zones
- **Use Case**: Identify suitable land types for different offset projects

## Implementation Recommendation

For your demo, I recommend adding these in order:

### **Phase 1 (Quick Wins):**
1. ✅ Conserved Areas - Done
2. ✅ Coordinates Display - Done
3. ✅ Facility Marker - Done

### **Phase 2 (Medium Effort):**
4. Indigenous Territories - Similar to conserved areas, data exists
5. Water Bodies - Could use static tileset

### **Phase 3 (Advanced):**
6. NDVI Heatmap - Requires Sentinel data processing
7. Slope Analysis - Requires DEM data

## How to Add More Layers

Each layer follows the same pattern as ConservedAreasLayer:

```typescript
// 1. Create layer component (e.g., IndigenousTerritoryLayer.tsx)
// 2. Add checkbox to MapControls.tsx
// 3. Add state in map page
// 4. Add layer to BaseMap children
```

## Color Scheme Guide

To maintain visual clarity with multiple overlays:

- 🟢 **Green**: Conserved/Protected areas (environmental protection)
- 🟣 **Purple**: Indigenous territories (cultural/legal)
- 🔵 **Blue**: Water bodies (hydrological)
- 🟠 **Orange**: Infrastructure (built environment)
- 🔴 **Red**: High disturbance (mining, industrial)
- 🟡 **Yellow**: Medium disturbance (degraded land)

Keep opacity around 0.3-0.4 to allow multiple layers to be visible simultaneously.

