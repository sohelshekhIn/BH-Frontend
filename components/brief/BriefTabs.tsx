"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, FileText } from "lucide-react";

interface BriefTabsProps {
  visualDashboard: React.ReactNode;
  formalBrief: React.ReactNode;
}

export function BriefTabs({ visualDashboard, formalBrief }: BriefTabsProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Visual Dashboard
        </TabsTrigger>
        <TabsTrigger value="formal" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Formal Brief
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-0">
        {visualDashboard}
      </TabsContent>

      <TabsContent value="formal" className="mt-0">
        {formalBrief}
      </TabsContent>
    </Tabs>
  );
}

