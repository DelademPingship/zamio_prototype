/**
 * Payments API functions and types
 * All field names use snake_case to match backend responses
 */
import authApi, { type ApiEnvelope } from './api';

// ===== TYPES =====

export interface PaymentsOverview {
  total_earnings: number;
  pending_payments: number;
  paid_this_month: number;
  total_transactions: number;
  average_payment: number;
  growth_rate: number;
  next_payout_date: string | null;
  next_payout_amount: number;
}

export interface PaymentStatusEntry {
  status: 'paid' | 'pending' | 'failed';
  amount: number;
  count: number;
  percentage: number;
  description: string;
}

export interface RecentPaymentEntry {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  source: string;
  period: string;
  tracks: number;
  description: string;
  payment_method: string;
  reference: string;
}

export interface MonthlyTrendEntry {
  month: string;
  amount: number;
  status: 'paid' | 'pending';
}

export interface TopEarningTrackEntry {
  title: string;
  earnings: number;
  plays: number;
  trend: number;
}

export interface PaymentMethodEntry {
  method: string;
  count: number;
  total_amount: number;
  percentage: number;
}

export interface PaymentsData {
  time_range: string;
  overview: PaymentsOverview;
  payment_status: PaymentStatusEntry[];
  recent_payments: RecentPaymentEntry[];
  monthly_trends: MonthlyTrendEntry[];
  top_earning_tracks: TopEarningTrackEntry[];
  payment_methods: PaymentMethodEntry[];
}

export interface PaymentsParams {
  artist_id: string;
  time_range?: '7days' | '30days' | '3months' | '12months';
  status_filter?: 'all' | 'paid' | 'pending' | 'failed';
}

// ===== API FUNCTIONS =====

/**
 * Fetch comprehensive payments data for an artist
 */
export const fetchArtistPayments = async (params: PaymentsParams): Promise<PaymentsData> => {
  const { data } = await authApi.get<ApiEnvelope<PaymentsData>>(
    '/api/artists/payments/',
    { params }
  );
  return data.data;
};
