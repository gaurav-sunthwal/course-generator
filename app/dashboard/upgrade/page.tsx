import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";
import { UpgradeButton } from "./_components/UpgradeButton";

export const metadata: Metadata = {
  title: "Upgrade Plans - Course Generator",
  description: "Choose from our premium plans to unlock advanced features and unlimited course generation capabilities.",
  keywords: ["upgrade", "premium plans", "course generator", "AI courses", "subscription"],
  openGraph: {
    title: "Upgrade Plans - Course Generator",
    description: "Choose from our premium plans to unlock advanced features.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upgrade Plans - Course Generator",
    description: "Choose from our premium plans to unlock advanced features.",
  },
};

const plans = [
  {
    name: "Basic Plan",
    price: "120",
    description:
      "Get started with our Basic Plan kickstart your learning journey",
    features: [
      { text: "Unlimited Course Generation" },
      { text: "Basic Support" },
      { text: "Simple Content Customization" },
    ],
  },
  {
    name: "Premium Plan",
    price: "230",
    description: "Premium Plan for a comprehensive learning experience.",
    features: [
      { text: "Unlimited Course Generation" },
      { text: "Priority Support" },
      { text: "Advanced Content Customization Options" },
    ],
    isPopular: true,
  },
  {
    name: "VIP Plan",
    price: "330",
    description:
      "Go Pro and take your learning to the next level with personalized experience.",
    features: [
      { text: "Unlimited Course Generation" },
      { text: "24/7 VIP Support" },
      { text: "Full Customization of Course Content" },
      { text: "Exclusive AI Course Insights" },
    ],
  },
];

export default function UpgradePage() {
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

interface PlanFeature {
  text: string;
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
        <UpgradeButton
          planName={name}
          planPrice={price}
          variant={variant}
        />
      </Card>
    </>
  );
};
