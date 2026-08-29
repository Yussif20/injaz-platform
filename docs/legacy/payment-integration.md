# Subscription & Payment Integration

> Complete reference for the Injaz Al-Moalem subscription feature — what is built, how it works,
> what is missing, and what anyone continuing this work needs to know.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Environment Variables](#environment-variables)
4. [API Endpoints](#api-endpoints)
5. [Data Types](#data-types)
6. [Files Changed / Created](#files-changed--created)
7. [Payment Flow (Step by Step)](#payment-flow-step-by-step)
8. [3D Secure Flow](#3d-secure-flow)
9. [Idempotency](#idempotency)
10. [Error Handling](#error-handling)
11. [Moyasar Integration Details](#moyasar-integration-details)
12. [Admin Dashboard](#admin-dashboard)
13. [What Is Missing / Not Yet Done](#what-is-missing--not-yet-done)
14. [Testing Guide](#testing-guide)
15. [Gotchas & Known Issues](#gotchas--known-issues)

---

## Overview

**Teacher app** (`injaz-almoalem`) has a full subscription payment flow wired to real API endpoints.
**Admin dashboard** (`injaz-dashboard`) is read-only — admins view/manage subscriptions; no payment logic needed there.

The payment gateway is **Moyasar** (Saudi payment processor). Card data is tokenized client-side directly
with the Moyasar API before anything is sent to the backend. The backend never sees raw card numbers.

---

## Architecture

```
Browser (Teacher App)
  │
  ├─ Step 1: GET /api/subscriptions/info          → Next.js route → backend
  │          (pricing, discount, is subscription open?)
  │
  ├─ Step 2: POST https://api.moyasar.com/v1/tokens  (direct from browser, NOT via proxy)
  │          Authorization: Basic base64(pk_...:)
  │          Body: { name, number, cvc, month, year, save_only: true }
  │          Returns: { id: "tok_..." }
  │
  ├─ Step 3: POST /api/subscriptions/subscribe    → Next.js route → backend
  │          Headers: Idempotency-Key: <uuid>
  │          Body: { paymentMethod: "token", token: "tok_..." }
  │
  └─ Step 4: Handle response
             ├─ requires3DSecure=true  → redirect to threeDSecureUrl
             ├─ isActive=true          → show success
             └─ error                 → show error message, allow retry with same idempotency key
```

**Proxy architecture** (all server calls go through Next.js API routes):
```
clientApi (Axios, baseURL: "")  →  /app/api/subscriptions/*  →  serverApi  →  staging.enjazfile.com
```

Auth tokens are stored in HTTP-only cookies and read server-side via `getAccessToken()` from
`src/shared/lib/cookies.ts`. The client never handles the JWT directly.

---

## Environment Variables

### `injaz-almoalem/.env.local`

```env
# Moyasar payment gateway publishable key (starts with pk_)
# Get from backend team — there are separate test and production keys
NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY=pk_test_REPLACE_WITH_REAL_KEY
```

> **Important:** This is a `NEXT_PUBLIC_` variable — it is embedded in the browser bundle at build time.
> It is safe to expose (it's a publishable key, not a secret key). Never put the Moyasar secret key here.

### How to get the key

Ask the backend team for:
- A **test key** (`pk_test_...`) for development/staging
- A **production key** (`pk_live_...`) for production deployment

Test keys only charge against Moyasar's sandbox; no real money moves.

---

## API Endpoints

All backend endpoints are at `https://staging.enjazfile.com`.

### Teacher-facing (require Bearer JWT)

| Method | Backend endpoint | Next.js proxy route | Auth |
|--------|-----------------|---------------------|------|
| GET | `/api/Subscriptions/info` | `/api/subscriptions/info` | **No** — public |
| POST | `/api/Subscriptions/subscribe` | `/api/subscriptions/subscribe` | Yes |
| GET | `/api/Subscriptions/my-subscription` | `/api/subscriptions/my-subscription` | Yes |
| GET | `/api/Subscriptions/my-history` | `/api/subscriptions/my-history` | Yes |

> Note: `/api/Subscriptions/info` is marked public in the integration guide — the Next.js route
> intentionally does **not** attach an Authorization header.

### Special header on subscribe

The `POST /api/subscriptions/subscribe` route reads `Idempotency-Key` from the incoming request
headers and forwards it to the backend unchanged. This is how duplicate charges are prevented.

### Admin-only endpoints (used by dashboard, not teacher app)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Subscriptions` | All subscriptions |
| GET | `/api/Subscriptions/filtered` | Paginated + filtered subscriptions list |
| GET/PUT | `/api/subscription-settings` | Fee, end date, active discount |
| GET/POST/PUT/DELETE | `/api/subscription-discounts` | Discount CRUD |

---

## Data Types

### `SubscriptionInfo` — from GET /info

```typescript
// injaz-almoalem/src/features/dashboard/types/me.types.ts
interface SubscriptionInfo {
  subscriptionFee: number;        // base price before discount
  discountPercentage: number;     // e.g. 20 means 20% off
  finalAmount: number;            // price after discount — use this for display
  daysRemaining: number;          // days until subscription period closes
  endDate: string;                // ISO datetime — when this period ends
  isSubscriptionOpen: boolean;    // false = show "closed" state, disable payment
  activeDiscount: SubscriptionDiscount | null;
}
```

### `Subscription` — from subscribe / my-subscription / my-history

```typescript
interface Subscription {
  id: number;
  userId: number;
  subscribedAt: string;           // ISO datetime
  expiresAt: string;              // ISO datetime
  baseAmount: number;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: string;          // STRING not number — see values below
  paymentMethod: string | null;   // "mada", "visa", "mastercard", "token", etc.
  paymentTransactionId: string | null;
  isActive: boolean;              // true = subscription is live and valid
  daysRemaining: number;
  appliedDiscount: SubscriptionDiscount | null;
  // 3DS fields
  requires3DSecure: boolean;
  threeDSecureUrl: string | null; // redirect here if requires3DSecure is true
  paymentGatewayId: string | null;
  paymentFee: number | null;
  paymentCompletedAt: string | null;
}
```

### `paymentStatus` string values

The API returns **strings**, not numeric enums. Both the teacher app and admin dashboard handle this.

| API value | Meaning | UI treatment |
|-----------|---------|--------------|
| `"Processing"` | Payment in progress | Show spinner |
| `"Initiated"` | 3DS flow started | Redirect to `threeDSecureUrl` |
| `"Completed"` | Payment successful | `isActive` should be `true` |
| `"Failed"` | Payment failed | Show error, allow retry |
| `"Refunded"` | Refunded | Show refund notice |

> **Gotcha:** The old `PaymentStatus` numeric enum in `me.types.ts` still exists (legacy, not used
> in the actual API calls). The `Subscription.paymentStatus` field is typed as `string`.
> The admin dashboard's `getPaymentStatusLabel` handles both string and numeric values.

---

## Files Changed / Created

### Teacher App (`injaz-almoalem/src/`)

| Status | File | What changed |
|--------|------|-------------|
| Modified | `shared/lib/api.ts` | Added 4 subscription endpoint constants |
| Created | `app/api/subscriptions/info/route.ts` | GET proxy, no auth |
| Created | `app/api/subscriptions/subscribe/route.ts` | POST proxy, auth, forwards Idempotency-Key |
| Created | `app/api/subscriptions/my-subscription/route.ts` | GET proxy, auth |
| Created | `app/api/subscriptions/my-history/route.ts` | GET proxy, auth |
| Created | `features/dashboard/services/subscription.service.ts` | 4 client API functions |
| Created | `features/dashboard/hooks/useSubscriptionInfo.ts` | Query hook, 1 min stale |
| Created | `features/dashboard/hooks/useMySubscription.ts` | Query hook + `isSubscribed` derived |
| Created | `features/dashboard/hooks/useSubscribe.ts` | Mutation hook |
| Created | `features/dashboard/hooks/useSubscriptionHistory.ts` | Query hook |
| Modified | `features/dashboard/hooks/index.ts` | Exports for new hooks |
| Modified | `features/dashboard/services/index.ts` | Export for new service |
| Modified | `features/dashboard/types/me.types.ts` | Updated `Subscription` type, added `SubscriptionInfo` type |
| Rewritten | `app/dashboard/account/subscription/manage/page.tsx` | Full rewrite — 4 UI states |
| Created | `app/dashboard/account/subscription/callback/page.tsx` | 3DS return page |
| Modified | `app/dashboard/account/subscription/history/page.tsx` | Wired to real hook |
| Modified | `content/ar/dashboard.ts` | Added Arabic strings for new states |

### Admin Dashboard (`injaz-dashboard/src/`)

| Status | File | What changed |
|--------|------|-------------|
| Modified | `features/subscriptions/components/SubscriptionsTab.tsx` | `getPaymentStatusLabel` + `getPaymentStatusVariant` now handle API string values |

### Root

| Status | File | What |
|--------|------|------|
| Created | `injaz-almoalem/.env.local` | Moyasar key placeholder |

---

## Payment Flow (Step by Step)

### 1. Page loads

`useSubscriptionInfo` and `useMySubscription` fire in parallel.

- If either is loading → skeleton shown
- If `isSubscribed && subscription` → show active subscription card (skip to step 6)
- If `info.isSubscriptionOpen === false` → show "subscription closed" message (end)
- Otherwise → show plan card with real `finalAmount`, `discountPercentage`, `daysRemaining`

### 2. User clicks "اشترك الآن"

- `idempotencyKeyRef.current` is cleared (null)
- `showPaymentForm = true`
- Payment form renders with real `finalAmount` and formatted `endDate` from the API

### 3. User fills card form and clicks "تأكيد الدفع"

Validation: all fields filled, card number ≥ 15 digits, CVV ≥ 3 digits, expiry = MM/YY format.

### 4. `handlePaymentSubmit` runs

```
a. Check NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY exists → else show error
b. Generate crypto.randomUUID() idempotency key (only if not already set, i.e. fresh attempt)
c. Parse expiry "MM/YY" → month + fullYear ("20YY")
d. POST https://api.moyasar.com/v1/tokens
   Authorization: Basic base64(pk_test_...:)      ← note the trailing colon
   Body: { name, number (no spaces), cvc, month, year, save_only: true }
   → get back { id: "tok_..." }
e. POST /api/subscriptions/subscribe
   Idempotency-Key: <uuid from step b>
   Body: { paymentMethod: "token", token: "tok_..." }
```

### 5. Handle backend response

```
result.status === false  → show result.message as error, keep idempotency key for retry
result.data.requires3DSecure === true  → window.location.href = threeDSecureUrl
result.data.isActive === true  → setPaymentSuccess(true), refetch subscription
otherwise  → show result.message as error (payment processing, etc.)
```

### 6. Active subscription card

Shows: expiry date, days remaining, payment method, final amount paid, link to history.

---

## 3D Secure Flow

Most Saudi cards (especially Mada) require 3DS. The flow:

```
1. User submits card → backend initiates payment with Moyasar
2. Backend returns: { requires3DSecure: true, threeDSecureUrl: "https://..." }
3. Frontend: window.location.href = threeDSecureUrl
   (full page redirect — no iframe)
4. User completes bank verification on Moyasar/bank page
5. Moyasar calls backend webhook → backend marks subscription active
6. Moyasar redirects user back to the callback URL configured in Moyasar dashboard
```

### Callback page (`/dashboard/account/subscription/callback`)

- **Must be configured** in the Moyasar dashboard as the redirect URL after 3DS
- On mount: calls `refetch()` on `useMySubscription`
- If `isActive` → shows success + auto-redirects to manage page after 3 seconds
- If not active → shows pending state with manual "تحديث الحالة" button

### Moyasar Dashboard Configuration — ACTION REQUIRED

> Someone must log into the Moyasar merchant dashboard and set the callback/redirect URL to:
> `https://your-domain.com/dashboard/account/subscription/callback`
>
> Without this, after 3DS completes the user will land on a blank Moyasar page, not the app.

---

## Idempotency

`crypto.randomUUID()` is generated in the manage page and stored in `idempotencyKeyRef` (a React ref,
not state — so it survives re-renders without causing them).

**Key rule:**
- First submission → generate new UUID, store in ref
- Error → keep same UUID in ref (ref is NOT cleared on error)
- Retry → ref still has same UUID → same key sent → backend deduplicates → no double charge
- Cancel/go back → `resetForm()` clears ref → next attempt gets a fresh UUID

This means a user can safely hammer the submit button or retry after a network failure without
being charged twice.

---

## Error Handling

### Moyasar tokenization errors

Moyasar returns errors like:
```json
{ "message": "...", "errors": { "number": ["Card number is invalid"] } }
```

The code checks `tokenData?.message || tokenData?.errors?.number?.[0]` for a user-facing message.
If the Moyasar response is not OK and has no message, falls back to generic Arabic error.

### Backend subscription errors

Common messages the backend returns (in Arabic):

| Message | Cause | Action |
|---------|-------|--------|
| `الاشتراكات مغلقة حاليًا` | `isSubscriptionOpen = false` | Show closed UI state |
| `لديك اشتراك معلق قيد المعالجة` | Pending subscription exists | Wait / contact support |
| `تم تجاوز الحد الأقصى لمحاولات الدفع` | Too many retries | Wait for lockout period |
| `يتطلب التحقق الإضافي (3D Secure)` | 3DS required | Should be caught by `requires3DSecure` flag |
| `تمت عملية الدفع بنجاح` | Success | `isActive = true` |
| `فشلت عملية الدفع` | Payment failed | Show error, allow retry |

### Network / unknown errors

Caught in the outer `try/catch` in `handlePaymentSubmit` → shown as
"تعذر الاتصال ببوابة الدفع. يرجى التحقق من اتصالك."

---

## Moyasar Integration Details

### Tokenization endpoint

```
POST https://api.moyasar.com/v1/tokens
Authorization: Basic <base64(publishableKey + ":")>   ← trailing colon is intentional
Content-Type: application/json

{
  "name": "Cardholder Name",
  "number": "4111111111111111",   ← no spaces
  "cvc": "123",
  "month": "12",
  "year": "2027",                 ← 4-digit year
  "save_only": true
}
```

Response on success:
```json
{ "id": "tok_...", "status": "verified", ... }
```

### Payment method sent to backend

The current implementation always sends `paymentMethod: "token"` regardless of whether the user
selected Visa or Mada. This is correct — Moyasar auto-detects Mada from the card BIN number.
The `paymentMethod` field in the backend response reflects the actual detected method.

### Apple Pay

Apple Pay is shown in the UI but **disabled** with a "متاح قريباً" badge. To enable it:

1. **Domain verification** — register the domain with Apple Pay via Moyasar merchant dashboard
2. **Apple Pay JS** — use Moyasar's `applepay` payment method option in `Moyasar.init()`
3. This requires a real HTTPS domain (not localhost), a paid Apple developer account,
   and coordination with the backend team for merchant validation

Full Moyasar Apple Pay docs: https://docs.moyasar.com/api/apple-pay

---

## Admin Dashboard

The admin dashboard (`injaz-dashboard`) does not process payments — it is read-only.

**What it shows** (`/dashboard/subscriptions` → "فواتير الإشتراكات" tab):
- Paginated list of all subscriptions
- Filters: date range, active/inactive status, search
- Per subscription: user name, subscribed date, expiry, base amount, discount %, final amount,
  payment status badge, active status badge, days remaining

**The fix applied:** `getPaymentStatusLabel` and `getPaymentStatusVariant` in `SubscriptionsTab.tsx`
now handle **both** string API values (`"Completed"`, `"Failed"`, `"Processing"`, `"Initiated"`,
`"Refunded"`) and legacy numeric values (0–3). The string path is case-insensitive.

---

## What Is Missing / Not Yet Done

### 1. Moyasar publishable key — BLOCKER

`injaz-almoalem/.env.local` has a placeholder value:
```
NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY=pk_test_REPLACE_WITH_REAL_KEY
```
Get the real test key from the backend team. Without it, clicking "تأكيد الدفع" immediately shows
an error and no API calls are made.

### 2. Moyasar callback URL configuration — REQUIRED FOR 3DS

Log into the Moyasar merchant dashboard and set the 3DS callback/redirect URL to:
```
https://<your-deployed-domain>/dashboard/account/subscription/callback
```
This URL is where Moyasar sends users back after bank verification. Without it, the 3DS flow
breaks (user ends up on a Moyasar page with no way back to the app).

### 3. Apple Pay — needs domain verification

See [Apple Pay section](#apple-pay) above. Requires:
- HTTPS domain registered with Apple
- Moyasar merchant dashboard setup
- Merchant validation endpoint (Moyasar provides it)
- UI toggle to show the Apple Pay button only when `window.ApplePaySession` is available

### 4. Subscription renewal

There is no "renew subscription" flow for users whose subscription has expired. The manage page
currently only shows the active subscription card or the new-subscription form. If `isActive = false`
but the user has a past subscription, they see the payment form (same as a first-time subscriber).
This is probably correct behavior — but verify with the product team.

### 5. "Processing" / "Pending" subscription state

If a user submits payment and the backend returns `isActive: false` without `requires3DSecure`
(payment is queued/processing), the current code shows:
```
"الدفع قيد المعالجة، يرجى الانتظار."
```
There is no polling or webhook push to update the UI automatically. The user has to manually
refresh or navigate away and come back. A proper fix would be either:
- Short polling: `setInterval(() => refetchSubscription(), 3000)` with a max retry count
- WebSocket/server-sent events from the backend when payment status changes

### 6. Discount code input

The `SubscriptionInfo` response includes `activeDiscount` (the system-wide active discount).
There is no UI for users to enter a **manual discount code**. If the backend supports user-entered
codes (beyond the automatic active discount), a code input field needs to be added to the payment form.

### 7. Subscription page is not in the sidebar/route guard

Verify that the subscription manage/history pages appear in the sidebar navigation and that the
route guard logic does not block access to subscription pages for users in `PendingSubscription`
status (`ProfileStatus = 3`). Those users specifically need to reach the subscription page.

### 8. Email/SMS confirmation

No email or SMS is sent from the frontend after a successful payment. This is typically handled
by the backend (via a webhook from Moyasar), but worth confirming with the backend team.

---

## Testing Guide

### Without the Moyasar key (works now)

- Subscription info card shows real price/discount/days from API
- Subscription closed state (toggle in admin dashboard → current year tab)
- Active subscription card (if test account already subscribed)
- Payment form renders correctly
- History page shows empty state or real data
- Callback page: visit `/dashboard/account/subscription/callback` directly
- Admin dashboard payment status labels

### With the Moyasar test key

Add to `injaz-almoalem/.env.local`:
```
NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY=pk_test_<key from backend team>
```

**Test card numbers (Moyasar sandbox):**

| Card | Number | Expected |
|------|--------|----------|
| Visa (success, triggers 3DS) | `4111 1111 1111 1111` | 3DS redirect → success |
| Mastercard (success) | `5555 5555 5555 4444` | 3DS redirect → success |
| Mada (success) | `9682 8200 6200 2001` | 3DS redirect → success |
| Failed payment | `4000 0000 0000 0002` | Error message shown |

Use any future expiry (e.g. `12/28`), any 3-digit CVV, any cardholder name.

**Idempotency test:**
1. Submit payment
2. While processing (or after an error), click submit again
3. Only one charge should appear — the second call uses the same idempotency key

**3DS flow test:**
1. Use a success card number
2. Should redirect to a Moyasar/bank page
3. Complete verification
4. Should land on `/dashboard/account/subscription/callback`
5. Should show success and redirect to manage page

> Note: Step 4 only works if the callback URL is configured in Moyasar dashboard.
> Until then, the user ends up on a Moyasar page after 3DS. The subscription IS activated
> (backend webhook fires), but the user has to navigate back manually.

---

## Gotchas & Known Issues

**`paymentStatus` is a string, not an enum**
The `Subscription` type has `paymentStatus: string`. The old `PaymentStatus` numeric enum in
`me.types.ts` is still in the file but is not used for API data — don't use it for comparisons
against API values.

**Subscription info endpoint is public but needs auth in practice**
`GET /api/Subscriptions/info` does not require a token per the backend docs, and the Next.js
route deliberately omits the Authorization header. However, if you ever need user-specific pricing
(e.g. applying a user-specific discount), this would need to be re-examined.

**`save_only: true` in Moyasar token request**
The `save_only: true` flag tells Moyasar to tokenize the card without making a charge. The actual
charge happens on the backend when it calls Moyasar with the token. This is intentional.

**Expiry year format**
The card form accepts `MM/YY` (2-digit year). The code converts it to a 4-digit year by prepending
`"20"`. This works until year 2100 and is standard practice.

**Apple Pay is disabled but rendered**
The Apple Pay option is visible in the UI with `disabled` prop and "متاح قريباً" badge. This is
intentional — it shows users the option exists but isn't available yet, which is better UX than
hiding it. When enabling it, remove the `disabled` prop and `badge` from the `PaymentMethodOption`.

**Card number formatting uses groups of 4**
The card form formats numbers as groups of 4 digits (`1234 5678 9012 3456`). Moyasar's tokenization
endpoint receives the raw digits (spaces stripped). This is standard and works for all card types.
