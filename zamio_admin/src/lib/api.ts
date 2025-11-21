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

// Admin login that properly handles Django Token authentication
export interface AdminLoginPayload {
  email: string;
  password: string;
  fcm_token?: string;
}

export interface AdminLoginResponse {
  message: string;
  data: {
    user_id: string;
    admin_id: string;
    email: string;
    first_name: string;
    last_name: string;
    photo: string | null;
    country: string;
    phone: string;
    token: string; // Django Token (not JWT)
    access_token?: string;
    refresh_token?: string;
  };
}

export const loginAdmin = async (payload: AdminLoginPayload) => {
  // Provide default fcm_token if not provided
  const loginPayload = {
    ...payload,
    fcm_token: payload.fcm_token || 'web-admin-token',
  };

  const { data } = await authApi.post<AdminLoginResponse>('/api/accounts/login-admin/', loginPayload);
  
  // Transform Django Token to match expected format
  if (data.data && data.data.token) {
    const transformedData = {
      ...data,
      data: {
        ...data.data,
        access_token: data.data.token, // Map token to access_token
      },
    };
    return transformedData;
  }
  
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

// User Management API

export interface UserManagementOverview {
  user_stats: {
    total_users: number;
    artists: number;
    publishers: number;
    stations: number;
    admins: number;
  };
  kyc_stats: {
    pending: number;
    verified: number;
    rejected: number;
    incomplete: number;
  };
  recent_stats: {
    new_registrations: number;
    kyc_submissions: number;
    active_users: number;
  };
  account_stats: {
    active: number;
    inactive: number;
    email_verified: number;
    profile_complete: number;
  };
  last_updated: string;
}

export interface UserRecord {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  user_type: 'Artist' | 'Publisher' | 'Station' | 'Admin';
  kyc_status: 'pending' | 'verified' | 'rejected' | 'incomplete';
  is_active: boolean;
  email_verified: boolean;
  profile_complete: boolean;
  two_factor_enabled: boolean;
  last_activity: string | null;
  timestamp: string;
  photo_url: string | null;
  artist_id?: string;
  stage_name?: string;
  self_published?: boolean;
  publisher_id?: string;
  company_name?: string;
  station_id?: string;
  station_name?: string;
}

export interface UserListPagination {
  page_number: number;
  per_page: number;
  total_pages: number;
  total_count: number;
  has_next: boolean;
  has_previous: boolean;
  next: number | null;
  previous: number | null;
}

export interface UserListResponse {
  users: UserRecord[];
  pagination: UserListPagination;
  filters_applied: {
    search: string;
    user_type: string;
    kyc_status: string;
    account_status: string;
    order_by: string;
  };
}

export interface UserListParams {
  page?: number;
  per_page?: number;
  search?: string;
  user_type?: string;
  kyc_status?: string;
  account_status?: string;
  order_by?: string;
}

export interface UserDetailResponse {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  user_type: string;
  kyc_status: string;
  kyc_documents: Record<string, unknown>;
  is_active: boolean;
  email_verified: boolean;
  profile_complete: boolean;
  two_factor_enabled: boolean;
  last_activity: string | null;
  timestamp: string;
  photo_url: string | null;
  failed_login_attempts: number;
  account_locked_until: string | null;
  permissions: Array<{
    permission: string;
    granted_by: string;
    granted_at: string;
    expires_at: string | null;
  }>;
  recent_activity: Array<{
    action: string;
    resource_type: string;
    resource_id: string;
    timestamp: string;
    ip_address: string;
    status_code: number;
  }>;
  artist_profile?: Record<string, unknown>;
  publisher_profile?: Record<string, unknown>;
  station_profile?: Record<string, unknown>;
}

export interface UpdateKycStatusPayload {
  user_id: string;
  kyc_status: 'pending' | 'verified' | 'rejected' | 'incomplete';
  rejection_reason?: string;
  admin_notes?: string;
}

export interface UpdateUserStatusPayload {
  user_id: string;
  action: 'activate' | 'deactivate' | 'suspend';
  reason?: string;
  suspension_duration?: number;
}

export interface BulkUserOperationsPayload {
  user_ids: string[];
  operation: 'activate' | 'deactivate' | 'export' | 'update_kyc';
  operation_data?: Record<string, unknown>;
}

export const fetchUserManagementOverview = async () => {
  const { data } = await authApi.get<ApiEnvelope<UserManagementOverview>>(
    '/api/accounts/admin/user-management-overview/'
  );
  return data;
};

export const fetchAllUsers = async (params: UserListParams = {}) => {
  const { data } = await authApi.get<ApiEnvelope<UserListResponse>>(
    '/api/accounts/admin/all-users/',
    { params }
  );
  return data;
};

export const fetchUserDetails = async (userId: string) => {
  const { data } = await authApi.get<ApiEnvelope<UserDetailResponse>>(
    '/api/accounts/admin/user-details/',
    { params: { user_id: userId } }
  );
  return data;
};

export interface UserRoyaltySummary {
  total_gross: number;
  total_net: number;
  total_distributions: number;
  paid_count: number;
  pending_count: number;
  paid_amount: number;
  pending_amount: number;
  currency: string;
}

export interface RoyaltyDistributionItem {
  distribution_id: string;
  gross_amount: number;
  net_amount: number;
  currency: string;
  recipient_type: string;
  percentage_split: number;
  status: string;
  calculated_at: string;
  paid_at: string | null;
  payment_reference: string | null;
  play_log?: {
    id: number;
    played_at: string | null;
    track_title: string | null;
    station_name: string | null;
  };
}

export interface UserRoyaltiesResponse {
  user_id: string;
  user_email: string;
  user_type: string;
  summary: UserRoyaltySummary;
  status_breakdown: Record<string, { count: number; amount: number }>;
  recent_royalties: RoyaltyDistributionItem[];
}

export const fetchUserRoyalties = async (userId: string) => {
  const { data } = await authApi.get<ApiEnvelope<UserRoyaltiesResponse>>(
    '/api/accounts/admin/user-royalties/',
    { params: { user_id: userId } }
  );
  return data;
};

export const updateKycStatus = async (payload: UpdateKycStatusPayload) => {
  const { data } = await authApi.post<ApiEnvelope<Record<string, unknown>>>(
    '/api/accounts/admin/update-kyc-status/',
    payload
  );
  return data;
};

export const updateUserStatus = async (payload: UpdateUserStatusPayload) => {
  const { data } = await authApi.post<ApiEnvelope<Record<string, unknown>>>(
    '/api/accounts/admin/update-user-status/',
    payload
  );
  return data;
};

export const bulkUserOperations = async (payload: BulkUserOperationsPayload) => {
  const { data } = await authApi.post<ApiEnvelope<Record<string, unknown>>>(
    '/api/accounts/admin/bulk-user-operations/',
    payload
  );
  return data;
};
