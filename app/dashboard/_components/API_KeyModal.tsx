"use client";

import React, { useState } from "react";
import { Check,  Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onSubmit,
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Don't render if modal is not open
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    if (error) {
      setError("");
    }
  };

  const validateApiKey = (key: string) => {
    if (!key.trim()) {
      return "API key is required";
    }
    if (key.length < 10) {
      return "API key seems too short (minimum 10 characters)";
    }
    // You can add more specific validation based on your API key format
    // if (!/^[a-zA-Z0-9-_]+$/.test(key)) {
    //   return "API key contains invalid characters";
    // }
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateApiKey(apiKey);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      // Store API key in localStorage
      localStorage.setItem("apiKey", apiKey);
      
      // Simulate API validation or processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(apiKey);
      setIsSuccess(true);

      // Close modal after showing success message
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setApiKey("");
      }, 2000);
    } catch (error) {
      console.error("Error saving API key:", error);
      setError("Failed to save API key. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 rounded-xl bg-gradient-to-br from-[#1a1124] to-[#2a1a34] border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
   

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
            <p className="text-gray-300">Your API key has been saved securely.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">API Key Required</h2>
              <p className="text-gray-300 text-sm">
                Please enter your API key to access all features. It will be stored securely in your browser.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-gray-200">
                  API Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your API key"
                  className={`bg-purple-900/30 border-purple-800/50 text-white placeholder:text-gray-500 focus:border-purple-400 ${
                    error ? "border-red-500" : ""
                  }`}
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  "Save API Key"
                )}
              </Button>
            </div>

            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
              <p className="text-xs text-blue-300">
                🔒 Your API key will be stored locally in your browser and never shared with third parties.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}