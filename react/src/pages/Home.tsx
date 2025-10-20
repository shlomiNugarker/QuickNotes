import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import FeatureCard from "../components/FeatureCard";
import {
  Zap,
  Shield,
  Search,
  ArrowRight,
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
      icon: Zap,
      title: t("feature_fast_title") || "Lightning Fast",
      description: t("feature_fast_desc") || "Create, edit, and find your notes in milliseconds with our optimized interface",
    },
    {
      icon: Shield,
      title: t("feature_secure_title") || "Secure & Private",
      description: t("feature_secure_desc") || "Your data is encrypted and protected with industry-standard security",
    },
    {
      icon: Search,
      title: t("feature_search_title") || "Powerful Search",
      description: t("feature_search_desc") || "Find any note instantly with advanced tag-based filtering",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            QuickNotes
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {t("hero_subtitle") || "Your Thoughts, Beautifully Organized"}
          </p>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("hero_description") || "The modern, intuitive note-taking app that helps you capture ideas, organize thoughts, and boost productivity."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                {t("get_started") || "Get Started Free"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                {t("login") || "Sign In"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              {t("features_title") || "Everything You Need"}
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {t("features_subtitle") || "Simple, powerful features to organize your notes"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("cta_title") || "Ready to Get Started?"}
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              {t("cta_description") || "Start organizing your thoughts with QuickNotes today"}
            </p>
            <Link to="/register">
              <Button size="lg" className="gap-2">
                {t("create_account") || "Create Your Free Account"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} QuickNotes. {t("footer_rights") || "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
