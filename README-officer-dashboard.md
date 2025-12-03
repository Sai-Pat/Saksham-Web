# Officer Dashboard Module

This module implements the Officer Dashboard with a glassmorphism theme, Indian patriotic accents, and multilingual support (English/Hindi).

## Features
- **Dashboard**: KPI cards, quick actions, and language switcher.
- **Document Verification**: Table view of applications with a slide-over for details and AI analysis.
- **Field Enumerator**: Visit scheduling and offline photo upload queue.
- **Beneficiary Profiling**: Analytics charts using Recharts.
- **i18n**: Full English and Hindi translation support.
- **Mock Data**: Simulated API calls with delay.

## Files Created
- `src/pages/officer/dashboard/`: Contains all new page components.
- `src/components/common/`: Reusable GlassCard, Button, and Icon components.
- `src/i18n/`: Configuration and locale files.
- `src/api/applications.js`: Mock API service.
- `mock-data/`: JSON data for applications and KPIs.

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Navigate to:
   - Dashboard: `/officer/dashboard`
   - Document Verification: `/officer/document-verification`
   - Field Enumerator: `/officer/field-enumerator`
   - Profiling: `/officer/beneficiary-profiling`

## Developer Notes
- **API Integration**: Replace functions in `src/api/applications.js` with real backend calls (e.g., Supabase or REST API).
- **Authentication**: The dashboard currently assumes a logged-in state via `PrivateRoute`. Ensure `useAuth` context provides the necessary user details.
- **Offline Queue**: `useOfflineQueue` uses `localStorage`. For production, consider using `localForage` or a service worker for better offline support.
