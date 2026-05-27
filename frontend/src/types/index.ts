export interface User {
  id: number;
  cccd?: string;
  username?: string;
  name?: string;
  role: 'citizen' | 'admin' | 'officer' | 'reviewer' | 'service' | 'report';
  originalRole?: string;
  agencyId?: number;
}

export interface Citizen {
  citizen_id: number;
  cccd_number: string;
  full_name: string;
  dob: string;
  age?: number;
  gender: 'M' | 'F' | 'O';
  ward_id: string;
  address_detail: string;
  full_address?: string;
  policy_type?: string;
  policy_status?: string;
  regime_name?: string;
  monthly_allowance?: number;
  allowance_status?: string;
  insurance_code?: string;
  benefit_level?: number;
  hospital_code?: string;
  default_bank_account?: string;
  default_bank?: string;
  household_code?: string;
  household_relation?: string;
  created_at: string;
}

export interface Dossier {
  dossier_id: number;
  citizen_id: number;
  citizen_name: string;
  cccd_number: string;
  dossier_type: 'new_regime' | 'adjust_regime' | 'stop_regime';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  note: string;
  created_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: number | null;
  reviewer_name?: string;
  reviewer_role?: string;
  policy_type?: string;
  ward_name?: string;
  district_name?: string;
  province_name?: string;
  attachments?: Attachment[];
  transfers?: DossierTransfer[];
}

export interface Attachment {
  attachment_id: number;
  dossier_id: number;
  file_name: string;
  file_url: string;
  uploaded_at: string;
}

export interface DossierTransfer {
  dossier_transfer_id: number;
  dossier_id: number;
  from_agency: number;
  from_agency_name?: string;
  to_agency: number;
  to_agency_name?: string;
  transfer_date: string;
}

export interface FeedbackTicket {
  feedback_ticket_id: number;
  citizen_id: number;
  citizen_name: string;
  cccd_number: string;
  title: string;
  content: string;
  reply: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  resolved_at: string | null;
  resolved_by: number | null;
  resolver_name?: string;
  hours_elapsed?: number;
  ward_name?: string;
  district_name?: string;
  province_name?: string;
}

export interface AuditLog {
  audit_log_id: number;
  official_id: number | null;
  official_name: string;
  official_role: string;
  action: string;
  action_label: string;
  table_name: string;
  record_id: number;
  old_data: any;
  new_data: any;
  ip_address: string;
  created_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  year: number;
}

export interface VisitLog {
  visit_log_id: number;
  campaign_id: number;
  campaign_name: string;
  campaign_year: number;
  citizen_name: string;
  cccd_number: string;
  gift_type: string;
  gift_value: number;
  status: 'done' | 'pending' | 'missed';
  visited_at: string | null;
}

export interface HouseholdStatus {
  household_code: string;
  head_of_household: string;
  condition_type: string;
  policy_type: string;
}
