import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, BarChart3, Users, Stethoscope, Leaf, Star, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-ayursutra.jpg";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: "Automated Therapy Scheduling",
      description: "Intelligent scheduling system that plans and manages therapy sessions automatically with conflict resolution and optimization."
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Customizable alerts for pre and post-procedure precautions through in-app, SMS, and email channels."
    },
    {
      icon: BarChart3,
      title: "Real-Time Progress Tracking",
      description: "Visual progress monitoring with graphs, milestones, and personalized recovery metrics for patients and practitioners."
    },
    {
      icon: Users,
      title: "Integrated Feedback Loop",
      description: "Enable patients to report symptoms and improvements, refining treatment schedules dynamically."
    }
  ];

  const benefits = [
    {
      icon: Stethoscope,
      title: "Clinical Excellence",
      description: "Ensure consistent therapy quality across all Panchakarma centers with standardized protocols."
    },
    {
      icon: Leaf,
      title: "Traditional Authenticity",
      description: "Preserve ancient Ayurvedic wisdom while embracing modern healthcare efficiency."
    },
    {
      icon: Star,
      title: "Patient-Centric Care",
      description: "Personalized treatment journeys with comprehensive digital health records."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Ayurvedic healing center with modern facilities" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-accent text-accent-foreground">
              Revolutionizing Panchakarma Management
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Welcome to <span className="text-accent">Ayursutra</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
              The world's first comprehensive Panchakarma management platform, seamlessly blending ancient Ayurvedic wisdom with cutting-edge healthcare technology for the USD 16 billion global Ayurveda market.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Core Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Comprehensive Panchakarma Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From automated scheduling to real-time progress tracking, our platform addresses every aspect of traditional Panchakarma therapy management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border/50 shadow-card hover:shadow-healing transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-success/10 text-success">Platform Benefits</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Why Choose Ayursutra?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-card-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto">
            Join the digital revolution in Panchakarma therapy management and provide exceptional patient care.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow">
            Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;