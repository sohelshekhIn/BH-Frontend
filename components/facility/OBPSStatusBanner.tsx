"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OBPSStatus } from "@/types/facility";

interface OBPSStatusBannerProps {
  status: OBPSStatus;
}

export function OBPSStatusBanner({ status }: OBPSStatusBannerProps) {
  return (
    <Alert variant={status.covered ? "default" : "destructive"} className={status.covered ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""}>
      {status.covered ? (
        <CheckCircle2 className="h-4 w-4 text-blue-500" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle className={status.covered ? "text-blue-900 dark:text-blue-100" : ""}>
        {status.covered ? "OBPS Covered Facility" : "Not OBPS Covered"}
      </AlertTitle>
      <AlertDescription className={status.covered ? "text-blue-800 dark:text-blue-200" : ""}>
        {status.compliance_info ||
          (status.covered
            ? "Offset credits can be used for compliance under OBPS rules (Section 12)."
            : "Offset projects can support voluntary carbon neutrality goals.")}
      </AlertDescription>
    </Alert>
  );
}

