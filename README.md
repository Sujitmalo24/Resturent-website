# Full Restaurant — Next.js + MongoDB Reservation System

A full-stack restaurant reservation system built with Next.js (App Router) and MongoDB. Includes:

- Reservation creation with conflict detection
- Admin approval workflow (pending → confirmed/cancelled)
- Email notifications (Resend, SendGrid, SMTP with nodemailer) with development fallback
- Contact form with admin notification and customer auto-reply
- Simple admin UI (login, dashboard) and RESTful API endpoints

---

## Quick overview

This project provides a production-ready foundation for running an online reservation system. Customers submit reservation requests which enter a pending state. An admin reviews requests and approves or rejects them — only then is a confirmation/cancellation email sent to the customer.

---

## Features

- MongoDB-backed reservation model with status: `pending`, `confirmed`, `cancelled`
- Reservation conflict detection (prevents double-booking)
- Email notifications to admin + customer (after admin approval)
- Admin dashboard with reservation management and exports
- JWT-based admin authentication (simple for demo; replace with full auth in production)
- Environment-driven configuration and dev email simulation

---

## Prerequisites

- Node.js 18+ (or compatible with your Next.js version)
- npm / yarn / pnpm
- MongoDB Atlas (recommended) or self-hosted MongoDB
- (Optional) Resend account or SendGrid / SMTP credentials to send production emails

---

## Environment variables (.env.local)

Create a `.env.local` in the project root. Do NOT commit secrets to source control.

Example `.env.local` (replace values):

```
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/your-db-name

# Admin key (short-term/demo). Change for production or use proper auth
ADMIN_KEY=change-this-to-a-secure-string

# JWT for admin auth
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Email provider options (choose one)
# Resend
RESEND_API_KEY=rev_your_resend_api_key

# or SendGrid
# SENDGRID_API_KEY=your_sendgrid_key

# or SMTP (nodemailer)
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=you@example.com
# SMTP_PASS=your-smtp-password

# Global email settings
EMAIL_FROM="Delicious Restaurant <onboarding@yourdomain.com>"
ADMIN_ALERT_EMAIL=admin@yourdomain.com
EMAIL_DEV_MODE=false    # set true to simulate emails to console

# Next config
NEXT_PUBLIC_SITE_URL=https://your-production-site.com

# Optional: other site settings
RESTAURANT_NAME="Delicious Restaurant"
RESTAURANT_EMAIL=contact@yourdomain.com
RESTAURANT_PHONE="+1 (555) 123-4567"
```

Notes:
- For Resend, you must verify a sending domain at https://resend.com/domains to send to arbitrary addresses. Without domain verification Resend only allows sending to verified addresses.
- Keep `EMAIL_DEV_MODE=true` during development to avoid sending real emails; set to `false` in production.

---

## Installation

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd my-app
npm install
```

2. Create `.env.local` using the example above and fill in secrets.

---

## Development

Start the dev server (by default Next uses port 3000; if occupied it will pick another port):

```bash
npm run dev
```

Open http://localhost:3000 (or the port printed by Next) in your browser.

Important dev utilities:
- `GET /api/debug/send-test-email` — send a test email to verify email configuration
- `POST /api/reservations` — create a reservation (customer-facing)
- `PUT /api/reservations` — admin endpoint to update reservation status (requires admin key or admin authorization)

---

## Production Build & Deployment

1. Build the app:

```bash
npm run build
```

2. Start production server locally for testing:

```bash
npm run start
```

3. Deploy to Vercel (recommended for Next.js):
   - Connect repository to Vercel
   - Set all environment variables in the Vercel dashboard (do NOT use local .env for production)
   - Ensure domain verification for email provider (Resend) if sending customer emails

Other hosting options: Netlify, Render, your own Node host — ensure environment variables and MongoDB access are configured.

---

## Admin workflow

- Customer submits reservation → stored with `status: pending`
- Admin receives an alert email with reservation details and approve/reject links (or use admin dashboard)
- Admin approves → backend updates reservation `status` to `confirmed` and sends confirmation email to customer
- Admin rejects → backend updates `status` to `cancelled` and sends cancellation notice

Admin UI:
- Visit `/admin/login` to sign in (demo uses simple credentials flow and issues a JWT)
- `/admin/dashboard` contains an interactive reservation management section, where you can filter, approve, reject, and export reservations

Security note: Replace the simple `ADMIN_KEY` flow with robust authentication (NextAuth, OAuth, or custom admin users) before production.

---

## Email configuration notes

Resend (recommended for this project):
- Create an account at https://resend.com
- Verify your sending domain under "Domains"
- Add `RESEND_API_KEY` to `.env.local`
- Set `EMAIL_FROM` to an address on the verified domain

SendGrid or SMTP:
- Add your provider credentials to `.env.local`
- Update `lib/email.js` will detect SendGrid or SMTP configuration automatically

Dev testing:
- `EMAIL_DEV_MODE=true` logs message content to the server console instead of sending.

---

## Database & Models

- MongoDB is used via Mongoose (see `models/Reservation.js`, `models/Contact.js`, `models/Admin.js`)
- Ensure `MONGODB_URI` points to your production database and restrict access via IP/network rules
- Use backups and monitoring for production data

---

## API Endpoints (important ones)

- POST /api/reservations — create a reservation (public)
- GET /api/reservations — list reservations (admin)
- PUT /api/reservations — update reservation status (admin)
- POST /api/contact — create contact message (public)
- GET /api/debug/send-test-email — debug/test email sending

Refer to route files in `app/api/` for request/response shapes and validation rules.

---

## Troubleshooting

- Emails not delivered to customers:
  - Check `EMAIL_DEV_MODE` in `.env.local` (should be `false` in production)
  - For Resend, verify your domain and update `EMAIL_FROM` to the verified domain address
  - Inspect server logs to see Resend API responses

- Admin requests failing with special characters in `ADMIN_KEY`:
  - Ensure the admin key is URL-encoded when used in query parameters or sent in JSON body
  - Prefer sending the admin key in a JSON body or Authorization header, not as a query string

- MongoDB connection errors:
  - Verify `MONGODB_URI` and network access rules in Atlas
  - Ensure the correct MongoDB user and password are used

---

## Security & Next Steps (recommended before production)

- Replace simple key-based admin auth with proper user accounts and 2FA (NextAuth or custom)
- Use environment secrets manager in your hosting provider (Vercel, Render, etc.)
- Add rate limiting and input sanitization for APIs
- Add logging, monitoring and alerting (e.g. Sentry, Logflare)
- Add automated tests (integration tests for API flows)

---

## License

This project is provided as-is. Add a LICENSE file to declare your preferred license.

---

If you want, I can:
- Create a `.env.example` file from the variables above
- Add instructions or UX for verifying Resend domains
- Harden admin authentication with NextAuth or JWT user management
