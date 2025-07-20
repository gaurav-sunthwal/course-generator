"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Brain,
  Target,
  Lightbulb,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ==================== CONTENT CONFIGURATION ====================
// Centralized object for all page content, making edits easy.
const CONTENT_CONFIG = {
  branding: {
    name: "CourseCrafter AI",
    tagline: "AI-Powered Course Generation",
  },

  hero: {
    badge: "Transform Any Topic Into Professional Courses",
    title: {
      main: "Create",
      highlight: "Masterful Courses",
      subtitle: "on Any Subject",
    },
    description:
      "Transform any topic into a comprehensive, engaging course with our AI-powered platform. From programming and data science to marketing, cooking, or quantum physics - create professional courses instantly.",
    buttons: {
      primary: { text: "Start Creating Now", route: "/create" },
      secondary: { text: "Explore Courses", route: "/dashboard/explore" },
    },
  },

  stats: [
    { number: "50K+", label: "Courses Created" },
    { number: "2M+", label: "Students Reached" },
    { number: "500+", label: "Topics Covered" },
    { number: "15min", label: "Avg Creation Time" },
  ],

  features: [
    {
      icon: Brain,
      title: "Universal AI Generation",
      description:
        "Advanced machine learning creates comprehensive course structures for any subject - from technical skills to creative arts, languages to business strategy.",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Target,
      title: "Adaptive Learning Paths",
      description:
        "Courses automatically adjust to different skill levels, learning styles, and objectives. Perfect for beginners to experts in any field.",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Clock,
      title: "10x Faster Creation",
      description:
        "Generate months of structured content in minutes. Whether it's Python programming, digital marketing, or cooking masterclasses.",
      color: "from-green-400 to-emerald-400",
    },
  ],

  process: [
    {
      number: "01",
      title: "Define Your Topic",
      description:
        "Simply describe what you want to teach - any subject, skill level, or learning objective",
      icon: Lightbulb,
    },
    {
      number: "02",
      title: "AI Magic Happens",
      description:
        "Our neural networks analyze your topic and generate comprehensive course structures with lessons, activities, and assessments",
      icon: Sparkles,
    },
    {
      number: "03",
      title: "Customize & Polish",
      description:
        "Review, edit, and add your personal expertise to the generated content. Make it uniquely yours",
      icon: Star,
    },
    {
      number: "04",
      title: "Launch & Impact",
      description:
        "Deploy your course and start transforming lives with knowledge in any field",
      icon: Target,
    },
  ],

  courseExamples: [
    {
      title: "Master Python Programming",
      category: "Programming",
      description: "From zero to advanced Python development",
      lessons: 25,
      duration: "40 hours",
      level: "Beginner to Advanced",
    },
    {
      title: "Digital Marketing Mastery",
      category: "Business",
      description: "Complete guide to modern marketing strategies",
      lessons: 18,
      duration: "25 hours",
      level: "Intermediate",
    },
    {
      title: "Data Science Bootcamp",
      category: "Data Science",
      description: "Machine learning and analytics fundamentals",
      lessons: 30,
      duration: "50 hours",
      level: "Beginner",
    },
  ],

  navigation: [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Examples", href: "#examples" },
    { name: "Pricing", href: "#pricing" },
  ],

  cta: {
    title: "Ready to Transform",
    highlight: "Any Subject Into Courses?",
    description:
      "Join thousands of educators, trainers, and entrepreneurs who are revolutionizing learning with AI-powered course creation across every imaginable topic.",
    benefits: [
      "Works with any subject",
      "No technical skills required",
      "Free to get started",
    ],
  },

  footer: {
    sections: [
      {
        title: "Product",
        items: ["Features", "Course Templates", "API Access", "Integrations"],
      },
      {
        title: "Use Cases",
        items: [
          "Corporate Training",
          "Online Education",
          "Personal Development",
          "Skill Building",
        ],
      },
      {
        title: "Support",
        items: ["Help Center", "Community", "Contact", "Documentation"],
      },
    ],
  },
};

const CourseCrafterLanding = () => {
  // State management for theme, menu, and form input
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  // Hooks for scroll-based animations
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Effect to toggle dark class on the root HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Dynamic theme object for Tailwind classes
  const theme = {
    bg: isDark
      ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50",
    text: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    textMuted: isDark ? "text-gray-400" : "text-gray-500",
    card: isDark
      ? "from-slate-800/50 to-slate-900/50"
      : "from-white/80 to-gray-50/80",
    border: isDark ? "border-slate-700/50" : "border-gray-200/50",
    navBg: isDark ? "bg-slate-800/95" : "bg-white/95",
    ctaBg: isDark
      ? "from-purple-600/20 to-pink-600/20"
      : "from-purple-100 to-pink-100",
    ctaBorder: isDark ? "border-purple-500/30" : "border-purple-200",
    inputBg: isDark ? "bg-white/10" : "bg-gray-100/80",
    inputBorder: isDark ? "border-white/20" : "border-gray-300",
    footerBorder: isDark ? "border-slate-800" : "border-gray-200",
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  type FloatingVariants = {
    floating: {
      y: number[];
      transition: {
        duration: number;
        repeat: number;
        repeatType: "reverse" | "loop" | "mirror";
        ease: string;
      };
    };
  };

  const floatingVariants: FloatingVariants = {
    floating: {
      y: [-20, 20],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };
  // Navigation handler for smooth scrolling and routing
  const handleNavClick = (href: string) => {
    if (href.startsWith("/dashboard") || href.startsWith("/create")) {
      // In a real Next.js app, you'd use the useRouter hook
      router.push(href);

      // window.location.href = href; // For demonstration
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };
  // Form submission handler
  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    console.log("Email submitted:", email);
    alert(`Thank you for your interest! We've received your email: ${email}`);
    setEmail("");
  };

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} overflow-hidden transition-colors duration-500`}
    >
      {/* Animated Background */}
      <motion.div style={{ y: bgY }} className="fixed inset-0 opacity-20">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20"
              : "bg-gradient-to-r from-blue-400/10 to-purple-400/10"
          }`}
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 ${
              isDark ? "bg-white" : "bg-purple-400"
            } rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 p-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {CONTENT_CONFIG.branding.name}
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {CONTENT_CONFIG.navigation.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`${theme.textSecondary} hover:${theme.text} transition-colors duration-300 cursor-pointer`}
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.button>
            ))}

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full ${theme.inputBg} backdrop-blur-sm`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            <motion.button
              onClick={() =>
                handleNavClick(CONTENT_CONFIG.hero.buttons.primary.route)
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 text-white"
            >
              {CONTENT_CONFIG.hero.buttons.primary.text.split(" ")[0]}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme.inputBg} backdrop-blur-sm`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${theme.navBg} backdrop-blur-lg rounded-2xl mt-4 p-6`}
            >
              {CONTENT_CONFIG.navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full text-left py-3 ${theme.textSecondary} hover:${theme.text} transition-colors`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() =>
                  handleNavClick(CONTENT_CONFIG.hero.buttons.primary.route)
                }
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-full font-semibold text-white"
              >
                {CONTENT_CONFIG.hero.buttons.primary.text}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY }}
        className="relative z-10 container mx-auto px-6 pt-20 pb-32"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <span
              className={`inline-flex items-center space-x-2 bg-gradient-to-r ${theme.ctaBg} border ${theme.ctaBorder} rounded-full px-6 py-2 text-sm font-medium backdrop-blur-sm`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{CONTENT_CONFIG.hero.badge}</span>
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
          >
            {CONTENT_CONFIG.hero.title.main}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent block">
              {CONTENT_CONFIG.hero.title.highlight}
            </span>
            <span className={`text-4xl md:text-6xl ${theme.textSecondary}`}>
              {CONTENT_CONFIG.hero.title.subtitle}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className={`text-xl md:text-2xl ${theme.textSecondary} mb-12 max-w-3xl mx-auto leading-relaxed`}
          >
            {CONTENT_CONFIG.hero.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <motion.button
              onClick={() =>
                handleNavClick(CONTENT_CONFIG.hero.buttons.primary.route)
              }
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-2xl font-bold text-lg flex items-center space-x-2 transition-all duration-300 text-white"
            >
              <Plus className="w-5 h-5" />
              <span>{CONTENT_CONFIG.hero.buttons.primary.text}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={() =>
                handleNavClick(CONTENT_CONFIG.hero.buttons.secondary.route)
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group flex items-center space-x-2 ${theme.textSecondary} hover:${theme.text} transition-colors`}
            >
              <div
                className={`w-12 h-12 ${theme.inputBg} backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-colors`}
              >
                <Search className="w-5 h-5 ml-1" />
              </div>
              <span className="font-semibold">
                {CONTENT_CONFIG.hero.buttons.secondary.text}
              </span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {CONTENT_CONFIG.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className={`${theme.textMuted} text-sm mt-1`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Course Preview */}
        <motion.div
          variants={floatingVariants}
          animate="floating"
          className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden xl:block"
        >
          <div
            className={`bg-gradient-to-br ${theme.card} backdrop-blur-xl border ${theme.border} rounded-2xl p-6 w-80 shadow-2xl`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className={`text-sm ${theme.textSecondary} mb-2`}>
              {CONTENT_CONFIG.courseExamples[0].title}
            </div>
            <div className={`text-xs ${theme.textMuted} mb-4`}>
              {CONTENT_CONFIG.courseExamples[0].lessons} lessons •{" "}
              {CONTENT_CONFIG.courseExamples[0].duration}
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-full"></div>
              <div
                className={`h-2 ${
                  isDark ? "bg-slate-700" : "bg-gray-300"
                } rounded-full w-3/4`}
              ></div>
              <div
                className={`h-2 ${
                  isDark ? "bg-slate-700" : "bg-gray-300"
                } rounded-full w-1/2`}
              ></div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Works with{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Every Subject
              </span>
            </h2>
            <p className={`text-xl ${theme.textSecondary} max-w-3xl mx-auto`}>
              Our AI understands pedagogy across all domains - from technical
              subjects to creative arts, business to personal development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {CONTENT_CONFIG.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    isDark
                      ? "from-purple-600/20 to-pink-600/20"
                      : "from-purple-200/50 to-pink-200/50"
                  } rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100`}
                ></div>
                <div
                  className={`relative bg-gradient-to-br ${theme.card} backdrop-blur-xl border ${theme.border} rounded-3xl p-8 h-full`}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className={`${theme.textSecondary} leading-relaxed`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Examples Section */}
      <section id="examples" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Course Examples
              </span>
            </h2>
            <p className={`text-xl ${theme.textSecondary} max-w-3xl mx-auto`}>
              See how our AI transforms different topics into comprehensive
              learning experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {CONTENT_CONFIG.courseExamples.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-gradient-to-br ${theme.card} backdrop-blur-xl border ${theme.border} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-400">
                    {course.category}
                  </span>
                  <span className={`text-xs ${theme.textMuted}`}>
                    {course.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{course.title}</h3>
                <p
                  className={`${theme.textSecondary} text-sm mb-4 leading-relaxed`}
                >
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className={theme.textMuted}>
                    {course.lessons} lessons
                  </span>
                  <span className={theme.textMuted}>{course.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Simple{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                4-Step Process
              </span>
            </h2>
            <p className={`text-xl ${theme.textSecondary} max-w-2xl mx-auto`}>
              From any topic to comprehensive course in just four simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {CONTENT_CONFIG.process.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className={`flex items-center mb-16 ${
                  index % 2 === 1 ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className={`${index % 2 === 1 ? "text-right" : ""}`}>
                    <div
                      className={`text-6xl font-bold ${
                        isDark ? "text-purple-400/30" : "text-purple-300/50"
                      } mb-2`}
                    >
                      {step.number}
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                    <p
                      className={`text-xl ${theme.textSecondary} leading-relaxed max-w-md`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="mx-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25"
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>
                </div>

                <div className="flex-1">
                  {index < CONTENT_CONFIG.process.length - 1 && (
                    <motion.div
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                      viewport={{ once: true }}
                      className={`hidden md:block ${
                        index % 2 === 1 ? "ml-auto" : ""
                      }`}
                    >
                      <svg width="200" height="100" className="opacity-30">
                        <motion.path
                          d={
                            index % 2 === 0
                              ? "M 0 50 Q 100 0 200 50"
                              : "M 200 50 Q 100 0 0 50"
                          }
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`relative overflow-hidden bg-gradient-to-r ${theme.ctaBg} backdrop-blur-xl border ${theme.ctaBorder} rounded-3xl p-16 text-center`}
          >
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                {CONTENT_CONFIG.cta.title}
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {CONTENT_CONFIG.cta.highlight}
                </span>
              </h2>
              <p
                className={`text-xl ${theme.textSecondary} mb-12 max-w-2xl mx-auto`}
              >
                {CONTENT_CONFIG.cta.description}
              </p>

              <form
                onSubmit={handleEmailSubmit}
                className="max-w-md mx-auto mb-8"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`flex-1 px-6 py-4 ${theme.inputBg} backdrop-blur-sm border ${theme.inputBorder} rounded-2xl placeholder:${theme.textMuted} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-2xl font-bold whitespace-nowrap hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-white"
                  >
                    Start for Free
                  </motion.button>
                </div>
              </form>

              <div
                className={`flex items-center justify-center space-x-6 text-sm ${theme.textMuted}`}
              >
                {CONTENT_CONFIG.cta.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${theme.footerBorder} py-16`}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {CONTENT_CONFIG.branding.name}
                </span>
              </div>
              <p className={`${theme.textMuted} mb-6`}>
                {CONTENT_CONFIG.branding.tagline}
              </p>
              <div className={`text-sm ${theme.textMuted}`}>
                &copy; {new Date().getFullYear()} {CONTENT_CONFIG.branding.name}
                . All rights reserved.
              </div>
            </div>

            {CONTENT_CONFIG.footer.sections.map((section) => (
              <div key={section.title}>
                <h3 className={`font-semibold mb-4 ${theme.text}`}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className={`${theme.textMuted} hover:${theme.text} transition-colors text-sm`}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseCrafterLanding;
