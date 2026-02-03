-- Create document types enum
CREATE TYPE public.document_type AS ENUM (
  'employment_contract',
  'nda',
  'service_agreement',
  'invoice',
  'business_report',
  'lease_agreement',
  'partnership_agreement',
  'consulting_agreement'
);

-- Create document status enum
CREATE TYPE public.document_status AS ENUM (
  'draft',
  'generating',
  'completed',
  'error'
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type public.document_type NOT NULL,
  status public.document_status NOT NULL DEFAULT 'draft',
  form_data JSONB NOT NULL DEFAULT '{}',
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document templates table
CREATE TABLE public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  document_type public.document_type NOT NULL UNIQUE,
  description TEXT,
  form_fields JSONB NOT NULL DEFAULT '[]',
  prompt_template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);

-- Templates are public to read
CREATE POLICY "Anyone can view templates"
  ON public.document_templates FOR SELECT
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert default document templates
INSERT INTO public.document_templates (name, document_type, description, form_fields, prompt_template) VALUES
(
  'Employment Contract',
  'employment_contract',
  'Standard employment agreement between employer and employee',
  '[
    {"name": "employer_name", "label": "Employer Name", "type": "text", "required": true},
    {"name": "employer_address", "label": "Employer Address", "type": "textarea", "required": true},
    {"name": "employee_name", "label": "Employee Name", "type": "text", "required": true},
    {"name": "employee_address", "label": "Employee Address", "type": "textarea", "required": true},
    {"name": "job_title", "label": "Job Title", "type": "text", "required": true},
    {"name": "start_date", "label": "Start Date", "type": "date", "required": true},
    {"name": "salary", "label": "Annual Salary", "type": "text", "required": true},
    {"name": "probation_period", "label": "Probation Period (months)", "type": "number", "required": false},
    {"name": "notice_period", "label": "Notice Period (days)", "type": "number", "required": true},
    {"name": "governing_law", "label": "Governing Law/Jurisdiction", "type": "text", "required": true}
  ]',
  'Generate a legally formatted Employment Agreement with the following details:
Employer: {{employer_name}}, Address: {{employer_address}}
Employee: {{employee_name}}, Address: {{employee_address}}
Position: {{job_title}}
Start Date: {{start_date}}
Salary: {{salary}}
Probation Period: {{probation_period}} months
Notice Period: {{notice_period}} days
Governing Law: {{governing_law}}

Include standard clauses for: Duties and Responsibilities, Compensation and Benefits, Working Hours, Confidentiality, Intellectual Property, Termination, Non-Compete (if applicable), and Governing Law. Use formal legal language.'
),
(
  'Non-Disclosure Agreement',
  'nda',
  'Confidentiality agreement to protect sensitive information',
  '[
    {"name": "disclosing_party", "label": "Disclosing Party Name", "type": "text", "required": true},
    {"name": "disclosing_address", "label": "Disclosing Party Address", "type": "textarea", "required": true},
    {"name": "receiving_party", "label": "Receiving Party Name", "type": "text", "required": true},
    {"name": "receiving_address", "label": "Receiving Party Address", "type": "textarea", "required": true},
    {"name": "purpose", "label": "Purpose of Disclosure", "type": "textarea", "required": true},
    {"name": "duration", "label": "NDA Duration (years)", "type": "number", "required": true},
    {"name": "governing_law", "label": "Governing Law/Jurisdiction", "type": "text", "required": true}
  ]',
  'Generate a legally formatted Non-Disclosure Agreement with the following details:
Disclosing Party: {{disclosing_party}}, Address: {{disclosing_address}}
Receiving Party: {{receiving_party}}, Address: {{receiving_address}}
Purpose: {{purpose}}
Duration: {{duration}} years
Governing Law: {{governing_law}}

Include clauses for: Definition of Confidential Information, Obligations of Receiving Party, Exclusions from Confidential Information, Term and Termination, Return of Materials, Remedies, and Miscellaneous provisions. Use formal legal language.'
),
(
  'Service Agreement',
  'service_agreement',
  'Contract for professional services between parties',
  '[
    {"name": "client_name", "label": "Client Name", "type": "text", "required": true},
    {"name": "client_address", "label": "Client Address", "type": "textarea", "required": true},
    {"name": "provider_name", "label": "Service Provider Name", "type": "text", "required": true},
    {"name": "provider_address", "label": "Service Provider Address", "type": "textarea", "required": true},
    {"name": "services", "label": "Description of Services", "type": "textarea", "required": true},
    {"name": "payment_terms", "label": "Payment Terms", "type": "textarea", "required": true},
    {"name": "start_date", "label": "Start Date", "type": "date", "required": true},
    {"name": "end_date", "label": "End Date", "type": "date", "required": false},
    {"name": "governing_law", "label": "Governing Law/Jurisdiction", "type": "text", "required": true}
  ]',
  'Generate a legally formatted Service Agreement with the following details:
Client: {{client_name}}, Address: {{client_address}}
Service Provider: {{provider_name}}, Address: {{provider_address}}
Services: {{services}}
Payment Terms: {{payment_terms}}
Start Date: {{start_date}}
End Date: {{end_date}}
Governing Law: {{governing_law}}

Include clauses for: Scope of Services, Payment and Invoicing, Term and Termination, Confidentiality, Intellectual Property, Limitation of Liability, Indemnification, and General Provisions. Use formal legal language.'
),
(
  'Invoice',
  'invoice',
  'Professional invoice for goods or services',
  '[
    {"name": "seller_name", "label": "Seller/Company Name", "type": "text", "required": true},
    {"name": "seller_address", "label": "Seller Address", "type": "textarea", "required": true},
    {"name": "seller_tax_id", "label": "Tax ID/GST Number", "type": "text", "required": false},
    {"name": "buyer_name", "label": "Buyer/Client Name", "type": "text", "required": true},
    {"name": "buyer_address", "label": "Buyer Address", "type": "textarea", "required": true},
    {"name": "invoice_number", "label": "Invoice Number", "type": "text", "required": true},
    {"name": "invoice_date", "label": "Invoice Date", "type": "date", "required": true},
    {"name": "due_date", "label": "Due Date", "type": "date", "required": true},
    {"name": "items", "label": "Line Items (Description, Qty, Rate)", "type": "textarea", "required": true},
    {"name": "tax_rate", "label": "Tax Rate (%)", "type": "number", "required": false},
    {"name": "payment_instructions", "label": "Payment Instructions", "type": "textarea", "required": true}
  ]',
  'Generate a professionally formatted Invoice with the following details:
Seller: {{seller_name}}, Address: {{seller_address}}, Tax ID: {{seller_tax_id}}
Buyer: {{buyer_name}}, Address: {{buyer_address}}
Invoice Number: {{invoice_number}}
Invoice Date: {{invoice_date}}
Due Date: {{due_date}}
Items: {{items}}
Tax Rate: {{tax_rate}}%
Payment Instructions: {{payment_instructions}}

Create a clear, professional invoice with proper formatting, itemized list, subtotal, tax calculation, and total amount. Include payment terms and instructions.'
),
(
  'Business Report',
  'business_report',
  'Professional business or project report',
  '[
    {"name": "company_name", "label": "Company Name", "type": "text", "required": true},
    {"name": "report_title", "label": "Report Title", "type": "text", "required": true},
    {"name": "report_period", "label": "Report Period", "type": "text", "required": true},
    {"name": "prepared_by", "label": "Prepared By", "type": "text", "required": true},
    {"name": "executive_summary", "label": "Executive Summary", "type": "textarea", "required": true},
    {"name": "key_metrics", "label": "Key Metrics/Data", "type": "textarea", "required": true},
    {"name": "challenges", "label": "Challenges & Issues", "type": "textarea", "required": false},
    {"name": "recommendations", "label": "Recommendations", "type": "textarea", "required": true}
  ]',
  'Generate a professionally formatted Business Report with the following details:
Company: {{company_name}}
Report Title: {{report_title}}
Period: {{report_period}}
Prepared By: {{prepared_by}}
Executive Summary: {{executive_summary}}
Key Metrics: {{key_metrics}}
Challenges: {{challenges}}
Recommendations: {{recommendations}}

Create a comprehensive business report with proper sections including: Title Page, Executive Summary, Introduction, Key Findings, Analysis, Challenges, Recommendations, and Conclusion. Use professional business language.'
);