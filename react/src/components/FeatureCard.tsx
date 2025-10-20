import React from "react";
import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  delay = "0s",
}) => {
  return (
    <div
      className="animate-slideUp"
      style={{ animationDelay: delay }}
    >
      <Card className="hover-lift group cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300">
        <CardContent className="p-6">
          <div
            className={`w-12 h-12 rounded-lg ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-heading font-bold mb-2 text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCard;
