import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-sm border-b border-cream/10">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-navy-dark" />
            </div>
            <span className="font-display text-xl text-cream font-semibold">DocuGen</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-cream/70 hover:text-cream transition-colors text-sm">
              Features
            </a>
            <a href="#documents" className="text-cream/70 hover:text-cream transition-colors text-sm">
              Documents
            </a>
            <a href="#pricing" className="text-cream/70 hover:text-cream transition-colors text-sm">
              Pricing
            </a>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-cream/70 hover:text-cream hover:bg-cream/10">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
