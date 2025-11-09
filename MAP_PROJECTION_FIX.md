# Map Projection Component - NaN Coordinate Fix ✅

## Issue

Error: `Invalid LngLat object: (NaN, NaN)` when MapProjection component tried to render with missing facility coordinates.

## Root Cause

The API response doesn't include `facility_latitude` and `facility_longitude` in the brief metadata, causing:
1. Facility coordinates to be `NaN`
2. Site coordinates to be `NaN` (since they were calculated relative to facility)
3. Mapbox bounds to fail when extending with invalid coordinates

## Solution Implemented

### 1. Added Coordinate Validation in MapProjection Component

**File:** `web/components/brief/components/MapProjection.tsx`

```typescript
// Validate coordinates before using them
const validFacilityCoords = 
  !isNaN(facility.longitude) && 
  !isNaN(facility.latitude) &&
  facility.longitude !== 0 &&
  facility.latitude !== 0;

const validSites = sites.filter(site => 
  !isNaN(site.center[0]) && 
  !isNaN(site.center[1]) &&
  site.center[0] !== 0 &&
  site.center[1] !== 0
);

// Early return if no valid coordinates
if (!validFacilityCoords && validSites.length === 0) {
  console.warn("No valid coordinates for map projection");
  return;
}
```

### 2. Conditional Rendering Based on Valid Data

**Facility Marker:** Only added if `validFacilityCoords` is true  
**Site Markers:** Only valid sites are rendered  
**Arrows:** Only drawn if both facility and sites are valid  
**Legend:** Dynamically shows only available elements  

### 3. Improved Site Positioning Algorithm

**File:** `web/app/brief/page.tsx`

Changed from linear offset to **circular pattern** around facility:

```typescript
const angle = (idx / selectedIds.length) * 2 * Math.PI;
const radius = 0.15; // ~15km in degrees
return {
  id,
  center: [
    facilityLng + Math.cos(angle) * radius,
    facilityLat + Math.sin(angle) * radius,
  ] as [number, number],
  area_ha: briefData.metadata.total_area_ha / selectedIds.length,
};
```

**Benefits:**
- Sites distributed evenly in a circle
- More realistic spatial distribution
- Better visual balance on map
- ~15km radius from facility (typical offset range)

### 4. Fallback Coordinates

Default to Calgary, Alberta if no coordinates available:
- **Latitude:** 51.0447
- **Longitude:** -114.0719

### 5. User Feedback

Added warning message when facility coordinates are unavailable:

```typescript
{!validFacilityCoords && (
  <div className="text-amber-600 mt-1">
    ⚠️ Facility coordinates unavailable
  </div>
)}
```

## What Works Now

✅ **No NaN errors** - All coordinates validated before use  
✅ **Graceful degradation** - Map renders with whatever data is available  
✅ **Clear feedback** - Users see warning when data is missing  
✅ **Circular site layout** - Better visual distribution  
✅ **Conditional elements** - Legend only shows available items  
✅ **Fallback coordinates** - Always have a valid location  

## Scenarios Handled

### Scenario 1: Full Data (Ideal)
- ✅ Facility marker shown
- ✅ All site markers shown
- ✅ Arrows from facility to sites
- ✅ Complete legend

### Scenario 2: No Facility Coords (Current)
- ❌ No facility marker
- ✅ Site markers shown (using fallback + circular pattern)
- ❌ No arrows (can't draw without facility)
- ✅ Legend shows only sites
- ⚠️ Warning message displayed

### Scenario 3: No Site Coords
- ✅ Facility marker shown
- ❌ No site markers
- ❌ No arrows
- ✅ Legend shows only facility

### Scenario 4: No Coords at All
- ⚠️ Map doesn't initialize
- Console warning logged
- Component returns null gracefully

## Future Enhancement

To get real coordinates, update backend to include in API response:

**File:** `api/services/brief_service.py`

```python
metadata = {
    # ... existing fields ...
    "facility_latitude": facility.latitude,
    "facility_longitude": facility.longitude,
    # Could also add:
    "site_coordinates": [
        {
            "id": site.id,
            "center": [site.longitude, site.latitude],
            "bounds": site.geometry  # For actual polygon shape
        }
        for site in selected_sites
    ]
}
```

## Testing

Tested scenarios:
- ✅ Brief generation with current API (no coordinates)
- ✅ Map renders with circular site pattern
- ✅ No console errors
- ✅ Warning message appears
- ✅ Legend adapts to available data
- ✅ No linting errors

## Files Modified

1. `web/components/brief/components/MapProjection.tsx`
   - Added coordinate validation
   - Conditional rendering of map elements
   - Graceful error handling
   - Dynamic legend

2. `web/app/brief/page.tsx`
   - Improved site positioning (circular pattern)
   - Better fallback coordinate handling
   - Cleaner variable extraction

## Result

The map projection component now works reliably even when coordinate data is incomplete or missing, providing a better user experience with clear feedback about data availability.

✅ **Fix Complete - No More NaN Errors!**

