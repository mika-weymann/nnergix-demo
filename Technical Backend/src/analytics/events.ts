export type EventName =
  | 'demo_role_selected'
  | 'pricing_audience_toggled'
  | 'pilot_submitted'
  | 'pricing_plan_clicked'
  | 'feature_interest'
  | 'remind_toggle'
  | 'whitelabel_toggled'
  | 'csv_exported'
  | 'audience_tab_viewed'
  | 'cta_clicked'
  | 'connect_started'
  | 'connect_completed'
  | 'connect_brand_unsupported';

export type EventProps = Record<string, string | number | boolean>;

export interface TrackedEvent {
  event: EventName;
  props?: EventProps;
  ts: number;
  sessionId: string;
}

export const QUESTION_GROUPS: { id: string; title: string; question: string; events: EventName[] }[] = [
  {
    id: 'who',
    title: 'Who pays?',
    question: 'Homeowner, energy retailer or installer?',
    events: ['demo_role_selected', 'pricing_audience_toggled', 'pilot_submitted'],
  },
  {
    id: 'what',
    title: 'For what?',
    question: 'Forecasts, health and maintenance, or a branded dashboard?',
    events: [
      'pricing_plan_clicked',
      'feature_interest',
      'remind_toggle',
      'whitelabel_toggled',
      'csv_exported',
    ],
  },
  {
    id: 'channel',
    title: 'Which channel?',
    question: 'Bought directly, or provided through a retailer or installer?',
    events: [
      'audience_tab_viewed',
      'cta_clicked',
      'connect_started',
      'connect_completed',
      'connect_brand_unsupported',
    ],
  },
];
