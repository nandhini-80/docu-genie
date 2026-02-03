import { Button } from "@/components/ui/button";
import { FileText, Zap, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="bg-hero relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream/10 rounded-full border border-cream/20">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-cream/90 text-sm font-medium">AI-Powered Document Generation</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl text-cream leading-tight">
              Create Legal Documents{" "}
              <span className="text-gradient">in Minutes</span>
            </h1>

            <p className="text-lg text-cream/70 max-w-xl leading-relaxed">
              Generate professionally formatted contracts, agreements, invoices, and business reports 
              with AI. Save time, reduce errors, and focus on what matters most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-cream/60 text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                <span className="text-cream/60 text-sm">Legal Standard Format</span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Main document card */}
              <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transform rotate-2 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-navy/10 rounded w-3/4" />
                  <div className="h-4 bg-navy/5 rounded w-full" />
                  <div className="h-4 bg-navy/5 rounded w-5/6" />
                  <div className="h-4 bg-navy/5 rounded w-4/5" />
                  <div className="pt-4 border-t border-border">
                    <div className="h-4 bg-accent/20 rounded w-1/3" />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-accent text-navy-dark px-4 py-2 rounded-full font-semibold text-sm shadow-lg animate-float">
                ✨ AI Generated
              </div>

              {/* Secondary card */}
              <div className="absolute -bottom-8 -left-8 bg-card/90 backdrop-blur-sm rounded-xl shadow-xl p-6 transform -rotate-3 w-48 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <FileText className="w-8 h-8 text-navy mb-2" />
                <p className="text-sm font-medium text-navy">Employment Contract</p>
                <p className="text-xs text-muted-foreground">Ready to download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
