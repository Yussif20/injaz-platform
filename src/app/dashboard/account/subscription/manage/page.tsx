"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { dashboardContent } from "@/content";
import { Button, Input } from "@/shared/components/ui";

// Target date: April 1st, 2026 at 12:00 AM (defined outside component to avoid re-renders)
const PROMO_END_TIMESTAMP = new Date(2026, 3, 1, 0, 0, 0).getTime();

// Countdown timer hook - takes timestamp to avoid re-renders
function useCountdown(targetTimestamp: number) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetTimestamp - Date.now();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return timeLeft;
}

// Countdown unit component
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-transparent border-2 border-primary-700 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 min-w-[56px] sm:min-w-[70px]">
      <span className="text-xl sm:text-2xl font-bold text-primary-700 tabular-nums">{value}</span>
      <span className="text-[10px] sm:text-xs text-grey-500">{label}</span>
    </div>
  );
}

// Feature list item component
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
      <span className="text-xs sm:text-sm text-secondary-800 break-words">{text}</span>
    </div>
  );
}

// Payment method option component
type PaymentMethod = "visa" | "mada" | "apple_pay";

function PaymentMethodOption({
  method,
  label,
  logo,
  selected,
  onSelect,
}: {
  method: PaymentMethod;
  label: string;
  logo: React.ReactNode;
  selected: boolean;
  onSelect: (method: PaymentMethod) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(method)}
      className={`
        w-full flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-colors min-w-0
        ${selected ? "border-primary-500 bg-shade-50" : "border-grey-200 bg-white hover:border-grey-300"}
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
        <span className="text-sm sm:text-base text-secondary-800 truncate">{label}</span>
      </div>
      <span className="flex-shrink-0">{logo}</span>
    </button>
  );
}

// Confirmation Modal Component
function ConfirmSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  expiryDate,
  remainingTime,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expiryDate: string;
  remainingTime: string;
  content: {
    confirmModalTitle: string;
    remainingText: string;
    subscriptionEndsOn: string;
    confirm: string;
  };
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 p-1 text-grey-400 hover:text-grey-600 transition-colors touch-manipulation"
          aria-label="إغلاق"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center pt-6 sm:pt-0">
          <h3 className="text-lg sm:text-xl font-bold text-secondary-800 mb-4 sm:mb-6 break-words">
            {content.confirmModalTitle}
          </h3>

          <p className="text-sm sm:text-base text-grey-600 mb-3 break-words">
            {content.remainingText}
          </p>

          {/* Remaining time badge */}
          <div className="inline-block bg-primary-500 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full mb-3 sm:mb-4">
            <span className="text-sm sm:text-base font-medium">{remainingTime}</span>
          </div>

          <p className="text-sm sm:text-base text-grey-600 mb-4 sm:mb-6 break-words">
            {content.subscriptionEndsOn} {expiryDate}
          </p>

          {/* Confirm button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full py-3 sm:py-2"
            onClick={onConfirm}
          >
            {content.confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManageSubscriptionPage() {
  const { subscription } = dashboardContent;
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("visa");

  // Form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // TODO: Replace with real subscription data from API
  const isSubscribed = false;

  // Calculate expiry date (1 year from now)
  const subscriptionExpiryDate = new Date();
  subscriptionExpiryDate.setFullYear(subscriptionExpiryDate.getFullYear() + 1);
  const formattedExpiryDate = `${subscriptionExpiryDate.getDate()} / ${subscriptionExpiryDate.getMonth() + 1} / ${subscriptionExpiryDate.getFullYear()}`;

  // Calculate remaining time until end of academic year (May 28, 2026)
  const academicYearEnd = new Date(2026, 4, 28); // May 28, 2026
  const now = new Date();
  const diffTime = academicYearEnd.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const remainingDays = diffDays % 30;
  const remainingTimeText = `${subscription.form.monthAnd} ${remainingDays} ${subscription.form.days}`;

  // Countdown to promo end date
  const timeLeft = useCountdown(PROMO_END_TIMESTAMP);

  const handleSubscribeClick = () => {
    setShowSubscriptionForm(true);
  };

  const handleCancelSubscription = () => {
    setShowSubscriptionForm(false);
    // Reset form
    setCardName("");
    setCardNumber("");
    setCvv("");
    setExpiryDate("");
    setSelectedPaymentMethod("visa");
  };

  const handleConfirmPayment = () => {
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    // TODO: Implement actual payment logic
    console.log("Payment confirmed", {
      paymentMethod: selectedPaymentMethod,
      cardName,
      cardNumber,
      cvv,
      expiryDate,
    });
    setShowConfirmModal(false);
    // Reset and go back to plan view
    handleCancelSubscription();
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,3}/g);
    return groups ? groups.join(" ") : "";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
    }
  };

  // Subscription Form View
  if (showSubscriptionForm) {
    return (
      <>
        <div className="space-y-4 sm:space-y-6">
          {/* Form Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 min-w-0 overflow-hidden">
            <h2 className="text-lg sm:text-xl font-bold text-secondary-800 mb-4 sm:mb-6 text-center">
              {subscription.form.title}
            </h2>

            {/* Subscription Details */}
            <div className="flex flex-col md:flex-row md:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base text-grey-600">
                  {subscription.form.subscriptionValue}
                </span>
                <span className="text-sm sm:text-base text-secondary-800 font-medium">
                  {subscription.form.priceText}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base text-grey-600">
                  {subscription.form.expiryDate}
                </span>
                <span className="text-sm sm:text-base text-secondary-800 font-medium">
                  {formattedExpiryDate}
                </span>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Payment Methods - Right Side */}
              <div className="order-1 lg:order-2 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-secondary-800 mb-3 sm:mb-4 text-center">
                  {subscription.form.paymentMethodTitle}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <PaymentMethodOption
                    method="visa"
                    label={subscription.form.visa}
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
                    label={subscription.form.mada}
                    selected={selectedPaymentMethod === "mada"}
                    onSelect={setSelectedPaymentMethod}
                    logo={
                      <Image
                        src="/images/landing/subscription/mada.svg"
                        alt="Mada"
                        width={50}
                        height={20}
                        className="object-contain"
                      />
                    }
                  />
                  <PaymentMethodOption
                    method="apple_pay"
                    label={subscription.form.applePay}
                    selected={selectedPaymentMethod === "apple_pay"}
                    onSelect={setSelectedPaymentMethod}
                    logo={
                      <Image
                        src="/images/landing/subscription/apple-pay.svg"
                        alt="Apple Pay"
                        width={50}
                        height={20}
                        className="object-contain"
                      />
                    }
                  />
                </div>
              </div>

              {/* Card Details - Left Side */}
              <div className="order-2 lg:order-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-secondary-800 mb-3 sm:mb-4 text-center">
                  {subscription.form.cardDetailsTitle}
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {/* Card Name */}
                  <div>
                    <label className="block text-sm text-secondary-800 mb-2">
                      {subscription.form.cardNameLabel}
                      <span className="text-warning-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder={subscription.form.cardNamePlaceholder}
                      className="w-full"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm text-secondary-800 mb-2">
                      {subscription.form.cardNumberLabel}
                      <span className="text-warning-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder={subscription.form.cardNumberPlaceholder}
                      className="w-full"
                      dir="ltr"
                    />
                  </div>

                  {/* CVV and Expiry Date */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm text-secondary-800 mb-2">
                        {subscription.form.cvvLabel}
                        <span className="text-warning-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 4) setCvv(value);
                        }}
                        placeholder={subscription.form.cvvPlaceholder}
                        className="w-full"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-secondary-800 mb-2">
                        {subscription.form.expiryLabel}
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
                          placeholder={subscription.form.expiryPlaceholder}
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
              </div>
            </div>
          </div>

          {/* Confirm Payment Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full py-3 sm:py-2"
            onClick={handleConfirmPayment}
          >
            {subscription.form.confirmPayment}
          </Button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancelSubscription}
            className="w-full text-sm sm:text-base text-grey-500 hover:text-grey-700 transition-colors py-3 sm:py-2 touch-manipulation"
          >
            {subscription.form.cancel}
          </button>
        </div>

        {/* Confirmation Modal */}
        <ConfirmSubscriptionModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleFinalConfirm}
          expiryDate="28 / 5 / 2026"
          remainingTime={remainingTimeText}
          content={subscription.form}
        />
      </>
    );
  }

  // Default Subscription Plan View
  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Subscription Plan Card */}
      <div className="bg-shade-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden min-w-0">
        {/* Promo badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span className="bg-primary-500 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-full whitespace-nowrap">
            {subscription.promoBadge}
          </span>
        </div>

        <div className="mt-6 sm:mt-8">
          {/* Plan header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-secondary-800 min-w-0 break-words pr-20 sm:pr-24">
              {subscription.planTitle}
            </h2>
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 min-w-0">
              <span className="text-2xl sm:text-3xl font-bold text-primary-500">
                {subscription.priceDiscounted}
              </span>
              <span className="text-base sm:text-lg text-grey-500">
                {subscription.priceCurrency}
              </span>
              <span className="text-xs sm:text-sm text-grey-400 line-through">
                {subscription.priceSuffix} {subscription.priceOriginal}
              </span>
              <span className="text-xs sm:text-sm text-grey-500">
                {subscription.priceCurrency}/{subscription.priceUnit}
              </span>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
            {subscription.features.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </div>

          {/* Countdown section */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-secondary-800 font-medium mb-3 sm:mb-4">
              {subscription.countdownTitle}
            </p>
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
              <CountdownUnit value={timeLeft.days} label={subscription.days} />
              <CountdownUnit
                value={timeLeft.hours}
                label={subscription.hours}
              />
              <CountdownUnit
                value={timeLeft.minutes}
                label={subscription.minutes}
              />
              <CountdownUnit
                value={timeLeft.seconds}
                label={subscription.seconds}
              />
            </div>
          </div>

          {/* Subscribe button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full py-3 sm:py-2"
            onClick={handleSubscribeClick}
          >
            {subscription.subscribeNow}
          </Button>
        </div>
      </div>

      {/* Empty state for unsubscribed users */}
      {!isSubscribed && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
          <div className="relative w-48 h-36 sm:w-64 sm:h-48">
            <Image
              src="/images/dashboard/subscription.svg"
              alt="No subscriptions"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
