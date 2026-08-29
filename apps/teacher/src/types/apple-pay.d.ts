/**
 * Minimal TypeScript declarations for Apple Pay Web (ApplePaySession).
 * Only covers what's used in the subscription flow.
 */

interface ApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  supportedNetworks: string[];
  merchantCapabilities: string[];
  total: { label: string; amount: string };
}

interface ApplePayValidateMerchantEvent extends Event {
  validationURL: string;
}

interface ApplePayPayment {
  token: unknown;
}

interface ApplePayPaymentAuthorizedEvent extends Event {
  payment: ApplePayPayment;
}

interface ApplePayPaymentResult {
  status: number;
}

declare class ApplePaySession extends EventTarget {
  static readonly STATUS_SUCCESS: number;
  static readonly STATUS_FAILURE: number;

  static canMakePayments(): boolean;

  constructor(version: number, paymentRequest: ApplePayPaymentRequest);

  onvalidatemerchant: ((event: ApplePayValidateMerchantEvent) => void) | null;
  onpaymentauthorized: ((event: ApplePayPaymentAuthorizedEvent) => void) | null;

  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: unknown): void;
  completePayment(result: ApplePayPaymentResult): void;
}

interface Window {
  ApplePaySession: typeof ApplePaySession;
}
