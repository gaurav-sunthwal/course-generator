"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps {
  planName: string;
  planPrice: string;
  variant?: "default" | "primary";
}

export function UpgradeButton({
  planName,
  planPrice,
  variant = "default",
}: UpgradeButtonProps) {
  const handlePayment = () => {
    console.log("Handle Payment of", planName, "price is", planPrice);
    // Add your payment logic here
  };

  return (
    <Button
      className={cn(
        "mt-8 w-full",
        variant === "primary"
          ? "bg-background text-primary hover:bg-background/90"
          : ""
      )}
      variant={variant === "primary" ? "secondary" : "default"}
      onClick={handlePayment}
    >
      Go Premium
    </Button>
  );
}
