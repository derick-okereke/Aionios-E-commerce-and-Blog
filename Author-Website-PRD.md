# Author Website & Online Bookstore

## Product Requirements Document

---

**Prepared for:** The Client (Author)
**Prepared by:** [Derick Okereke], Website Developer
**Document Version:** 1.0
**Date:** June 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Objectives](#2-goals--objectives)
3. [Target Audience](#3-target-audience)
4. [Site Structure & Pages](#4-site-structure--pages)
5. [Design Direction](#5-design-direction)
6. [Book Sales Strategy & Purchase Flow](#6-book-sales-strategy--purchase-flow)
7. [Blog Strategy (Hashnode CMS)](#7-blog-strategy-hashnode-cms)
8. [Additional Features](#8-additional-features)
9. [Technology Stack](#9-technology-stack)
10. [Roles & Responsibilities](#10-roles--responsibilities)
11. [Project Scope & Phases](#11-project-scope--phases)
12. [Assumptions & Risks](#12-assumptions--risks)

---

## 1. Project Overview

This document describes the plan for a new website built for the client, a Christian author who writes books explaining Bible truths for both adults and children. The website will serve as the client's digital home — a place where readers can discover his books, purchase them directly or through Selar, read his blog articles, and learn more about his ministry and writing.

The website will be built using HTML, CSS, and JavaScript, supported by a small number of free or low-cost third-party tools and services. No traditional backend server or database will be required, which keeps the website fast, simple to maintain, and inexpensive to run.

---

## 2. Goals & Objectives

- Give the client a professional, trustworthy online presence that reflects his ministry and writing.
- Make it easy for readers to discover and purchase his books — both his adult Christian books and his children's books.
- Allow the client to publish blog articles easily, without needing technical help each time.
- Provide a simple, low-fee way for Nigerian readers to pay directly for books without relying solely on Selar.
- Keep ongoing running costs and technical maintenance as low as possible.

---

## 3. Target Audience

### Adult Readers

Christians and spiritual seekers interested in Bible study, devotionals, and faith-based teaching. Likely to read blog content and may purchase via card, transfer, or Selar.

### Parents & Children

Parents looking for faith-based children's books to read with or to their children. Purchase decisions are made by parents, so messaging should speak to them directly.

---

## 4. Site Structure & Pages

### 4.1 Home Page

- Hero section introducing the author with a short tagline ("Bringing Bible truths to life — for all ages")
- Featured / latest books section
- Short "About the Author" teaser linking to the full About page
- Preview of the latest blog post

### 4.2 Books Page

- Two clearly separated sections: **Christian Books (Adults)** and **Children's Books**
- Each book displayed as a card: cover image, title, short description, and a "View Book" link

### 4.3 Book Detail Page

- Full book description and a short excerpt or preview
- "Buy Now" button (on-site bank transfer flow — see Section 6)
- "Buy on Selar" button for readers who prefer that route
- Related books section

### 4.4 Blog Page

- Grid or list of articles pulled automatically from the client's Hashnode account
- Individual article page for each post, with social sharing buttons

### 4.5 About Page

- The client's personal story, his calling, and his mission as a writer
- Photos, and optionally a short welcome video

### 4.6 Contact Page

- A simple contact form for speaking invitations, bulk orders, and media enquiries
- Submissions sent directly to the client's email — no inbox or dashboard to manage

---

## 5. Design Direction

The website should feel warm, trustworthy, and approachable — reflecting both the spiritual depth of the client's adult books and the playful friendliness of his children's books.

### 5.1 Visual Tone

- Clean white backgrounds with warm, earthy accent tones and gold highlights
- A subtle shift in color palette and typography between the "adult" and "children's" sections of the site, while still feeling like one cohesive brand
- Scripture quote banners used between sections to reinforce the faith-based message
- Handwritten-style accent fonts used sparingly for warmth, paired with a clean, readable body font

### 5.2 Tone for the Children's Section

Brighter colors, friendlier illustrations or imagery, and simpler navigation — designed with parents browsing on behalf of their children in mind.

---

## 6. Book Sales Strategy & Purchase Flow

After reviewing several options (including Gumroad, Payhip, and Paystack's hosted checkout), the chosen approach avoids third-party platform fees entirely and works around the fact that the client does not currently have a CAC-registered business — which is required for full Paystack integration.

### 6.1 Chosen Approach: Manual Bank Transfer with Email Confirmation

Visitors purchase books directly from the website using a simple, human-verified bank transfer process. No third-party payment processor fees apply — only standard bank transfer charges the buyer's bank may apply.

**Purchase flow:**

1. Visitor clicks "Buy Now" on a book's detail page.
2. A popup displays the client's bank account details and the exact price of the book.
3. Visitor makes the transfer using their own banking app.
4. Visitor enters their email address and clicks "I've Made the Transfer."
5. A confirmation message is shown: _"Thank you! Once your payment is confirmed, your download link will be sent to your email — usually within a few hours."_
6. A notification is automatically sent to the client (via email) with the buyer's email address, the book purchased, and the amount expected.
7. The client checks his bank account/app to confirm the transfer was received.
8. Once confirmed, the client sends the buyer their download link by email.

> **Why this approach was chosen:** It avoids Gumroad's 10% fee, avoids Paystack's CAC registration requirement, and keeps full payment control and trust with the client — every sale is personally confirmed by him before a book is released. This also suits the nature of the client's audience well.

### 6.2 Buying via Selar

Every book page will also include a "Buy on Selar" button for readers who prefer that option, or for international readers outside Nigeria. This requires no extra setup beyond linking to the existing Selar listing.

### 6.3 Future Upgrade Path

Once the client registers his business (CAC) and is ready, the bank transfer flow can be replaced with a fully automated Paystack integration — supporting card, transfer, and USSD payments with instant, automatic delivery of the download link. This is recommended as a Phase 2 upgrade and is not part of the initial build.

---

## 7. Blog Strategy (Hashnode CMS)

Since the website has no backend or admin dashboard, the client needs a simple, separate place to write his blog articles — one that doesn't require any help from a developer each time he wants to publish.

### 7.1 How It Works

- The client signs up for a free Hashnode account and writes his articles there, using an editor similar to Google Docs or Microsoft Word.
- The website automatically fetches and displays his latest articles using Hashnode's API — readers never know the articles are written on a different platform.
- When the client publishes a new article on Hashnode, it appears on his website blog page automatically, with no developer involvement required.

### 7.2 Cost

Hashnode is completely free for this use case — writing, publishing, and API access all come at no cost.

---

## 8. Additional Features

| Feature                             | Purpose                                                                                | Tool                         |
| ----------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------- |
| Contact Form                        | Speaking invitations, bulk orders, media enquiries                                     | Formspree or Web3Forms       |
| Email Newsletter Signup             | Build an audience for future books and articles                                        | Mailchimp embed form         |
| Free Resource Opt-in _(optional)_   | Offer a free devotional PDF in exchange for an email address, to grow the mailing list | Mailchimp + downloadable PDF |
| Testimonials Section                | Build trust with new visitors using reader reviews                                     | Static HTML section          |
| Speaking / Events Page _(optional)_ | List upcoming church engagements or speaking events                                    | Static HTML page             |

---

## 9. Technology Stack

| Layer                       | Tool / Technology                                        | Cost                      |
| --------------------------- | -------------------------------------------------------- | ------------------------- |
| Website (front-end)         | HTML, CSS, JavaScript                                    | Free                      |
| Hosting                     | Vercel                                                   | Free                      |
| Blog / CMS                  | Hashnode (via API)                                       | Free                      |
| Book Purchase Notifications | Vercel Serverless Function + email service (e.g. Resend) | Free tier                 |
| Contact Form                | Formspree or Web3Forms                                   | Free tier                 |
| Newsletter                  | Mailchimp                                                | Free tier                 |
| Domain Name                 | Any domain registrar (e.g. Namecheap)                    | Paid (annual, small cost) |

> **Note:** This stack intentionally avoids any paid software, subscriptions, or traditional backend hosting, keeping the client's ongoing costs limited to little more than the domain name renewal.

---

## 10. Roles & Responsibilities

| Task                                                 | Responsible Party                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| Designing and building the website                   | Developer                                                                      |
| Adding a new book page when a new title is released  | Developer                                                                      |
| Writing and publishing blog articles                 | Client (via Hashnode)                                                          |
| Confirming bank transfers and sending download links | Client                                                                         |
| Updating book prices or descriptions                 | Developer (initial build) — may be simplified for the client in a future phase |
| Responding to contact form enquiries                 | Client                                                                         |
| Renewing the domain name annually                    | Client                                                                         |

---

## 11. Project Scope & Phases

### 11.1 Phase 1 — Initial Launch (This Build)

- ✅ All core pages (Home, Books, Blog, About, Contact)
- ✅ Manual bank transfer purchase flow with email notifications
- ✅ Selar buy links on all book pages
- ✅ Hashnode-powered blog
- ✅ Contact form and newsletter signup
- ✅ Responsive design for mobile and desktop

### 11.2 Phase 2 — Future Upgrades (Not Included Initially)

- ⏳ Fully automated Paystack payment integration (requires CAC registration)
- ⏳ Shopping cart for multiple-book purchases in a single transaction
- ⏳ Client-facing dashboard for managing books without developer help

---

## 12. Assumptions & Risks

### 12.1 Assumptions

- The client will check his bank account regularly enough to confirm payments within the promised timeframe.
- The client is willing to manually send download links after confirming payment, at least during Phase 1.
- The client has or will create accounts on Hashnode, and has an Selar listing for his books.

### 12.2 Risks

**Delayed confirmations:** If the client is slow to confirm payments, buyers may be left waiting longer than expected. Clear, honest messaging on the site helps manage this.

**Manual errors:** Since payment confirmation is manual, there is a small risk of a buyer being missed or a wrong book being sent. A simple checklist or log (e.g. a shared spreadsheet) is recommended to track orders.

**No fraud protection:** Because there's no automatic payment verification, this approach relies on trust. The risk is considered low given the nature of the client's audience, but should be monitored as sales grow.

---

_Author Website & Online Bookstore — Product Requirements Document — Version 1.0_
