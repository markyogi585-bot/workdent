# WorkDent - Verification & Testing Protocol (TESTING.md)

## 1. Automated Verification Checks

1. **Zero 404 Routing Verification**:
   - All legacy Next.js 404 chunks have been systematically converted to valid static HTML pages.
   - Script-verified: 0 instances of `This page could not be found` or `next-error-h1`.

2. **Legal Consent Validation**:
   - `auth/register.html` checkbox defaults to unchecked.
   - Submitting without consent halts execution and displays: *"You must agree to the Terms & Conditions and Privacy Policy to create an account."*
   - Clicking `"Terms & Conditions"` navigates directly to `/terms` without toggling checkbox state.

3. **Google-Style Avatar Dropdown**:
   - When authenticated, navbar renders user avatar.
   - Clicking avatar reveals the account card.
   - Pressing `Escape` or clicking anywhere outside immediately closes the dropdown.

4. **Multi-Step Onboarding**:
   - Completing 5-step onboarding saves profile to session cookie, updates `onboarding_completed: true`, and navigates to dashboard.

5. **Color Discipline & Purple Audit**:
   - Automated grep confirms zero purple, violet, or indigo hex tokens in core stylesheets.
