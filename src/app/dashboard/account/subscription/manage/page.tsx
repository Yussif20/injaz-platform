"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { dashboardContent } from "@/content";
import { Button, Input } from "@/shared/components/ui";
import { useSubscriptionInfo } from "@/features/dashboard/hooks/useSubscriptionInfo";
import { useMySubscription } from "@/features/dashboard/hooks/useMySubscription";
import { useSubscribe } from "@/features/dashboard/hooks/useSubscribe";

// ─── Sub-components ────────────────────────────────────────────────────────

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span className="text-xs sm:text-sm text-secondary-800 break-words">
        {text}
      </span>
    </div>
  );
}

type PaymentMethod = "visa" | "mada" | "apple_pay";

function PaymentMethodOption({
  method,
  label,
  logo,
  selected,
  onSelect,
  disabled,
  badge,
}: {
  method: PaymentMethod;
  label: string;
  logo: React.ReactNode;
  selected: boolean;
  onSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(method)}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-colors min-w-0
        ${selected ? "border-primary-500 bg-shade-50" : "border-grey-200 bg-white hover:border-grey-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div
          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${selected ? "border-primary-500" : "border-grey-300"}`}
        >
          {selected && (
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary-500" />
          )}
        </div>
        <span className="text-sm sm:text-base text-secondary-800 truncate">
          {label}
        </span>
        {badge && (
          <span className="text-xs text-grey-400 bg-grey-100 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <span className="flex-shrink-0">{logo}</span>
    </button>
  );
}

// ─── Main page component ────────────────────────────────────────────────────

function ManageSubscriptionContent() {
  const { subscription: content } = dashboardContent;
  const router = useRouter();
  const searchParams = useSearchParams();

  // API hooks
  const { info, isLoading: infoLoading } = useSubscriptionInfo();
  const {
    subscription,
    isSubscribed,
    isLoading: subLoading,
    refetch: refetchSubscription,
  } = useMySubscription();
  const { subscribe, isLoading: subscribing } = useSubscribe();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Compute countdown values (days / hours / minutes / seconds)
  useEffect(() => {
    if (!info) return;

    // If backend only gives days, show them and keep smaller units at zero
    if (!info.endDate) {
      setTimeLeft({
        days: info.daysRemaining ?? 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    const targetTime = new Date(info.endDate).getTime();

    const update = () => {
      const now = Date.now();
      let diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor(
        (totalSeconds % (24 * 60 * 60)) / (60 * 60),
      );
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [info]);

  // UI state: sync payment form visibility with ?step=confirm for breadcrumb
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (searchParams.get("step") === "confirm") {
      setShowPaymentForm(true);
    }
  }, [searchParams]);

  const setShowPaymentFormWithUrl = (show: boolean) => {
    setShowPaymentForm(show);
    const path = "/dashboard/account/subscription/manage";
    if (show) {
      router.replace(`${path}?step=confirm`, { scroll: false });
    } else {
      router.replace(path, { scroll: false });
    }
  };
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("visa");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  useEffect(() => {
    setApplePayAvailable(
      "ApplePaySession" in window && ApplePaySession.canMakePayments(),
    );
  }, []);

  // Card form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Idempotency key — reused on retry, new UUID on fresh attempt
  const idempotencyKeyRef = useRef<string | null>(null);

  const isLoading = infoLoading || subLoading;

  // ── Helpers ──────────────────────────────────────────────────────────────

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(" ") : "";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
    }
  };

  const isFormComplete =
    cardName.trim() !== "" &&
    cardNumber.replace(/\s/g, "").length >= 15 &&
    cvv.length >= 3 &&
    expiryDate.length === 5;

  const resetForm = () => {
    setCardName("");
    setCardNumber("");
    setCvv("");
    setExpiryDate("");
    setSelectedPaymentMethod("visa");
    setPaymentError(null);
    idempotencyKeyRef.current = null;
  };

  // ── Payment submit ────────────────────────────────────────────────────────

  const handlePaymentSubmit = async () => {
    setPaymentError(null);

    // Generate idempotency key only for a fresh attempt
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }

    const moyasarKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;
    if (!moyasarKey) {
      setPaymentError("مفتاح بوابة الدفع غير مضبوط. يرجى التواصل مع الدعم.");
      return;
    }

    // Parse expiry (MM/YY)
    const [month, year] = expiryDate.split("/");
    const fullYear = year.length === 2 ? `20${year}` : year;

    // Step 1: Tokenize card via Moyasar
    let tokenId: string;
    try {
      const tokenRes = await fetch("https://api.moyasar.com/v1/tokens", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(moyasarKey + ":"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cardName,
          number: cardNumber.replace(/\s/g, ""),
          cvc: cvv,
          month,
          year: fullYear,
          save_only: true,
        }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.id) {
        const msg =
          tokenData?.message ||
          tokenData?.errors?.number?.[0] ||
          "فشل في التحقق من بيانات البطاقة";
        setPaymentError(msg);
        return;
      }

      tokenId = tokenData.id;
    } catch {
      setPaymentError("تعذر الاتصال ببوابة الدفع. يرجى التحقق من اتصالك.");
      return;
    }

    // Step 2: Submit to backend
    const result = await subscribe({
      token: tokenId,
      paymentMethod: "token",
      idempotencyKey: idempotencyKeyRef.current!,
    });

    if (!result.status) {
      setPaymentError(result.message || "فشلت عملية الدفع");
      // Keep idempotencyKey so retry reuses it
      return;
    }

    const sub = result.data;

    // Step 3: Handle response
    if (sub?.requires3DSecure && sub.threeDSecureUrl) {
      window.location.href = sub.threeDSecureUrl;
      return;
    }

    if (sub?.isActive) {
      setPaymentSuccess(true);
      refetchSubscription();
      return;
    }

    // Unexpected state — show generic message
    setPaymentError(result.message || "الدفع قيد المعالجة، يرجى الانتظار.");
  };

  // ── Apple Pay submit ──────────────────────────────────────────────────────

  const handleApplePaySubmit = () => {
    setPaymentError(null);
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }

    const request: ApplePayPaymentRequest = {
      countryCode: "SA",
      currencyCode: "SAR",
      supportedNetworks: ["visa", "masterCard", "mada"],
      merchantCapabilities: ["supports3DS"],
      total: { label: "إنجاز المعلم", amount: String(info?.finalAmount ?? 0) },
    };

    const session = new ApplePaySession(3, request);

    session.onvalidatemerchant = async (
      event: ApplePayValidateMerchantEvent,
    ) => {
      try {
        const res = await fetch("/api/subscriptions/apple-pay-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ validationURL: event.validationURL }),
        });
        const merchantSession = await res.json();
        session.completeMerchantValidation(merchantSession);
      } catch {
        session.abort();
        setPaymentError("تعذر التحقق من بوابة Apple Pay");
      }
    };

    session.onpaymentauthorized = async (
      event: ApplePayPaymentAuthorizedEvent,
    ) => {
      try {
        const result = await subscribe({
          token: JSON.stringify(event.payment.token),
          paymentMethod: "applepay",
          idempotencyKey: idempotencyKeyRef.current!,
        });

        if (!result.status) {
          session.completePayment({ status: ApplePaySession.STATUS_FAILURE });
          setPaymentError(result.message || "فشلت عملية الدفع");
          return;
        }

        session.completePayment({ status: ApplePaySession.STATUS_SUCCESS });

        const sub = result.data;
        if (sub?.requires3DSecure && sub.threeDSecureUrl) {
          window.location.href = sub.threeDSecureUrl;
          return;
        }
        if (sub?.isActive) {
          setPaymentSuccess(true);
          refetchSubscription();
        } else {
          setPaymentError(result.message || "الدفع قيد المعالجة، يرجى الانتظار.");
        }
      } catch {
        session.completePayment({ status: ApplePaySession.STATUS_FAILURE });
        setPaymentError("تعذر الاتصال ببوابة الدفع");
      }
    };

    session.begin();
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-[#FAFAFA] p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-4 animate-pulse">
        <div className="bg-grey-100 rounded-2xl h-64" />
        <div className="bg-grey-100 rounded-2xl h-32" />
      </div>
    );
  }

  // ─── Already subscribed ───────────────────────────────────────────────────

  if (isSubscribed && subscription) {
    return (
      <div className="min-h-[60vh] bg-[#FAFAFA] p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-6">
        <div className="bg-shade-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-secondary-800">
              {content.activeSubscriptionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl p-3 sm:p-4">
              <p className="text-xs text-grey-500 mb-1">
                {content.activeExpiryLabel}
              </p>
              <p className="text-sm sm:text-base font-medium text-secondary-800">
                {new Date(subscription.expiresAt).toLocaleDateString("ar-SA")}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4">
              <p className="text-xs text-grey-500 mb-1">
                {content.activeDaysRemainingLabel}
              </p>
              <p className="text-sm sm:text-base font-medium text-secondary-800">
                {subscription.daysRemaining} {content.dayUnit}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4">
              <p className="text-xs text-grey-500 mb-1">
                {content.activePaymentMethodLabel}
              </p>
              <p className="text-sm sm:text-base font-medium text-secondary-800">
                {subscription.paymentMethod || "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4">
              <p className="text-xs text-grey-500 mb-1">
                {content.activeAmountLabel}
              </p>
              <p className="text-sm sm:text-base font-medium text-secondary-800">
                {subscription.finalAmount} {content.sar}
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <Link
              href="/dashboard/account/subscription/history"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium underline"
            >
              {content.viewHistoryLink}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Subscription closed ──────────────────────────────────────────────────

  if (info && !info.isSubscriptionOpen) {
    return (
      <div className="min-h-[60vh] bg-[#FAFAFA] flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl sm:rounded-2xl">
        <div className="relative w-48 h-36 sm:w-64 sm:h-48 mb-6">
          <Image
            src="/images/dashboard/subscription.svg"
            alt="Subscriptions closed"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-secondary-800 mb-2">
          {content.closedTitle}
        </h2>
        <p className="text-sm text-grey-500 max-w-sm">{content.closedMessage}</p>
      </div>
    );
  }

  // ─── Payment success ──────────────────────────────────────────────────────

  if (paymentSuccess) {
    return (
      <div className="min-h-[60vh] bg-[#FAFAFA] flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl sm:rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-success-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-secondary-800 mb-2">
          {content.paymentSuccess}
        </h2>
        <p className="text-sm text-grey-500 mb-6 max-w-sm">
          {content.paymentSuccessMessage}
        </p>
        <Link href="/dashboard/account/subscription/history">
          <Button variant="primary" size="lg">
            {content.viewHistoryLink}
          </Button>
        </Link>
      </div>
    );
  }

  // ─── Payment form ─────────────────────────────────────────────────────────

  if (showPaymentForm) {
    const finalAmount = info?.finalAmount ?? 0;
    const expiryFormatted = info?.endDate
      ? new Date(info.endDate).toLocaleDateString("ar-SA")
      : "—";

    return (
      <div className="min-h-[60vh] bg-[#FAFAFA] rounded-xl sm:rounded-2xl px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 space-y-6 sm:space-y-8">
        <h2 className="text-lg sm:text-xl font-bold text-secondary-800 text-right">
          {content.form.title}
        </h2>

        {/* Subscription summary - white box */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 text-right">
          <div className="flex flex-row justify-between items-center gap-4 mb-3">
            <span className="text-sm sm:text-base text-grey-600">
              {content.form.subscriptionValue}
            </span>
            <span className="text-sm sm:text-base text-secondary-800 font-medium">
              {finalAmount} {content.sar}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center gap-4">
            <span className="text-sm sm:text-base text-grey-600">
              {content.form.expiryDate}
            </span>
            <span className="text-sm sm:text-base text-secondary-800 font-medium">
              {expiryFormatted}
            </span>
          </div>
        </div>

        {/* Remaining content */}
        <div className="min-w-0 overflow-hidden pt-2">
          {/* Error message */}
          {paymentError && (
            <div className="mb-5 p-3 bg-warning-50 border border-warning-200 rounded-lg text-sm text-warning-700 text-center">
              {paymentError}
            </div>
          )}

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {/* Payment methods */}
            <div className="order-2 lg:order-1 min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-secondary-800 mb-3 sm:mb-4 text-right">
                {content.form.paymentMethodTitle}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <PaymentMethodOption
                  method="visa"
                  label={content.form.visa}
                  selected={selectedPaymentMethod === "visa"}
                  onSelect={setSelectedPaymentMethod}
                  logo={
                    <Image
                      src="/images/landing/subscription/visa.png"
                      alt="Visa"
                      width={50}
                      height={16}
                      className="object-contain"
                    />
                  }
                />
                <PaymentMethodOption
                  method="mada"
                  label={content.form.mada}
                  selected={selectedPaymentMethod === "mada"}
                  onSelect={setSelectedPaymentMethod}
                  logo={
                    <Image
                      src="/images/dashboard/mada.svg"
                      alt="Mada"
                      width={50}
                      height={20}
                      className="object-contain"
                    />
                  }
                />
                <PaymentMethodOption
                  method="apple_pay"
                  label={content.form.applePay}
                  selected={selectedPaymentMethod === "apple_pay"}
                  onSelect={setSelectedPaymentMethod}
                  disabled={!applePayAvailable}
                  badge={
                    !applePayAvailable
                      ? content.applePayUnavailable
                      : undefined
                  }
                  logo={
                    <Image
                      src="/images/dashboard/apple-pay.svg"
                      alt="Apple Pay"
                      width={50}
                      height={20}
                      className="object-contain"
                    />
                  }
                />
              </div>
            </div>

            {/* Card details / Apple Pay panel */}
            <div className="order-1 lg:order-2 min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-secondary-800 mb-3 sm:mb-4 text-right">
                {content.form.cardDetailsTitle}
              </h3>
              {selectedPaymentMethod === "apple_pay" ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                  <Image
                    src="/images/dashboard/apple-pay.svg"
                    width={80}
                    height={50}
                    alt="Apple Pay"
                    className="object-contain"
                  />
                  <p className="text-sm text-grey-500">{content.applePayHint}</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm text-secondary-800 mb-2">
                      {content.form.cardNameLabel}
                      <span className="text-warning-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder={content.form.cardNamePlaceholder}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary-800 mb-2">
                      {content.form.cardNumberLabel}
                      <span className="text-warning-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder={content.form.cardNumberPlaceholder}
                      className="w-full"
                      dir="ltr"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm text-secondary-800 mb-2">
                        {content.form.cvvLabel}
                        <span className="text-warning-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 4) setCvv(value);
                        }}
                        placeholder={content.form.cvvPlaceholder}
                        className="w-full"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-secondary-800 mb-2">
                        {content.form.expiryLabel}
                        <span className="text-warning-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^\d/]/g, "");
                            if (value.length === 2 && !value.includes("/")) {
                              value += "/";
                            }
                            if (value.length <= 5) setExpiryDate(value);
                          }}
                          placeholder={content.form.expiryPlaceholder}
                          className="w-full pr-10"
                          dir="ltr"
                        />
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10">
          {selectedPaymentMethod === "apple_pay" ? (
            <Button
              variant="primary"
              size="lg"
              disabled={!applePayAvailable || subscribing}
              className="flex-1 py-3 sm:py-2.5 disabled:!bg-grey-200 disabled:!text-grey-500 disabled:cursor-not-allowed"
              onClick={handleApplePaySubmit}
            >
              {subscribing ? content.processingPayment : content.applePayPayButton}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              disabled={!isFormComplete || subscribing}
              className="flex-1 py-3 sm:py-2.5 disabled:!bg-grey-200 disabled:!text-grey-500 disabled:cursor-not-allowed"
              onClick={handlePaymentSubmit}
            >
              {subscribing ? content.processingPayment : content.form.confirmPayment}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ─── Plan card (default) ──────────────────────────────────────────────────

  const finalAmount = info?.finalAmount ?? null;
  const baseAmount = info?.subscriptionFee ?? null;
  const discountPct = info?.discountPercentage ?? 0;
  const daysRemaining = info?.daysRemaining ?? null;

  return (
    <div className="min-h-[60vh] bg-[#FAFAFA] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-6 sm:space-y-8 min-w-0">
      <div className="bg-shade-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden min-w-0">
        {/* Promo badge - top left */}
        <div className="absolute top-0 left-0">
          <span
            className="inline-block bg-[#CF636A] text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-tl-[24px] rounded-br-[24px] whitespace-nowrap"
          >
            {content.promoBadge}
          </span>
        </div>

        <div className="mt-6 sm:mt-8">
          {/* Plan header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-secondary-800 text-right">
              {content.planTitle}
            </h2>
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 min-w-0 sm:justify-end">
              {finalAmount !== null && (
                <span className="text-2xl sm:text-3xl font-bold text-primary-500">
                  {finalAmount}
                </span>
              )}
              <span className="text-base sm:text-lg text-grey-500">
                {content.priceCurrency}
              </span>
              {baseAmount !== null && discountPct > 0 && (
                <span className="text-xs sm:text-sm text-grey-400 line-through">
                  {content.priceSuffix} {baseAmount}
                </span>
              )}
              <span className="text-xs sm:text-sm text-grey-500">
                {content.priceCurrency}/{content.priceUnit}
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
            {content.features.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </div>

          {/* Countdown (أيام / ساعات / دقائق / ثواني) */}
          {(info?.daysRemaining ?? null) !== null && (
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-sm sm:text-base font-medium mb-3 text-right text-[#B1363E]">
                {content.countdownTitle}
              </p>
              <div className="inline-flex items-center justify-center gap-2 sm:gap-3">
                {[
                  { label: content.days, value: timeLeft.days },
                  { label: content.hours, value: timeLeft.hours },
                  { label: content.minutes, value: timeLeft.minutes },
                  { label: content.seconds, value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="min-w-[72px] sm:min-w-[88px] min-h-[50px] rounded-xl bg-transparent border-2 border-primary-500 px-1 py-2 flex items-center justify-center gap-1.5"
                  >
                    <span className="text-[12px] font-light md:text-base tabular-nums leading-none text-primary-500">
                      {item.value.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[12px] font-light md:text-base text-[#666] leading-none">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscribe button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full py-3 sm:py-2"
            onClick={() => {
              idempotencyKeyRef.current = null;
              setPaymentError(null);
              setShowPaymentFormWithUrl(true);
            }}
          >
            {content.subscribeNow}
          </Button>
        </div>
      </div>

      {/* Illustration when there is no active subscription */}
      {!isSubscribed && (
        <div className="flex justify-center">
          <Image
            src="/images/dashboard/subscription.svg"
            alt="اشتراك إنجاز المعلم"
            width={480}
            height={320}
            className="max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}

export default function ManageSubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3 animate-pulse">
          <div className="bg-grey-100 rounded-xl h-12" />
          <div className="bg-grey-100 rounded-xl h-32" />
          <div className="bg-grey-100 rounded-xl h-24" />
        </div>
      }
    >
      <ManageSubscriptionContent />
    </Suspense>
  );
}
