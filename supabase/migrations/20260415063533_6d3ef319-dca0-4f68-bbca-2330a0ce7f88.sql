CREATE TABLE public.debt_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL DEFAULT 'default',
  total_score NUMERIC NOT NULL DEFAULT 0,
  complexity_score NUMERIC NOT NULL DEFAULT 0,
  duplication_score NUMERIC NOT NULL DEFAULT 0,
  code_smell_score NUMERIC NOT NULL DEFAULT 0,
  files_analyzed INTEGER NOT NULL DEFAULT 0,
  scan_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.debt_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID REFERENCES public.debt_scans(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  debt_score NUMERIC NOT NULL DEFAULT 0,
  complexity INTEGER NOT NULL DEFAULT 0,
  lines_of_code INTEGER NOT NULL DEFAULT 0,
  code_smells JSONB DEFAULT '[]',
  language TEXT NOT NULL DEFAULT 'typescript',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.dependencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID REFERENCES public.debt_scans(id) ON DELETE CASCADE,
  source_module TEXT NOT NULL,
  target_module TEXT NOT NULL,
  dependency_type TEXT NOT NULL DEFAULT 'import',
  weight INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.refactoring_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID REFERENCES public.debt_scans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  module_name TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  estimated_effort TEXT DEFAULT 'medium',
  risk_level NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.debt_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refactoring_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read debt scans" ON public.debt_scans FOR SELECT USING (true);
CREATE POLICY "Anyone can insert debt scans" ON public.debt_scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read debt modules" ON public.debt_modules FOR SELECT USING (true);
CREATE POLICY "Anyone can insert debt modules" ON public.debt_modules FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read dependencies" ON public.dependencies FOR SELECT USING (true);
CREATE POLICY "Anyone can insert dependencies" ON public.dependencies FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read refactoring tasks" ON public.refactoring_tasks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert refactoring tasks" ON public.refactoring_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update refactoring tasks" ON public.refactoring_tasks FOR UPDATE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_refactoring_tasks_updated_at
  BEFORE UPDATE ON public.refactoring_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();