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
import { HumanImpactGrid } from "@/components/brief/components/HumanImpactGrid";
import { BiodiversityGrid } from "@/components/brief/components/BiodiversityGrid";
import { EmissionsDetailGrid } from "@/components/brief/components/EmissionsDetailGrid";
import { CoBenefitsGrid } from "@/components/brief/components/CoBenefitsGrid";
import { CorporateBenefitsCard } from "@/components/brief/components/CorporateBenefitsCard";

function BriefContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [briefData, setBriefData] = useState<{
    brief_markdown: string;
    charts: any;
    metadata: any;
    impact_data?: any;
  } | null>(null);
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
      const projectType =
        sessionStorage.getItem("projectType") || "reforestation";
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
          <p className="text-xl font-semibold mb-2">
            Generating AI-Powered Brief...
          </p>
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
  const facilityLat = briefData.metadata.facility_latitude || 51.0447; // Default to Calgary
  const facilityLng = briefData.metadata.facility_longitude || -114.0719;

  const mapData = {
    facility: {
      latitude: facilityLat,
      longitude: facilityLng,
      name: briefData.metadata.facility_name,
    },
    sites: selectedIds.map((id, idx) => {
      // Create a circular pattern around facility for mock site positioning
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
    }),
  };

  // Prepare emissions trajectory data with safety checks
  const emissionsTrajectoryData =
    briefData.charts?.credit_projection?.map((item: any) => ({
      year: item.year,
      baseline: briefData.metadata.facility_emissions_2023, // Show baseline for all years
      with_offset: briefData.metadata.facility_emissions_2023 - item.cumulative, // Subtract cumulative offset
      cumulative_removal: item.cumulative,
    })) || [];

  // Safe access to chart data
  const creditProjectionData = briefData.charts?.credit_projection || [];
  const siteDistributionData = briefData.charts?.site_distribution || [];

  // Visual Dashboard Content
  const visualDashboard = (
    <div className="space-y-6">
      {/* Hero Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          Carbon Offset Impact Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          {briefData.metadata.facility_name} •{" "}
          {briefData.metadata.project_type.charAt(0).toUpperCase() +
            briefData.metadata.project_type.slice(1)}
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

        {/* Human Impact Grid - Full Width */}
        {briefData.impact_data?.human_impact && (
          <BentoItem colSpan={4}>
            <HumanImpactGrid data={briefData.impact_data.human_impact} />
          </BentoItem>
        )}

        {/* Biodiversity Grid - Half Width */}
        {briefData.impact_data?.biodiversity && (
          <BentoItem colSpan={2}>
            <BiodiversityGrid data={briefData.impact_data.biodiversity} />
          </BentoItem>
        )}

        {/* Co-Benefits Grid - Half Width */}
        {briefData.impact_data?.co_benefits && (
          <BentoItem colSpan={2}>
            <CoBenefitsGrid data={briefData.impact_data.co_benefits} />
          </BentoItem>
        )}

        {/* Emissions Detail Grid - Full Width */}
        {briefData.impact_data?.emissions_detail && (
          <BentoItem colSpan={4}>
            <EmissionsDetailGrid
              data={briefData.impact_data.emissions_detail}
            />
          </BentoItem>
        )}

        {/* Corporate Benefits Card - Full Width */}
        <BentoItem colSpan={4}>
          <CorporateBenefitsCard
            industryType={
              briefData.metadata.facility_industry || "Industrial Facility"
            }
            facilityName={briefData.metadata.facility_name}
          />
        </BentoItem>

        {/* Emissions Trajectory Chart - Full Width */}
        {emissionsTrajectoryData.length > 0 && (
          <BentoItem colSpan={4}>
            <EmissionsChart
              type="area"
              title="Emissions Trajectory with Offsets"
              description="Projected facility emissions with offset impact over 20 years"
              data={emissionsTrajectoryData}
              dataKeys={[
                {
                  key: "baseline",
                  label: "Baseline Emissions",
                  color: "#ef4444",
                },
                { key: "with_offset", label: "With Offsets", color: "#10b981" },
              ]}
            />
          </BentoItem>
        )}

        {/* Credit Projection - Half Width */}
        {creditProjectionData.length > 0 && (
          <BentoItem colSpan={2}>
            <EmissionsChart
              type="line"
              title="Cumulative Carbon Credits"
              description="20-year carbon credit accumulation"
              data={creditProjectionData}
              dataKeys={[
                {
                  key: "cumulative",
                  label: "Cumulative Credits",
                  color: "#22c55e",
                },
              ]}
            />
          </BentoItem>
        )}

        {/* Site Distribution - Half Width */}
        {siteDistributionData.length > 0 && (
          <BentoItem colSpan={2}>
            <EmissionsChart
              type="bar"
              title="Site Credit Distribution"
              description="Annual credits by selected site"
              data={siteDistributionData}
              dataKeys={[
                { key: "credits", label: "Annual Credits", color: "#3b82f6" },
              ]}
              xAxisKey="id"
            />
          </BentoItem>
        )}
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
      <div className="prose prose-slate dark:prose-invert prose-lg max-w-none mb-12">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => (
              <h1
                className="text-4xl font-bold mt-12 mb-6 pb-3 border-b-2 border-primary text-foreground"
                {...props}
              />
            ),
            h2: (props) => (
              <h2
                className="text-3xl font-bold mt-10 mb-5 text-foreground"
                {...props}
              />
            ),
            h3: (props) => (
              <h3
                className="text-2xl font-semibold mt-8 mb-4 text-foreground"
                {...props}
              />
            ),
            h4: (props) => (
              <h4
                className="text-xl font-semibold mt-6 mb-3 text-foreground"
                {...props}
              />
            ),
            h5: (props) => (
              <h5
                className="text-lg font-medium mt-4 mb-2 text-foreground"
                {...props}
              />
            ),
            h6: (props) => (
              <h6
                className="text-base font-medium mt-3 mb-2 text-foreground"
                {...props}
              />
            ),
            p: (props) => (
              <p
                className="mb-5 leading-relaxed text-base text-foreground/90"
                {...props}
              />
            ),
            ul: (props) => (
              <ul
                className="list-disc ml-6 mb-6 space-y-2.5 text-foreground/90"
                {...props}
              />
            ),
            ol: (props) => (
              <ol
                className="list-decimal ml-6 mb-6 space-y-2.5 text-foreground/90"
                {...props}
              />
            ),
            li: (props) => <li className="leading-relaxed pl-1" {...props} />,
            strong: (props) => (
              <strong className="font-bold text-foreground" {...props} />
            ),
            em: (props) => (
              <em className="italic text-foreground/80" {...props} />
            ),
            table: (props) => (
              <div className="my-8 overflow-x-auto">
                <table
                  className="w-full border-collapse border border-border rounded-lg"
                  {...props}
                />
              </div>
            ),
            thead: (props) => <thead className="bg-muted/80" {...props} />,
            th: (props) => (
              <th
                className="border border-border px-4 py-3 text-left font-bold text-foreground"
                {...props}
              />
            ),
            td: (props) => (
              <td
                className="border border-border px-4 py-3 text-foreground/90"
                {...props}
              />
            ),
            tr: (props) => (
              <tr className="hover:bg-muted/50 transition-colors" {...props} />
            ),
            blockquote: ({ children, ...props }) => (
              <blockquote
                className="border-l-4 border-primary bg-primary/5 pl-6 pr-4 py-4 my-6 rounded-r-lg"
                {...props}
              >
                <div className="text-foreground/90 italic">{children}</div>
              </blockquote>
            ),
            hr: (props) => (
              <hr className="my-8 border-t-2 border-border" {...props} />
            ),
            code: (props: any) =>
              props.inline ? (
                <code
                  className="bg-muted/80 px-2 py-1 rounded text-sm font-mono text-foreground border border-border/50"
                  {...props}
                />
              ) : (
                <code
                  className="block bg-muted/50 p-5 rounded-lg my-6 overflow-x-auto font-mono text-sm border border-border"
                  {...props}
                />
              ),
            pre: (props) => (
              <pre
                className="bg-muted/50 p-5 rounded-lg my-6 overflow-x-auto border border-border"
                {...props}
              />
            ),
            a: (props) => (
              <a
                className="text-primary hover:text-primary/80 underline font-medium transition-colors"
                {...props}
              />
            ),
          }}
        >
          {briefData.brief_markdown}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p className="mb-2">Generated by Lythos Carbon Intelligence Platform</p>
        <p className="mb-2">
          AI-Powered Analysis • Real-time Spatial Analysis • Regulatory
          Compliance
        </p>
        <p className="text-xs">
          This brief is generated using AI analysis and should be reviewed by
          qualified professionals
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
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
