"use client";

import { useRouter } from "next/navigation";
import { Map, Leaf, FileText, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <main className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-12 w-12 text-emerald-500" />
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Lythos
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            AI-powered carbon offset feasibility for Canadian industrial facilities
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Explore emissions data, analyze carbon credit opportunities, and generate AI compliance briefs in minutes.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-500/20" onClick={() => router.push("/map")}>
            <CardHeader>
              <Map className="h-10 w-10 mb-2 text-emerald-600" />
              <CardTitle>Emissions Explorer</CardTitle>
              <CardDescription>
                Interactive map with 800+ Canadian facilities, real-time emissions data, and protected area overlays
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full text-emerald-600 hover:text-emerald-700">
                Explore Map →
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-500/20" onClick={() => router.push("/credit-builder")}>
            <CardHeader>
              <Leaf className="h-10 w-10 mb-2 text-blue-600" />
              <CardTitle>Credit Builder</CardTitle>
              <CardDescription>
                AI-powered suitability analysis with buffer zones, constraint mapping, and credit estimates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                Build Credits →
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-500/20" onClick={() => router.push("/brief")}>
            <CardHeader>
              <FileText className="h-10 w-10 mb-2 text-purple-600" />
              <CardTitle>AI Brief Generator</CardTitle>
              <CardDescription>
                Generate detailed compliance briefs with regulatory analysis and project recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full text-purple-600 hover:text-purple-700">
                Generate Brief →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="bg-card/50 rounded-lg p-6 mb-8 border">
          <h2 className="text-lg font-semibold mb-4 text-center">What's Inside</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Real GHGRP Data</div>
                <div className="text-xs text-muted-foreground">800+ facilities with historical emissions (2019-2023)</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Protected Areas</div>
                <div className="text-xs text-muted-foreground">CPCAD & Indigenous territory overlays with IUCN ratings</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">AI-Powered Analysis</div>
                <div className="text-xs text-muted-foreground">Automated brief generation with compliance checks</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" onClick={() => router.push("/map")} className="font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
            Start Exploring →
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Built for sustainability leads, environmental consultants, and compliance teams
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">800+</div>
            <div className="text-sm text-muted-foreground">Canadian Facilities</div>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">5 Years</div>
            <div className="text-sm text-muted-foreground">Historical Data</div>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">&lt;5min</div>
            <div className="text-sm text-muted-foreground">AI Brief Generation</div>
          </div>
        </div>
      </main>
    </div>
  );
}
