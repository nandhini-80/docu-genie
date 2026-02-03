import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  Loader2,
  Briefcase,
  FileCheck,
  HandshakeIcon,
  Receipt,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  document_type: string;
  description: string;
  form_fields: FormField[];
  prompt_template: string;
}

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
}

const documentIcons: Record<string, any> = {
  employment_contract: Briefcase,
  nda: FileCheck,
  service_agreement: HandshakeIcon,
  invoice: Receipt,
  business_report: BarChart3,
};

const CreateDocument = () => {
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [documentTitle, setDocumentTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchTemplates();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("document_templates")
        .select("*");

      if (error) throw error;
      
      // Parse form_fields from JSON
      const parsedTemplates = (data || []).map(t => ({
        ...t,
        form_fields: typeof t.form_fields === 'string' 
          ? JSON.parse(t.form_fields) 
          : t.form_fields
      }));
      
      setTemplates(parsedTemplates);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setDocumentTitle(`${template.name} - ${new Date().toLocaleDateString()}`);
    setStep(2);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    // Validate required fields
    const missingFields = selectedTemplate.form_fields
      .filter(f => f.required && !formData[f.name])
      .map(f => f.label);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create document record
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          title: documentTitle,
          document_type: selectedTemplate.document_type as any,
          status: "generating" as const,
          form_data: formData,
        })
        .select()
        .single();

      if (docError) throw docError;

      // Call edge function to generate content
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            promptTemplate: selectedTemplate.prompt_template,
            formData,
            documentType: selectedTemplate.document_type,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate document");
      }

      // Read streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const deltaContent = parsed.choices?.[0]?.delta?.content;
                if (deltaContent) {
                  content += deltaContent;
                }
              } catch {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      }

      // Update document with generated content
      const { error: updateError } = await supabase
        .from("documents")
        .update({
          content,
          status: "completed",
        })
        .eq("id", doc.id);

      if (updateError) throw updateError;

      toast({
        title: "Document generated!",
        description: "Your document is ready to view.",
      });

      navigate(`/document/${doc.id}`);
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy-dark border-b border-cream/10">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-navy-dark" />
              </div>
              <span className="font-display text-xl text-cream font-semibold">DocuGen</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? 'bg-accent text-navy-dark' : 'bg-muted'
              }`}>
                1
              </div>
              <span className="hidden sm:inline">Choose Template</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? 'bg-accent text-navy-dark' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="hidden sm:inline">Fill Details</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 3 ? 'bg-accent text-navy-dark' : 'bg-muted'
              }`}>
                3
              </div>
              <span className="hidden sm:inline">Generate</span>
            </div>
          </div>
        </div>

        {/* Step 1: Choose Template */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display text-navy mb-2">Choose a Document Type</h1>
              <p className="text-muted-foreground">
                Select the type of document you want to create
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {templates.map((template) => {
                const Icon = documentIcons[template.document_type] || FileText;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="p-6 bg-card rounded-xl border border-border hover:border-accent/30 hover:shadow-card transition-all duration-200 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Fill Details */}
        {step === 2 && selectedTemplate && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-navy transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Change template
              </button>
              <h1 className="text-3xl font-display text-navy mb-2">{selectedTemplate.name}</h1>
              <p className="text-muted-foreground">
                Fill in the details below to generate your document
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="documentTitle" className="text-navy font-semibold">
                  Document Title
                </Label>
                <Input
                  id="documentTitle"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Enter a title for your document"
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-navy mb-4">Document Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedTemplate.form_fields.map((field) => (
                    <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <div className="space-y-2">
                        <Label htmlFor={field.name} className="text-navy">
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.name}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            rows={3}
                          />
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Document
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateDocument;
