import { 
  FileText, 
  Zap, 
  Shield, 
  Clock, 
  Edit3, 
  Download,
  Sparkles,
  Lock
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Advanced AI creates legally formatted documents tailored to your specific needs in seconds."
  },
  {
    icon: FileText,
    title: "Multiple Document Types",
    description: "Contracts, NDAs, invoices, business reports - all the documents your business needs."
  },
  {
    icon: Edit3,
    title: "Easy Customization",
    description: "Preview and edit your documents before downloading. Full control over the final result."
  },
  {
    icon: Clock,
    title: "Save Hours of Work",
    description: "What used to take hours now takes minutes. Focus on growing your business instead."
  },
  {
    icon: Shield,
    title: "Legal Standards",
    description: "Documents follow legal formatting standards with proper clauses and structure."
  },
  {
    icon: Download,
    title: "Download Instantly",
    description: "Export your documents as PDF or copy the content directly. Ready for immediate use."
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "Your data is encrypted and never shared. Complete privacy for your business documents."
  },
  {
    icon: Zap,
    title: "Always Available",
    description: "Generate documents 24/7. No waiting for lawyers or business hours."
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl text-navy mb-4">
            Everything You Need for{" "}
            <span className="text-gradient">Professional Documents</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to streamline your document creation workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 bg-card rounded-xl border border-border hover:shadow-card hover:border-accent/20 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-lg text-navy mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
