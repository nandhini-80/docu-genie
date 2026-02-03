import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ArrowLeft, 
  Download,
  Copy,
  Check,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  document_type: string;
  status: string;
  content: string | null;
  created_at: string;
  form_data: unknown;
}

const ViewDocument = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setDocument(data as Document);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch document",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!document?.content) return;
    
    try {
      await navigator.clipboard.writeText(document.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Document content copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!document?.content) return;

    // Create a simple HTML wrapper for better formatting
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${document.title}</title>
  <style>
    body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { margin-top: 24px; color: #1a365d; }
    p { margin: 12px 0; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
${document.content.replace(/\n/g, '<br>')}
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/[^a-z0-9]/gi, '_')}.html`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Document saved as HTML file",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy-dark border-b border-cream/10 sticky top-0 z-10">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-cream/70 hover:text-cream hover:bg-cream/10"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        {/* Document header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-navy">{document.title}</h1>
              <p className="text-sm text-muted-foreground capitalize">
                {document.document_type.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Document content */}
        <div className="bg-card rounded-xl border border-border p-8 md:p-12 shadow-card">
          <div className="prose prose-slate max-w-none whitespace-pre-wrap">
            {document.content ? (
              <div className="text-foreground leading-relaxed">
                {document.content.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-display text-navy mb-4">{line.slice(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-display text-navy mt-6 mb-3">{line.slice(3)}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-display text-navy mt-4 mb-2">{line.slice(4)}</h3>;
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={index} className="font-semibold text-navy mb-2">{line.slice(2, -2)}</p>;
                  } else if (line.startsWith('- ')) {
                    return <li key={index} className="text-foreground ml-6">{line.slice(2)}</li>;
                  } else if (line.trim() === '---') {
                    return <hr key={index} className="my-6 border-border" />;
                  } else if (line.trim() === '') {
                    return <br key={index} />;
                  }
                  return <p key={index} className="mb-2">{line}</p>;
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No content available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewDocument;
