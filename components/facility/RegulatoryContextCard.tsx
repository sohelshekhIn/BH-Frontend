"use client";

import { ExternalLink, FileText, Calendar, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RegulatoryContext } from "@/types/facility";

interface RegulatoryContextCardProps {
  context: RegulatoryContext;
  facilityId: string;
}

export function RegulatoryContextCard({ context, facilityId }: RegulatoryContextCardProps) {
  const handleDownloadCSV = () => {
    // Mock CSV download
    const csvContent = `facility_id,year,co2e\n${facilityId},2023,sample_data\n`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${facilityId}_emissions_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regulatory Context</CardTitle>
        <CardDescription>Compliance and reporting information</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="method">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                GHGRP Reporting Method
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{context.ghgrp_method}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tier 3 methods provide the highest accuracy through continuous monitoring systems.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="verification">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last Verification Date
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{context.last_verification_date}</span>
                  <span className="text-xs text-muted-foreground">
                    (Third-party verified)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Annual verification ensures data accuracy and regulatory compliance.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="eccc">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                ECCC Facility Page
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Access official facility data from Environment and Climate Change Canada.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href={context.eccc_link} target="_blank" rel="noopener noreferrer">
                    Open ECCC Page
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="download">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Download Raw Data
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Export emissions data for offline analysis and reporting.
                </p>
                <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                  Download CSV
                  <FileText className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

