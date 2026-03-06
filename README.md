# Sardar Ji Chaipatti Wale

Premium Indian Tea Brand — Full-stack ecommerce website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Firebase**.

---

## Features

- 🛒 **Product catalog** with categories, search & filters
- 🔐 **Phone OTP authentication** via Firebase
- 👤 **User accounts** with order history, addresses & wishlist
- 🛡️ **Admin panel** for managing products, categories, orders & users
- 💳 **Razorpay payment integration**
- 📱 **Fully responsive** design
- 🎨 **Custom brand theme** (primary green, gold accents, cream background)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication (Phone OTP) |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Payments | Razorpay |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A **Firebase** project with Authentication (Phone provider), Firestore & Storage enabled
- A **Razorpay** account (for payment processing)

### 1. Clone the repository

```bash
git clone https://github.com/Ankitkr-001/sardar-jii-chaipatti-wale.git
cd sardar-jii-chaipatti-wale
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Admin setup — choose a strong secret key
ADMIN_SETUP_KEY=your_secret_admin_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

---

## Creating an Admin Account

There is no default admin account. To create one:

1. **Set `ADMIN_SETUP_KEY`** in your `.env.local` to a strong secret value (e.g. a random UUID).

2. **Sign in** to the application using your phone number at `/auth`.

3. **Navigate to `/admin-setup`** in your browser.

4. **Enter the setup key** you defined in step 1 and click **Activate Admin**.

5. Your account is now an admin. You will be redirected to the **Admin Panel** at `/admin`.

> **Security note:** The setup key is validated server-side and is never exposed to the browser. Keep it secret — anyone with this key and a signed-in account can grant themselves admin access.

---

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/              # About page
│   ├── admin/              # Admin panel (protected)
│   ├── admin-setup/        # Admin account activation
│   ├── api/                # API routes (Razorpay, admin-setup)
│   ├── auth/               # Phone OTP sign-in
│   ├── account/            # User dashboard
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── products/           # Product listing & detail
│   └── support/            # Support & FAQ
├── components/             # React components
│   ├── home/               # Homepage sections
│   ├── layout/             # Navbar, Footer, AdminSidebar
│   ├── products/           # ProductCard, ProductGallery
│   └── ui/                 # Shared UI (Toast, etc.)
├── context/                # React Contexts (Auth, Cart)
├── lib/                    # Firebase, Firestore, utilities
└── types/                  # TypeScript type definitions
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## License

This project is private. All rights reserved.