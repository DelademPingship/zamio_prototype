import {
  authApi,
  loginWithPassword,
  legacyRoleLogin,
  getStoredAuth,
  logout,
  resolveApiBaseUrl,
  type LegacyLoginResponse,
} from '@zamio/ui';

export {
  authApi,
  loginWithPassword,
  legacyRoleLogin,
  getStoredAuth,
  logout,
  resolveApiBaseUrl,
};

export default authApi;

export type { LegacyLoginResponse };

export interface ApiErrorMap {
  [field: string]: string[] | string | undefined;
}

export type ApiEnvelope<T = Record<string, unknown>> = LegacyLoginResponse & {
  data?: T;
  errors?: ApiErrorMap;
  message?: string;
  [key: string]: unknown;
};

export interface RegisterAdminPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country?: string;
  password: string;
  password2: string;
  organization_name?: string;
  company?: string;
  role: string;
}

export interface VerifyAdminEmailCodePayload {
  email: string;
  code: string;
}

export interface AdminProfileSnapshot {
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  active?: boolean;
  organization_name?: string | null;
  role?: string | null;
  [key: string]: unknown;
}

export interface AdminOnboardingStatus {
  user_id?: string;
  admin_id?: string;
  next_step?: string;
  onboarding_step?: string;
  progress?: {
    profile_completed?: boolean;
    [key: string]: unknown;
  };
  profile?: AdminProfileSnapshot;
  organization_name?: string | null;
  role?: string | null;
  [key: string]: unknown;
}

export interface CompleteAdminProfilePayload {
  address?: string;
  city: string;
  postal_code: string;
}

export const registerAdmin = async <T = Record<string, unknown>>(
  payload: RegisterAdminPayload,
) => {
  const requestPayload: Record<string, unknown> = {
    ...payload,
    organization_name: payload.organization_name ?? payload.company,
  };

  delete requestPayload.company;

  const { data } = await authApi.post<ApiEnvelope<T>>('/api/accounts/register-admin/', requestPayload);
  return data;
};

export const verifyAdminEmailCode = async <T = Record<string, unknown>>(
  payload: VerifyAdminEmailCodePayload,
) => {
  const { data } = await authApi.post<ApiEnvelope<T>>('/api/accounts/verify-admin-email-code/', payload);
  return data;
};

export const fetchAdminOnboardingStatus = async () => {
  const { data } = await authApi.get<ApiEnvelope<AdminOnboardingStatus>>(
    '/api/accounts/admin-onboarding-status/',
  );
  return data;
};

export const completeAdminProfile = async (payload: CompleteAdminProfilePayload) => {
  const { data } = await authApi.post<ApiEnvelope<AdminOnboardingStatus>>(
    '/api/accounts/complete-admin-profile/',
    payload,
  );
  return data;
};

export interface AdminPlatformStats {
  totalStations: number;
  totalArtists: number;
  totalSongs: number;
  totalPlays: number;
  totalRoyalties: number;
  pendingPayments: number;
  activeDistributors: number;
  monthlyGrowth: number;
  systemHealth: number;
  pendingDisputes: number;
  [key: string]: number;
}

export interface AdminPublisherStats {
  totalPublishers: number;
  activeAgreements: number;
  pendingPublisherPayments: number;
  internationalPartners: number;
  catalogsUnderReview: number;
  agreementsExpiring: number;
  payoutVelocity: number;
  [key: string]: number;
}

export interface AdminRecentActivity {
  id: string;
  type: string;
  description: string;
  status: string;
  time: string;
  amount?: number;
  timestamp?: string;
  [key: string]: unknown;
}

export interface AdminTopEarner {
  name: string;
  totalEarnings: number;
  plays: number;
  growth: number;
}

export interface AdminRevenueTrendPoint {
  month: string;
  revenue: number;
  artists: number;
  stations: number;
}

export interface AdminGenreDistributionPoint {
  name: string;
  value: number;
  color: string;
}

export interface AdminPublisherPerformanceRow {
  name: string;
  territory: string;
  totalRoyalties: number;
  activeAgreements: number;
  status: string;
}

export interface AdminDashboardResponse {
  platformStats: AdminPlatformStats;
  publisherStats: AdminPublisherStats;
  recentActivity: AdminRecentActivity[];
  topEarners: AdminTopEarner[];
  revenueTrends: AdminRevenueTrendPoint[];
  genreDistribution: AdminGenreDistributionPoint[];
  publisherPerformance: AdminPublisherPerformanceRow[];
  [key: string]: unknown;
}

export const fetchAdminDashboard = async () => {
  const { data } = await authApi.get<AdminDashboardResponse>('/api/analytics/admin/');
  return data;
};
