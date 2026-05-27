import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Configure request interceptor to add authorization token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const lookupApi = {
  getProvinces: () => api.get('/lookup/provinces'),
  getDistricts: (provId: string) => api.get(`/lookup/districts/${provId}`),
  getWards: (distId: string) => api.get(`/lookup/wards/${distId}`),
  getPolicyObjects: () => api.get('/lookup/policy-objects'),
  getAllowanceRegimes: () => api.get('/lookup/allowance-regimes'),
  getBanks: () => api.get('/lookup/banks'),
  getCampaigns: () => api.get('/lookup/campaigns'),
};

export const citizenApi = {
  getProfile: (id: number) => api.get(`/citizens/${id}`),
  getAllowances: (id: number) => api.get(`/citizens/${id}/allowances`),
  getDossiers: (id: number) => api.get(`/citizens/${id}/dossiers`),
  getPayments: (id: number) => api.get(`/citizens/${id}/payments`),
  checkInsurance: (id: number) => api.get(`/citizens/${id}/insurance`),
  checkPolicy: (id: number) => api.get(`/citizens/${id}/policy`),
};

export const dossierApi = {
  list: (params?: any) => api.get('/dossiers', { params }),
  get: (id: number) => api.get(`/dossiers/${id}`),
  create: (data: any) => api.post('/dossiers', data),
  submit: (id: number) => api.put(`/dossiers/${id}/submit`),
  review: (id: number, data: { status: 'approved' | 'rejected'; note?: string }) => api.put(`/dossiers/${id}/review`, data),
  transfer: (id: number, data: { fromAgency: number; toAgency: number }) => api.post(`/dossiers/${id}/transfer`, data),
  addAttachment: (id: number, data: { fileName: string; fileUrl?: string }) => api.post(`/dossiers/${id}/attachments`, data),
  uploadAttachment: (data: { fileName: string; fileData: string }) => api.post('/dossiers/upload-attachment', data),
  getPending: () => api.get('/dossiers/pending'),
};

export const feedbackApi = {
  list: (params?: any) => api.get('/feedback', { params }),
  create: (data: { title: string; content: string }) => api.post('/feedback', data),
  resolve: (id: number, reply: string) => api.put(`/feedback/${id}/resolve`, { reply }),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  
  // 1. Citizens
  listCitizens: (search?: string) => api.get('/admin/citizens', { params: { search } }),
  updateCitizen: (id: number, data: any) => api.put(`/admin/citizens/${id}`, data),

  // 2. Policy Objects
  getPolicyDistribution: () => api.get('/admin/policy-objects'),
  getObjectMappings: () => api.get('/admin/object-mappings'),
  createObjectMapping: (data: any) => api.post('/admin/object-mappings', data),

  // 3. Gifts
  getCampaigns: () => api.get('/admin/campaigns'),
  getCampaignReport: (id: number) => api.get(`/admin/campaigns/${id}/report`),
  getVisits: () => api.get('/admin/visits'),

  // 4. Health
  getHealthInsurance: () => api.get('/admin/health'),
  createMedicalSnapshot: (data: { citizenId: number; healthStatus: string }) => api.post('/admin/health/snapshot', data),

  // 5. Households
  getHouseholds: () => api.get('/admin/households'),
  addHouseholdMember: (data: { householdId: number; citizenId: number; relation: string }) => api.post('/admin/households/member', data),

  // 6. Authorizations
  getAuthorizations: () => api.get('/admin/authorizations'),
  createAuthorization: (data: any) => api.post('/admin/authorizations', data),
  revokeAuthorization: (id: number) => api.put(`/admin/authorizations/${id}/revoke`),

  // 7. Payments
  getPayments: () => api.get('/admin/payments'),
  getAllowancesByRegion: () => api.get('/admin/allowances-by-region'),

  // 8. Audit Logs
  getAuditLogs: () => api.get('/admin/audit-logs'),
};
