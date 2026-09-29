# BazaarPulse ⚡ - Pakistani Apparel Sales & Discount Aggregator

BazaarPulse is a production-grade web application and ingestion pipeline that aggregates real-time sales, discounts, and price drop history across top Pakistani fashion and apparel retailers (**Sapphire, Outfitters, Khaadi, J. Junaid Jamshed, Ideas Gul Ahmed, Nishat Linen, Sana Safinaz, Bachaa Party, Ethnic, Limelight**).

![BazaarPulse Banner](https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

- **⚡ Real-Time Shopify Ingestion Engine**:
  - Automatically ingests live products and discounts from Shopify endpoints (`/products.json` & `/collections/sale/products.json`).
  - Implements change detection to track price drops and record price history timelines.

- **👗 Multi-Audience Navigation & Filters**:
  - Dedicated 1-tap quick filters for **Women & Girls**, **Men & Boys**, **Kids & Infants**, **Unstitched Lawn**, **Western Wear**, and **Flat 50%+ OFF**.
  - Faceted search by price range (PKR), discount depth, brand selection, and stock availability.

- **🎨 Minimalist Light & Luxury Design System**:
  - Ultra-clean light theme featuring high-legibility typography (`Outfit` + `Inter`), soft slate borders, and vibrant audience color badges.

- **📱 100% Mobile-Responsive 2-Column Feed**:
  - Touch-optimized 2-column mobile feed for browsing deals smoothly on iOS & Android smartphones.

- **📊 Price Drop History & Wishlist**:
  - Interactive price drop timeline modals.
  - Bookmarked deals wishlist drawer with local storage sync.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & ORM**: Prisma ORM with SQLite / PostgreSQL compatibility
- **Icons**: Lucide React
- **Ingestion Scraper**: Axios + Node.js Ingestion Engine

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Muhammad-Fasih07/bazarpulse.git
cd bazarpulse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Initialize Database & Seed Catalog
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Live Scraper Engine (Optional)
```bash
npm run scrape
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

MIT License. Designed & Developed for Pakistani Fashion Shoppers.
