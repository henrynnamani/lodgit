# LodgeIt — Student Housing Platform

A full-stack student lodge listing platform built with Next.js 14, Convex, and Cloudinary.

## Features
- 🏠 Browse lodge listings with filters (city, room type, price, amenities, distance)
- 📹 Video tour support with Cloudinary upload
- 📅 "Request Viewing" system — student submits form, stored in Convex (no number exposed)
- 🏢 Agent listing form with thumbnail + video upload
- 🔍 Search by title or location
- 🌙 Dark theme with orange accent

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Convex
```bash
npx convex dev
```
Copy the deployment URL shown and add it to `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 3. Set up Cloudinary
1. Create a free account at cloudinary.com
2. Go to Settings → Upload → Add upload preset
3. Set it to "Unsigned" mode
4. Add to `.env.local`:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

### 4. Run
```bash
npm run dev
```

## Project Structure
```
├── app/
│   ├── page.tsx              # Homepage with listings + filters
│   └── list-property/
│       └── page.tsx          # Agent listing form
├── components/
│   ├── ListingCard.tsx       # Lodge card with video play button
│   ├── ViewingModal.tsx      # Viewing request form modal
│   └── Filters.tsx           # Filter sidebar
├── convex/
│   ├── schema.ts             # Database schema
│   ├── listings.ts           # Listing queries + mutations
│   └── viewingRequests.ts    # Viewing request mutations
```

## Convex Collections
- **listings** — all lodge listings with agent details
- **viewingRequests** — student viewing requests (filtered to protect agent privacy)
# lodgit
