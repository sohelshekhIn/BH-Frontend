# Brief Page Installation Instructions

## Required Package Installation

The new brief page uses Radix UI Tabs component which needs to be installed.

### Install Command

```bash
cd web
npm install @radix-ui/react-tabs
```

Or if using yarn:
```bash
cd web
yarn add @radix-ui/react-tabs
```

Or if using pnpm:
```bash
cd web
pnpm add @radix-ui/react-tabs
```

## Verification

After installation, verify the package is in `web/package.json`:

```json
{
  "dependencies": {
    "@radix-ui/react-tabs": "^1.1.0",
    // ... other dependencies
  }
}
```

## Testing the Brief Page

1. **Start the development server:**
   ```bash
   cd web
   npm run dev
   ```

2. **Navigate to the brief page:**
   - Go to `/map`
   - Select a facility
   - Click "Build Credits" button
   - Select sites and configure project
   - Click "Generate Brief" button
   - You should now see the new brief page with:
     - **Tabs**: Visual Dashboard and Formal Brief
     - **Impact Metrics**: Bold cards with gradients
     - **UN SDG Alignment**: Official colored goal cards
     - **Map Projection**: Facility and site locations
     - **Emissions Charts**: Interactive visualizations

## Features Enabled

### Visual Dashboard Tab
- ✅ Bento grid layout
- ✅ Impact metrics with gradients and icons
- ✅ UN SDG alignment with progress bars
- ✅ Map showing facility + offset sites
- ✅ Emissions trajectory chart
- ✅ Cumulative credits chart
- ✅ Site distribution chart

### Formal Brief Tab
- ✅ Styled markdown with proper headings
- ✅ Professional layout
- ✅ Print-friendly formatting
- ✅ Download PDF button

## File Structure

```
web/
├── app/
│   └── brief/
│       ├── page.tsx (NEW VERSION)
│       ├── page_old_backup.tsx (BACKUP)
│       └── page_new.tsx (SOURCE)
├── components/
│   ├── brief/
│   │   ├── BentoGrid.tsx
│   │   ├── BriefTabs.tsx
│   │   └── components/
│   │       ├── ImpactMetrics.tsx
│   │       ├── SDGAlignment.tsx
│   │       ├── MapProjection.tsx
│   │       └── EmissionsChart.tsx
│   └── ui/
│       └── tabs.tsx (NEW)
└── lib/
    └── sdg-config.ts (NEW)
```

## Troubleshooting

### If tabs don't work:
1. Ensure `@radix-ui/react-tabs` is installed
2. Restart dev server after installation
3. Check browser console for errors

### If map doesn't render:
1. Verify `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`
2. Check that `mapbox-gl` package is installed
3. Check browser console for Mapbox errors

### If SDG colors don't show:
1. Check that `web/lib/sdg-config.ts` exists
2. Verify no TypeScript errors
3. Check component imports

### If charts are broken:
1. Ensure `recharts` package is installed
2. Check that data is being passed correctly
3. Verify chart data structure matches expected format

## Rollback Instructions

If you need to revert to the old version:

```bash
cd web/app/brief
cp page_old_backup.tsx page.tsx
```

## Next Steps

After installation and verification:

1. **Test all functionality**
   - Generate a brief with different facility types
   - Switch between Visual Dashboard and Formal Brief tabs
   - Test PDF download
   - Verify SDG alignment scores
   - Check map rendering

2. **Customize if needed**
   - Adjust colors in `sdg-config.ts`
   - Modify metric calculations
   - Add more components to bento grid
   - Update chart configurations

3. **Backend enhancements** (future)
   - Add actual facility/site coordinates to API
   - Implement AI component selection
   - Add more detailed SDG calculations
   - Include risk assessment data

## Support

If you encounter any issues:
1. Check this document first
2. Review error messages in browser console
3. Check terminal output for build errors
4. Verify all dependencies are installed correctly

## What's New

### Phase 1 (Complete)
- ✅ Removed all Gemini references
- ✅ Improved markdown formatting
- ✅ Better visual hierarchy

### Phase 2 (Complete)
- ✅ Bento grid layout system
- ✅ Impact metrics with gradients
- ✅ UN SDG alignment (7 goals)
- ✅ Map projection with facility/sites
- ✅ Configurable charts
- ✅ Tab-based navigation
- ✅ Bold, impactful design
- ✅ Responsive on all devices

Enjoy your new AI-powered carbon offset dashboard! 🌱✨

