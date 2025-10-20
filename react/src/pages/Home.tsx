import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import AnimatedBackground from "../components/AnimatedBackground";
import FeatureCard from "../components/FeatureCard";
import StatsCounter from "../components/StatsCounter";
import {
  Sparkles,
  Zap,
  Shield,
  Palette,
  Search,
  Cloud,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Sparkles,
      title: t("feature_smart_title") || "Smart Organization",
      description: t("feature_smart_desc") || "Organize your notes with intelligent tagging and powerful search capabilities",
      gradient: "bg-gradient-1",
      delay: "0.1s"
    },
    {
      icon: Zap,
      title: t("feature_fast_title") || "Lightning Fast",
      description: t("feature_fast_desc") || "Create, edit, and find your notes in milliseconds with our optimized interface",
      gradient: "bg-gradient-2",
      delay: "0.2s"
    },
    {
      icon: Shield,
      title: t("feature_secure_title") || "Secure & Private",
      description: t("feature_secure_desc") || "Your data is encrypted and protected with industry-standard security",
      gradient: "bg-gradient-3",
      delay: "0.3s"
    },
    {
      icon: Palette,
      title: t("feature_beautiful_title") || "Beautiful Design",
      description: t("feature_beautiful_desc") || "Enjoy a stunning, modern interface that makes note-taking a pleasure",
      gradient: "bg-gradient-4",
      delay: "0.4s"
    },
    {
      icon: Search,
      title: t("feature_search_title") || "Powerful Search",
      description: t("feature_search_desc") || "Find any note instantly with advanced tag-based filtering",
      gradient: "bg-gradient-5",
      delay: "0.5s"
    },
    {
      icon: Cloud,
      title: t("feature_cloud_title") || "Cloud Sync",
      description: t("feature_cloud_desc") || "Access your notes anywhere, anytime with automatic cloud synchronization",
      gradient: "bg-gradient-6",
      delay: "0.6s"
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground variant="gradient" />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
              <span className="gradient-text">QuickNotes</span>
              <br />
              <span className="text-foreground">
                {t("hero_subtitle") || "Your Thoughts, Beautifully Organized"}
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slideUp">
            {t("hero_description") || "The modern, intuitive note-taking app that helps you capture ideas, organize thoughts, and boost productivity with style."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp" style={{ animationDelay: "0.2s" }}>
            <Link to="/register">
              <Button size="lg" className="group px-8 py-6 text-lg bg-gradient-1 hover:shadow-glow">
                {t("get_started") || "Get Started Free"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg glass hover:bg-white/50">
                {t("login") || "Sign In"}
              </Button>
            </Link>
          </div>

          {/* Key Benefits */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span>{t("benefit_free") || "Free to use"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span>{t("benefit_no_card") || "No credit card required"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span>{t("benefit_unlimited") || "Unlimited notes"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StatsCounter end={10000} suffix="+" label={t("stats_users") || "Active Users"} />
            <StatsCounter end={50000} suffix="+" label={t("stats_notes") || "Notes Created"} />
            <StatsCounter end={99} suffix="%" label={t("stats_satisfaction") || "Satisfaction Rate"} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="gradient-text">{t("features_title") || "Powerful Features"}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("features_subtitle") || "Everything you need to capture, organize, and find your notes effortlessly"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-scaleIn">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {t("cta_title") || "Ready to Get Started?"}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t("cta_description") || "Join thousands of users who are already organizing their thoughts with QuickNotes"}
            </p>
            <Link to="/register">
              <Button size="lg" className="px-8 py-6 text-lg bg-white text-primary hover:bg-white/90 shadow-lg">
                {t("create_account") || "Create Your Free Account"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 border-t border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} QuickNotes. {t("footer_rights") || "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
