"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Trophy, Users2, TrendingUp, Star, Newspaper, Shield } from "lucide-react";

interface CorporateBenefitsCardProps {
  industryType: string;
  facilityName: string;
}

export function CorporateBenefitsCard({ industryType, facilityName }: CorporateBenefitsCardProps) {
  // Industry-specific benefits mapping
  const getIndustryBenefits = (industry: string) => {
    const normalizedIndustry = industry.toLowerCase();
    
    // Oil & Gas / Energy
    if (normalizedIndustry.includes('oil') || normalizedIndustry.includes('gas') || 
        normalizedIndustry.includes('petroleum') || normalizedIndustry.includes('energy')) {
      return {
        icon: Shield,
        color: "bg-blue-600",
        primaryBenefit: "Enhanced Social License to Operate",
        benefits: [
          "Demonstrates proactive climate action beyond regulatory compliance",
          "Strengthens relationships with Indigenous communities through land stewardship",
          "Positions company as energy transition leader in traditionally high-emission sector",
          "Provides tangible ESG metrics for investor relations and sustainability reporting",
          "Creates positive narrative for media engagement and stakeholder communications",
          "Supports workforce recruitment in competitive talent market for sustainability-focused professionals"
        ]
      };
    }
    
    // Mining
    if (normalizedIndustry.includes('mining') || normalizedIndustry.includes('mineral')) {
      return {
        icon: Trophy,
        color: "bg-emerald-600",
        primaryBenefit: "Industry Leadership & Operational Excellence",
        benefits: [
          "Demonstrates commitment to environmental stewardship and reclamation excellence",
          "Differentiates from competitors in sustainability rankings and certifications",
          "Strengthens community relations in mining regions through ecosystem restoration",
          "Provides co-benefits aligned with mine closure and rehabilitation plans",
          "Enhances corporate reputation with regulators and certification bodies",
          "Creates employee pride and engagement through visible environmental impact"
        ]
      };
    }
    
    // Manufacturing
    if (normalizedIndustry.includes('manufacturing') || normalizedIndustry.includes('production')) {
      return {
        icon: Building2,
        color: "bg-purple-600",
        primaryBenefit: "Supply Chain & Brand Value Enhancement",
        benefits: [
          "Meets growing customer demands for carbon-neutral or climate-positive products",
          "Strengthens position in supply chains requiring carbon accounting and reduction",
          "Provides marketing differentiation in competitive consumer markets",
          "Aligns with corporate climate commitments and Science-Based Targets (SBTi)",
          "Enhances B2B relationships with sustainability-focused procurement policies",
          "Supports premium product positioning based on environmental credentials"
        ]
      };
    }
    
    // Utilities / Power Generation
    if (normalizedIndustry.includes('electric') || normalizedIndustry.includes('utilities') || 
        normalizedIndustry.includes('power')) {
      return {
        icon: TrendingUp,
        color: "bg-amber-600",
        primaryBenefit: "Energy Transition Leadership",
        benefits: [
          "Demonstrates balanced approach to energy security and decarbonization",
          "Provides nature-based solutions complementing renewable energy investments",
          "Strengthens regulatory relationships through proactive climate action",
          "Creates positive narrative for ratepayers and public utility commissions",
          "Aligns with provincial and federal clean electricity regulations",
          "Positions utility as climate solution provider, not just energy supplier"
        ]
      };
    }
    
    // Default for other industries
    return {
      icon: Star,
      color: "bg-indigo-600",
      primaryBenefit: "Corporate Sustainability & Brand Differentiation",
      benefits: [
        "Achieves measurable progress toward corporate climate goals and net-zero commitments",
        "Enhances ESG performance metrics for investor relations and sustainability reporting",
        "Strengthens stakeholder trust through transparent climate action",
        "Creates competitive advantage in sustainability-conscious markets",
        "Provides authentic content for corporate communications and annual reports",
        "Supports employee engagement and recruitment through environmental leadership"
      ]
    };
  };

  const industryData = getIndustryBenefits(industryType);
  const IconComponent = industryData.icon;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            Corporate & Reputational Benefits
          </CardTitle>
          <Badge className={`${industryData.color} text-white`}>
            {industryType}
          </Badge>
        </div>
        <div className={`${industryData.color} bg-opacity-10 dark:bg-opacity-20 rounded-lg p-3 mt-2`}>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper className="h-4 w-4" />
            <span className="font-semibold text-sm">Key Strategic Advantage</span>
          </div>
          <p className="text-sm font-medium">{industryData.primaryBenefit}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Users2 className="h-4 w-4" />
              Industry-Specific Benefits
            </h4>
            <ul className="space-y-2.5">
              {industryData.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm">
                  <span className="text-emerald-600 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-muted-foreground leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-sm mb-2">Measurable PR Impact</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="font-medium text-muted-foreground">ESG Reporting</div>
                <div className="font-bold">Enhanced Scores</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Media Coverage</div>
                <div className="font-bold">Positive Stories</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Stakeholder Trust</div>
                <div className="font-bold">Improved Relations</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Brand Value</div>
                <div className="font-bold">Differentiation</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground italic">
              These benefits are specific to <strong>{facilityName}</strong>'s position in the{" "}
              <strong>{industryType}</strong> sector and represent strategic advantages beyond 
              carbon credit value.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

