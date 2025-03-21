
export interface SubpaisaTransaction {
  transaction_amount: number;
  transaction_date: string;
  transaction_channel: string;
  is_fraud: number;
  transaction_payment_mode_anonymous: number;
  payment_gateway_bank_anonymous: number;
  payer_browser_anonymous: number;
  payer_email_anonymous: string;
  payee_ip_anonymous: string;
  payer_mobile_anonymous?: string;
  transaction_id_anonymous: string;
  payee_id_anonymous: string;
}
