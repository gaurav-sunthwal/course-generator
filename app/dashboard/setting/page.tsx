"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  User, 
  Mail, 
  Key, 
  Github, 
  Linkedin, 
  Twitter, 
  Edit, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Shield,
  Settings,
  Globe,
  Lock,
  AlertCircle,
  Loader
} from "lucide-react";
import Image from "next/image";

// Define a type for our notification state for better type safety
type Notification = {
  message: string;
  type: "success" | "error";
};

export default function SettingsPage() {
  // --- HOOKS ARE ALL CALLED AT THE TOP ---
  const { user, isLoaded, isSignedIn } = useUser();
  const [apiKey, setApiKey] = useState("");
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  // Use a more robust type for notification state
  const [notification, setNotification] = useState<Notification | null>(null);

  // This useEffect hook is now at the top level, respecting the Rules of Hooks.
  useEffect(() => {
    // We still check for isLoaded and isSignedIn inside the effect's body.
    if (isLoaded && isSignedIn) {
      const storedApiKey = localStorage.getItem("apiKey");
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }
  }, [isLoaded, isSignedIn]);
  
  // --- CONDITIONAL RENDERING AFTER HOOKS ---
  // Loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn || !user) { // Added !user check for type safety
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please sign in to access your settings.</p>
        </div>
      </div>
    );
  }

  // --- COMPONENT LOGIC & FUNCTIONS ---
  // User data can now be safely extracted
  const userData = {
    name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
    email: user.primaryEmailAddress?.emailAddress || 'No email',
    avatar: user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=7c3aed&color=fff&size=150`,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    socialMedia: {
      github: (user.publicMetadata?.github as string) || "#",
      linkedin: (user.publicMetadata?.linkedin as string) || "#",
      twitter: (user.publicMetadata?.twitter as string) || "#",
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Clear by setting to null
  };

  const handleEditApiKey = () => {
    setTempApiKey(apiKey);
    setIsEditingApiKey(true);
  };

  const handleSaveApiKey = async () => {
    if (!tempApiKey.trim()) {
      showNotification("API key cannot be empty", "error");
      return;
    }
    if (tempApiKey.length < 10) {
      showNotification("API key must be at least 10 characters", "error");
      return;
    }
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("apiKey", tempApiKey);
      setApiKey(tempApiKey);
      setIsEditingApiKey(false);
      showNotification("API key updated successfully", "success");
    } catch (error: unknown) {
        let message = "Failed to save API key";
      
        if (error instanceof Error) {
          message = error.message;
        }
      
        showNotification(message, "error");
      } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTempApiKey("");
    setIsEditingApiKey(false);
  };

  const handleDeleteApiKey = () => {
    if (confirm("Are you sure you want to remove your API key? You'll need to enter it again to use API features.")) {
      localStorage.removeItem("apiKey");
      setApiKey("");
      showNotification("API key removed", "success");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Copied to clipboard!", "success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8 text-purple-400" />
            Settings
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          } flex items-center gap-2`}>
            <AlertCircle className="h-4 w-4" />
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                Profile
              </h2>
              
              <div className="text-center mb-6">
                <Image
                  src={userData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500/30 object-cover"
                />
                <h3 className="text-lg font-medium text-white">{userData.name}</h3>
                <p className="text-gray-400 text-sm flex items-center justify-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {userData.email}
                </p>
                {user.createdAt && (
                  <p className="text-gray-500 text-xs mt-1">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Social Links
                </h4>
                
                <div className="space-y-2">
                  <a
                    href={userData.socialMedia.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors ${
                      userData.socialMedia.github === "#" 
                        ? "text-gray-500 cursor-not-allowed" 
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => userData.socialMedia.github === "#" && e.preventDefault()}
                  >
                    <Github className="h-4 w-4" />
                    <span className="text-sm">GitHub</span>
                  </a>
                  
                  <a
                    href={userData.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors ${
                      userData.socialMedia.linkedin === "#" 
                        ? "text-gray-500 cursor-not-allowed" 
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => userData.socialMedia.linkedin === "#" && e.preventDefault()}
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  
                  <a
                    href={userData.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors ${
                      userData.socialMedia.twitter === "#" 
                        ? "text-gray-500 cursor-not-allowed" 
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => userData.socialMedia.twitter === "#" && e.preventDefault()}
                  >
                    <Twitter className="h-4 w-4" />
                    <span className="text-sm">Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Key Management */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-400" />
                API Key Management
              </h2>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-1">Privacy Notice</h4>
                    <p className="text-xs text-blue-300">
                      Your API key is stored locally in your browser and is never sent to our database. 
                      It remains on your device for security and privacy.
                    </p>
                  </div>
                </div>
              </div>

              {apiKey ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Current API Key</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                        title={showApiKey ? "Hide API key" : "Show API key"}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey)}
                        className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded hover:bg-purple-600/30"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {isEditingApiKey ? (
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter new API key"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveApiKey}
                          disabled={saving}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {saving ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="font-mono text-sm p-3 bg-black/20 rounded-lg border border-white/10">
                        {showApiKey ? apiKey : `${'•'.repeat(apiKey.length - 4)}${apiKey.slice(-4)}`}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditApiKey}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={handleDeleteApiKey}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No API Key Set</h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    Add your API key to access advanced features
                  </p>
                  <button
                    onClick={() => {
                      setIsEditingApiKey(true);
                      setTempApiKey("");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg mx-auto"
                  >
                    <Key className="h-4 w-4" />
                    Add API Key
                  </button>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Dark Mode</h3>
                    <p className="text-xs text-gray-400">Use dark theme across the application</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Notifications</h3>
                    <p className="text-xs text-gray-400">Receive updates about your courses</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Auto-save</h3>
                    <p className="text-xs text-gray-400">Automatically save your progress</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Storage Information</h2>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-400 mb-1">Local Storage</h4>
                    <p className="text-xs text-amber-300">
                      Your settings and API key are stored locally in your browser. 
                      Clearing browser data will remove these settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => {
                    if (confirm("This will clear all locally stored data including your API key. Are you sure?")) {
                      localStorage.clear();
                      sessionStorage.clear();
                      showNotification("All local data cleared", "success");
                      setApiKey("");
                    }
                  }}
                  className="block text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear all local data
                </button>
                
                <div className="text-xs text-gray-500">
                  <p>User ID: {user.id}</p>
                  <p>Last sign in: {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'Never'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}