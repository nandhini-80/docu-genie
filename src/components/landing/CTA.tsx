import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "No credit card required",
  "Generate documents instantly",
  "Download in PDF format",
  "Edit before finalizing"
];

export const CTA = () => {
  return (
    <section className="py-24 bg-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-cream mb-6">
            Ready to Streamline Your{" "}
            <span className="text-gradient">Document Creation?</span>
          </h2>
          <p className="text-lg text-cream/70 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using DocuGen to create professional 
            legal documents in minutes, not hours.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-cream/80">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
