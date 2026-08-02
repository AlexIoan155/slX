// Hand-written types mirroring `supabase/migrations/0001_init.sql`.
// If you use the Supabase CLI, you can regenerate an equivalent (and more
// exhaustive) version with:
//   npx supabase gen types typescript --project-id <id> > types/database.ts

export type SubscriptionPlan = "free" | "premium";
export type SubscriptionStatus = "active" | "trialing" | "canceled" | "past_due" | "incomplete";
export type NotificationType = "risk_alert" | "reminder" | "system" | "billing";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface ProfileRow {
  id: string; // references auth.users.id
  email: string;
  name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  notify_email: boolean;
  subscription: SubscriptionPlan;
  risk_score: number | null;
  last_scan: string | null; // ISO timestamp
  created_at: string;
  updated_at: string;
}

export interface AssessmentRow {
  id: string;
  user_id: string;
  status: "in_progress" | "completed";
  answers_count: number;
  started_at: string;
  completed_at: string | null;
}

export interface AssessmentAnswerRow {
  id: string;
  assessment_id: string;
  question_id: string;
  value: string;
  created_at: string;
}

export interface RiskResultRow {
  id: string;
  assessment_id: string;
  user_id: string;
  home_risk_score: number;
  risk_level: string;
  probabilities: Record<string, number>;
  domain_scores: Record<string, number>;
  estimated_annual_cost_ron: number;
  intervention_priority: string;
  detected_risks: unknown;
  recommendations: unknown;
  created_at: string;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRow {
  id: string;
  user_id: string;
  subscription_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_ron: number;
  status: PaymentStatus;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

export interface ActivityLogRow {
  id: string;
  user_id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow> & { id: string; email: string }; Update: Partial<ProfileRow> };
      assessments: { Row: AssessmentRow; Insert: Partial<AssessmentRow> & { user_id: string }; Update: Partial<AssessmentRow> };
      assessment_answers: {
        Row: AssessmentAnswerRow;
        Insert: Partial<AssessmentAnswerRow> & { assessment_id: string; question_id: string; value: string };
        Update: Partial<AssessmentAnswerRow>;
      };
      risk_results: {
        Row: RiskResultRow;
        Insert: Partial<RiskResultRow> & { assessment_id: string; user_id: string; home_risk_score: number };
        Update: Partial<RiskResultRow>;
      };
      subscriptions: { Row: SubscriptionRow; Insert: Partial<SubscriptionRow> & { user_id: string }; Update: Partial<SubscriptionRow> };
      payments: { Row: PaymentRow; Insert: Partial<PaymentRow> & { user_id: string; amount_ron: number }; Update: Partial<PaymentRow> };
      notifications: { Row: NotificationRow; Insert: Partial<NotificationRow> & { user_id: string; type: NotificationType; title: string }; Update: Partial<NotificationRow> };
      activity_logs: { Row: ActivityLogRow; Insert: Partial<ActivityLogRow> & { user_id: string; action: string }; Update: Partial<ActivityLogRow> };
    };
    Functions: {
      log_activity: { Args: { p_action: string; p_metadata: Record<string, unknown> | null }; Returns: void };
      mark_notification_read: { Args: { p_notification_id: string }; Returns: void };
    };
  };
}
