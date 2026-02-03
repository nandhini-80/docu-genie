import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-navy-dark py-12 border-t border-cream/10">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-navy-dark" />
              </div>
              <span className="font-display text-xl text-cream font-semibold">DocuGen</span>
            </Link>
            <p className="text-cream/60 text-sm max-w-md leading-relaxed">
              AI-powered legal document generator for startups, freelancers, and small businesses. 
              Create professional contracts, agreements, and invoices in minutes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-cream/60 hover:text-cream text-sm transition-colors">Features</a></li>
              <li><a href="#documents" className="text-cream/60 hover:text-cream text-sm transition-colors">Documents</a></li>
              <li><a href="#pricing" className="text-cream/60 hover:text-cream text-sm transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-cream font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-cream/60 hover:text-cream text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-cream/60 hover:text-cream text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-cream/60 hover:text-cream text-sm transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-cream/10 text-center">
          <p className="text-cream/40 text-sm">
            © {new Date().getFullYear()} DocuGen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
