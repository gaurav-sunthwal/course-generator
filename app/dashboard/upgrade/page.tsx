import { Metadata } from "next";
import { UpgradeClient } from "./_components/UpgradeClient";

export const metadata: Metadata = {
  title: "Upgrade Plans - Course Generator",
  description:
    "Choose from our premium plans to unlock advanced features and unlimited course generation capabilities.",
  keywords: [
    "upgrade",
    "premium plans",
    "course generator",
    "AI courses",
    "subscription",
  ],
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
  return <UpgradeClient plans={plans} />;
}
