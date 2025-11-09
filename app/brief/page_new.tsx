"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import apiClient from "@/lib/api";
import { toast } from "sonner";

// New Components
import { BriefTabs } from "@/components/brief/BriefTabs";
import { BentoGrid, BentoItem } from "@/components/brief/BentoGrid";
import { ImpactMetrics } from "@/components/brief/components/ImpactMetrics";
import { SDGAlignment } from "@/components/brief/components/SDGAlignment";
import { MapProjection } from "@/components/brief/components/MapProjection";
import { EmissionsChart } from "@/components/brief/components/EmissionsChart";

function BriefContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [briefData, setBriefData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const facilityId = searchParams.get("facility");
  const selectedIds = searchParams.get("sites")?.split(",") || [];

  useEffect(() => {
    if (facilityId && selectedIds.length > 0) {
      generateBrief();
    } else {
      toast.error("Missing project data");
      router.push("/map");
    }
  }, [facilityId]);

  const generateBrief = async () => {
    setIsLoading(true);
    try {
      const polygonsData = sessionStorage.getItem("creditBuilderPolygons");
      const projectType = sessionStorage.getItem("projectType") || "reforestation";
      const bufferKm = sessionStorage.getItem("bufferKm") || "25";

      if (!polygonsData) {
        toast.error("No site data found");
        router.push("/credit-builder");
        return;
      }

      const allPolygons = JSON.parse(polygonsData);

      const response = await apiClient.generateBrief({
        facility_id: facilityId!,
        project_type: projectType,
        selected_polygon_ids: selectedIds,
        all_polygons: allPolygons,
        buffer_km: parseFloat(bufferKm),
      });

      setBriefData(response);
    } catch (error) {
      console.error("Failed to generate brief:", error);
      toast.error("Failed to generate brief", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
            <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-xl font-semibold mb-2">Generating AI-Powered Brief...</p>
          <p className="text-sm text-muted-foreground">
            AI is analyzing facility data and offset sites
          </p>
        </div>
      </div>
    );
  }

  if (!briefData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Transform data for new components
  const impactMetricsData = {
    co2_removal: briefData.metadata.total_credits_20yr,
    total_area: briefData.metadata.total_area_ha,
    timeline_years: 20,
    offset_percentage: briefData.metadata.offset_percentage,
  };

  const sdgMetrics = {
    area_ha: briefData.metadata.total_area_ha,
    co2_removal: briefData.metadata.total_credits_20yr,
    water_proximity: true, // Could be calculated from polygon data
    urban_proximity: false,
  };

  // Prepare map data
  const mapData = {
    facility: {
      latitude: briefData.metadata.facility_latitude || 51.0447, // Default to Calgary if not available
      longitude: briefData.metadata.facility_longitude || -114.0719,
      name: briefData.metadata.facility_name,
    },
    sites: selectedIds.map((id, idx) => ({
      id,
      center: [
        briefData.metadata.facility_longitude + (idx * 0.1) - 0.2, // Mock positioning
        briefData.metadata.facility_latitude + (idx * 0.1) - 0.2,
      ] as [number, number],
      area_ha: briefData.metadata.total_area_ha / selectedIds.length,
    })),
  };

  // Prepare emissions trajectory data
  const emissionsTrajectoryData = briefData.charts.credit_projection.map((item: any) => ({
    year: item.year,
    baseline: item.year === new Date().getFullYear() ? briefData.metadata.facility_emissions_2023 : undefined,
    with_offset: briefData.metadata.facility_emissions_2023 * (1 - (item.cumulative / briefData.metadata.total_credits_20yr) * (briefData.metadata.offset_percentage / 100)),
    cumulative_removal: item.cumulative,
  }));

  // Visual Dashboard Content
  const visualDashboard = (
    <div className="space-y-6">
      {/* Hero Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          Carbon Offset Impact Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          {briefData.metadata.facility_name} • {briefData.metadata.project_type.charAt(0).toUpperCase() + briefData.metadata.project_type.slice(1)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Generated {new Date(briefData.metadata.generated_at).toLocaleString()}
        </p>
      </div>

      <BentoGrid>
        {/* Map Projection - Full Width */}
        <BentoItem colSpan={4}>
          <MapProjection facility={mapData.facility} sites={mapData.sites} />
        </BentoItem>

        {/* Impact Metrics - Full Width */}
        <BentoItem colSpan={4}>
          <ImpactMetrics data={impactMetricsData} />
        </BentoItem>

        {/* SDG Alignment - Full Width */}
        <BentoItem colSpan={4}>
          <SDGAlignment 
            projectType={briefData.metadata.project_type} 
            metrics={sdgMetrics}
          />
        </BentoItem>

        {/* Emissions Trajectory Chart - Full Width */}
        <BentoItem colSpan={4}>
          <EmissionsChart
            type="area"
            title="Emissions Trajectory with Offsets"
            description="Projected facility emissions with offset impact over 20 years"
            data={emissionsTrajectoryData}
            dataKeys={[
              { key: "baseline", label: "Baseline Emissions", color: "#ef4444" },
              { key: "with_offset", label: "With Offsets", color: "#10b981" },
            ]}
          />
        </BentoItem>

        {/* Credit Projection - Half Width */}
        <BentoItem colSpan={2}>
          <EmissionsChart
            type="line"
            title="Cumulative Carbon Credits"
            description="20-year carbon credit accumulation"
            data={briefData.charts.credit_projection}
            dataKeys={[
              { key: "cumulative", label: "Cumulative Credits", color: "#22c55e" },
            ]}
          />
        </BentoItem>

        {/* Site Distribution - Half Width */}
        <BentoItem colSpan={2}>
          <EmissionsChart
            type="line"
            title="Site Credit Distribution"
            description="Annual credits by selected site"
            data={briefData.charts.site_distribution}
            dataKeys={[
              { key: "credits", label: "Annual Credits", color: "#3b82f6" },
            ]}
          />
        </BentoItem>
      </BentoGrid>
    </div>
  );

  // Formal Brief Content (existing styled markdown)
  const formalBrief = (
    <div className="max-w-4xl mx-auto">
      {/* Title Page */}
      <div className="mb-12 pb-8 border-b">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-5xl font-bold mb-3">
              Carbon Offset Project Brief
            </h1>
            <p className="text-2xl text-muted-foreground mb-4">
              {briefData.metadata.facility_name}
            </p>
          </div>
          <Badge className="text-lg px-4 py-2">
            {briefData.metadata.project_type.charAt(0).toUpperCase() + 
             briefData.metadata.project_type.slice(1)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Generated:</p>
            <p>{new Date(briefData.metadata.generated_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Platform:</p>
            <p>Lythos Carbon Intelligence</p>
          </div>
        </div>
      </div>

      {/* AI-Generated Brief with improved markdown */}
      <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-medium mt-4 mb-2 text-foreground" {...props} />,
            h4: ({node, ...props}) => <h4 className="text-lg font-medium mt-3 mb-2 text-foreground" {...props} />,
            p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-foreground/90" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 space-y-2" {...props} />,
            li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
            strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
            table: ({node, ...props}) => <table className="w-full border-collapse border border-border my-4" {...props} />,
            th: ({node, ...props}) => <th className="border border-border bg-muted px-4 py-2 text-left font-semibold" {...props} />,
            td: ({node, ...props}) => <td className="border border-border px-4 py-2" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />,
            code: ({node, inline, ...props}: any) => 
              inline ? 
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} /> :
                <code className="block bg-muted p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm" {...props} />
          }}
        >
          {briefData.brief_markdown}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p className="mb-2">Generated by Lythos Carbon Intelligence Platform</p>
        <p className="mb-2">AI-Powered Analysis • Real-time Spatial Analysis • Regulatory Compliance</p>
        <p className="text-xs">
          This brief is generated using AI analysis and should be reviewed by qualified professionals
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header - No print */}
      <div className="bg-card border-b px-6 py-4 print:hidden sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Credit Builder
          </Button>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI-Generated
            </Badge>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto p-6 md:p-8 print:p-12">
        <BriefTabs 
          visualDashboard={visualDashboard}
          formalBrief={formalBrief}
        />
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function BriefPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <BriefContent />
    </Suspense>
  );
}

