# Medicine Inventory Management System 💊

A modern, full-stack, production-ready web application built for pharmacies, clinics, and medical dispensaries to easily manage their medicine inventory, alerts, and detailed financial reports.

## Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + UI components
* **Charting:** Recharts
* **Database & Auth:** Supabase PostgreSQL

## Key Features
1. **Secure Admin Login:** Protected dashboard using Next.js Middleware.
2. **Dashboard Overview:** Live real-time database queries mapping Total Items, Low Stock counts, and Financial Valuations.
3. **Medicines & Categories CRUD:** Complete tracking with Supplier, Minimum Stock alert definitions, and Expirations.
4. **Stock In Logic:** Logs received shipment data while dynamically validating and increasing Master Quantity.
5. **Stock Out Logic:** Logs dispensations, blocking out-bound reductions if Physical Quantity becomes negative, and decreasing Master Quantity.
6. **Advanced Alerting System:** Scans inventory for critically low active stock or batches expiring within 90 days.
7. **Business Reports:** Real-time projected retail value and inventory expenses visualizations.

## Environment Variables
Create a `.env.local` file at the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Setup Instructions
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```
