# Bar Chart Components

## Overview
This directory contains reusable bar chart components that solve mobile display issues by separating the chart visualization from the detailed legend.

## Components

### BarChartComponent
- Displays the actual bar chart with different colored bars
- Each bar gets a unique color from the provided colors array
- Responsive design optimized for mobile and desktop

### BarChartLegend  
- Shows detailed description with color-coded legend
- Each legend item matches the corresponding bar color
- Mobile-friendly layout with proper text wrapping

## Color Matching
Both components use the same color indexing logic:
```typescript
const color = colors[index % colors.length];
```

This ensures that:
- Bar 1 = Color 1 (Blue #0088FE)
- Bar 2 = Color 2 (Green #00C49F) 
- Bar 3 = Color 3 (Yellow #FFBB28)
- Bar 4 = Color 4 (Orange #FF8042)
- Bar 5 = Color 5 (Purple #8884D8)

## Usage
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <BarChartComponent
    data={chartData}
    dataKey="category"
    title="Chart Title"
    colors={COLORS}
    height={300}
  />
  <BarChartLegend
    data={chartData}
    dataKey="category"
    title="Legend Title"
    colors={COLORS}
  />
</div>
```

## Mobile Benefits
- No text stacking or overlapping issues
- Chart and legend stack vertically on mobile
- Side-by-side layout on desktop
- Color-coded legend makes data easy to understand
