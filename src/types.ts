export interface FieldInfo {
  key: string;
  type: string;
  required: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  label?: string;
  selector: string;
}

export interface FormMap {
  formSelector: string;
  formId?: string;
  formName?: string;
  action?: string;
  method?: string;
  fields: FieldInfo[];
}

export interface SelectOption {
  value: string;
  text: string;
}

export interface FieldSampleData {
  key: string;
  type: string;
  selector: string;
  sampleValues?: SelectOption[];
  checked?: boolean;
}

export interface FormDataMap {
  form: FormMap;
  sampleData: FieldSampleData[];
}

export interface AnalysisResult {
  url: string;
  timestamp: string;
  forms: FormDataMap[];
}
