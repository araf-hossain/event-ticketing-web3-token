# Coinbase Event Airdrop Platform

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Project Overview

This platform facilitates airdrop distribution through Coinbase Wallet integration. It supports different user types (governance and non-governance) and handles token distribution based on user classification.

### Key Features

- Seamless integration with Coinbase Wallet
- Support for multiple token types
- EIP-712 compliant message signing
- Automated airdrop distribution system
- User type-based token allocation
- Base network integration

## Technical Stack

- **Frontend**: Next.js 13+
- **Backend**: Next.js API Routes
- **Blockchain**: Base Network (Chain ID: 8453)
- **Authentication**: EIP-712 Typed Data Signing
- **External Integration**: Coinbase Wallet API

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- Coinbase Wallet API credentials
- Environment variables setup (see below)

### Environment Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following required variables:

```env
# Development Mode
DEVELOPMENT=true

# Google Sheets Integration
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-google-private-key
GOOGLE_SHEET_ID=your-google-sheet-id

# Blockchain Configuration
INFURA_ID=your-infura-project-id
COINBASE_PK=your-private-key
CONTRACT_ADDRESS=your-contract-address

# Application Configuration
HOST=your-application-host-url
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
