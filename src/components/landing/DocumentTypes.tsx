import { 
  Briefcase, 
  FileText, 
  HandshakeIcon, 
  Receipt, 
  BarChart3,
  Home,
  Users,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const documentTypes = [
  {
    icon: Briefcase,
    name: "Employment Contract",
    description: "Comprehensive employment agreements with all essential clauses",
    popular: true
  },
  {
    icon: FileText,
    name: "Non-Disclosure Agreement",
    description: "Protect your confidential information with legally binding NDAs"
  },
  {
    icon: HandshakeIcon,
    name: "Service Agreement",
    description: "Professional contracts for service providers and clients"
  },
  {
    icon: Receipt,
    name: "Invoice",
    description: "Professional invoices with proper tax calculations"
  },
  {
    icon: BarChart3,
    name: "Business Report",
    description: "Comprehensive reports for stakeholders and management"
  },
  {
    icon: Home,
    name: "Lease Agreement",
    description: "Rental and lease contracts for property transactions",
    comingSoon: true
  },
  {
    icon: Users,
    name: "Partnership Agreement",
    description: "Define terms and responsibilities between business partners",
    comingSoon: true
  },
  {
    icon: MessageSquare,
    name: "Consulting Agreement",
    description: "Professional contracts for consulting engagements",
    comingSoon: true
  }
];

export const DocumentTypes = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl text-navy mb-4">
            Documents for Every{" "}
            <span className="text-gradient">Business Need</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From employment contracts to invoices, we've got you covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {documentTypes.map((doc, index) => (
            <div 
              key={doc.name}
              className={`relative p-6 bg-card rounded-xl border transition-all duration-300 ${
                doc.comingSoon 
                  ? 'border-border opacity-60' 
                  : 'border-border hover:border-accent/30 hover:shadow-card cursor-pointer'
              }`}
            >
              {doc.popular && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-accent text-navy-dark text-xs font-semibold rounded-full">
                  Popular
                </div>
              )}
              {doc.comingSoon && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                  Coming Soon
                </div>
              )}
              <div className="w-12 h-12 bg-navy/5 rounded-lg flex items-center justify-center mb-4">
                <doc.icon className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-display text-lg text-navy mb-2">{doc.name}</h3>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/auth">
            <Button variant="gold" size="lg">
              Start Creating Documents
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
