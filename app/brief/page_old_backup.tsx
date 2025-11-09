"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import apiClient from "@/lib/api";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header - No print */}
      <div className="bg-card border-b px-6 py-4 print:hidden sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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

      {/* Brief Content */}
      <div className="max-w-6xl mx-auto p-8 print:p-12">
        {/* Title Page */}
        <div className="mb-12 pb-8 border-b print:mb-16">
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

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sites Selected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{briefData.metadata.sites_count}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {briefData.metadata.total_area_ha.toFixed(1)} hectares
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Annual Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {(briefData.metadata.total_credits_annual / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-muted-foreground mt-1">tCO₂e per year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                20-Year Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {(briefData.metadata.total_credits_20yr / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-muted-foreground mt-1">tCO₂e total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Emissions Offset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {briefData.metadata.offset_percentage.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">of facility</p>
            </CardContent>
          </Card>
        </div>

        {/* AI-Generated Brief */}
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

        {/* Charts Section */}
        <div className="space-y-8 mb-12">
          {/* 20-Year Credit Projection */}
          <Card>
            <CardHeader>
              <CardTitle>20-Year Carbon Credit Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={briefData.charts.credit_projection}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [
                      `${(value / 1000).toFixed(1)}k tCO₂e`,
                      "",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#22c55e"
                    strokeWidth={3}
                    name="Cumulative Credits"
                    dot={{ fill: "#22c55e", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Site Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Sites Credit Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={briefData.charts.site_distribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="id" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [
                      `${(value / 1000).toFixed(1)}k tCO₂e/yr`,
                      "Annual Credits",
                    ]}
                  />
                  <Bar dataKey="credits" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t print:pt-12">
          <p className="mb-2">Generated by Lythos Carbon Intelligence Platform</p>
          <p className="mb-2">AI-Powered Analysis • Real-time Spatial Analysis • Regulatory Compliance</p>
          <p className="text-xs">
            This brief is generated using AI analysis and should be reviewed by qualified professionals
          </p>
        </div>
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
          .print\\:page-break-after {
            page-break-after: always;
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

