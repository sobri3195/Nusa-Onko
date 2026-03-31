export type Severity = 'low' | 'moderate' | 'high' | 'critical';

export interface ModuleField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'multiselect' | 'date';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface AnalysisResult {
  score: number;
  severity: Severity;
  summary: string;
  recommendation: string;
  generatedAt: string;
  output: Record<string, unknown>;
}

export interface ModuleDefinition {
  key: string;
  name: string;
  purpose: string;
  fields: ModuleField[];
  severityField: string;
  run: (payload: Record<string, unknown>, history: AnalysisResult[]) => AnalysisResult;
}

export interface ModuleExecutionRecord {
  id: string;
  moduleKey: string;
  patientId: string;
  input: Record<string, unknown>;
  result: AnalysisResult;
}

export interface NotificationItem {
  id: string;
  patientId: string;
  moduleKey: string;
  severity: Severity;
  message: string;
  createdAt: string;
}
