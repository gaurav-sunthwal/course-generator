"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  isPopular?: boolean;
}

interface UpgradeClientProps {
  plans: Plan[];
}

export function UpgradeClient({ plans }: UpgradeClientProps) {
  return (
    <div className="py-16 px-4 mx-auto max-w-7xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock the power of AI to create complete courses based on your input.
          Select the plan that best fits your learning or teaching needs.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <SubscriptionCard
            key={index}
            {...plan}
            variant={plan.isPopular ? "primary" : "default"}
          />
        ))}
      </div>
    </div>
  );
}

interface PlanProps {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  isPopular?: boolean;
  variant?: "default" | "primary";
}

const SubscriptionCard = ({
  name,
  price,
  description,
  features,
  isPopular,
  variant = "default",
}: PlanProps) => {
  const handlePayment = () => {
    console.log("Handle Payment of", name, "price is", price);
    // Add your payment logic here
  };

  return (
    <>
      <Card
        className={cn(
          "relative flex flex-col p-6 bg-background",
          variant === "primary" && "bg-primary text-primary-foreground"
        )}
      >
        {isPopular && (
          <div className="absolute right-6 top-6 rounded-full bg-background px-3 py-1 text-sm font-medium dark:text-white text-black">
            Popular
          </div>
        )}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{name}</h3>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">₹{price}</span>
            <span className="ml-1 text-muted-foreground">/month</span>
          </div>
          <p
            className={cn(
              "text-muted-foreground",
              variant === "primary" && "text-primary-foreground/90"
            )}
          >
            {description}
          </p>
        </div>
        <div className="mt-8 space-y-4 flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check
                className={cn(
                  "h-5 w-5 shrink-0",
                  variant === "primary"
                    ? "text-primary-foreground"
                    : "text-primary"
                )}
              />
              <span className="ml-3">{feature.text}</span>
            </div>
          ))}
        </div>
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
      </Card>
    </>
  );
};
