# Development Authentication Bypass

During development, authentication is bypassed to allow free navigation without a backend user. When the backend is ready, you need to disable this bypass.

## How to Disable

Set `DEV_SKIP_AUTH = false` in the following files:

| File | Line | Purpose |
|------|------|---------|
| `src/middleware.ts` | 9 | Route protection (redirects to login) |
| `src/features/auth/hooks/useAuth.ts` | 14 | Returns mock user data |
| `src/features/auth/hooks/useLogout.ts` | 13 | Skips logout API call |

## Quick Search

Find all occurrences with:

```bash
grep -rn "DEV_SKIP_AUTH" src/
```

## Mock User Data

When bypass is enabled, the following mock user is returned:

```typescript
{
  userId: "dev-user-123",
  phone: "+966501234567",
  fullName: "محمد أحمد",
  userName: "mohammed_ahmed",
  role: "teacher",
  gender: Gender.Male,
  email: "mohammed@example.com",
  profileImage: undefined,
}
```

## Checklist

- [ ] `src/middleware.ts` - Set `DEV_SKIP_AUTH = false`
- [ ] `src/features/auth/hooks/useAuth.ts` - Set `DEV_SKIP_AUTH = false`
- [ ] `src/features/auth/hooks/useLogout.ts` - Set `DEV_SKIP_AUTH = false`
- [ ] Test login flow works correctly
- [ ] Test protected routes redirect to login when not authenticated
- [ ] Test logout clears session and redirects
