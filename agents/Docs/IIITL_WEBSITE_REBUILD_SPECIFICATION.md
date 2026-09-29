# Indian Institute of Information Technology, Lucknow (IIITL)
## Next-Generation Web Portal & Academic Operating System — Architecture & Rebuild Specification

---

## 1. Executive Summary & Project Vision

The Indian Institute of Information Technology, Lucknow (IIIT Lucknow) is an Institute of National Importance established under the IIIT (PPP) Act 2017 by the Ministry of Education, Government of India. The existing website (`https://iiitl.ac.in`) has served the institute since its inception but faces architectural constraints: monolithic WordPress architecture, exposed compute engine IP addresses (`35.194.30.215`), static PDF-based workflows for course structures and fees, fragmented third-party sub-sites (Netlify, Vercel, GitHub Pages), dead subdomains (`cro.iiitl.ac.in`, `wcarl.iiitl.ac.in`), manual physical clearance procedures, and an absence of automated academic and financial workflows.

This specification outlines the complete redesign and re-engineering of the IIIT Lucknow digital ecosystem into an **Enterprise Academic Portal & Dynamic Content Platform**.

### Core Pillars of the Modernization
1. **Unified Modern Architecture:** Rebuilt using **Next.js 15 (App Router, Server Actions, React Server Components)**, **TypeScript**, **PostgreSQL** with **Prisma/Drizzle ORM**, **Redis / BullMQ** for background job queues, and **Docker**.
2. **Cloud-Native Deployment via GCB:** Fully automated CI/CD pipeline using **Google Cloud Build (GCB)** deploying auto-scaling, containerized microservices to **Google Cloud Run**, protected behind **Cloudflare Enterprise/Pro DNS, CDN, and WAF**.
3. **Asset & Storage Management:** High-performance storage via **AWS S3 / S3-compatible GCP Cloud Storage** for media assets, tender documents, institutional brochures, Excel grade templates, and generated PDF grade cards.
4. **Identity & Security:** Single Sign-On (SSO) strictly restricted to institutional Google Workspace accounts (`@iiitl.ac.in`), coupled with a dynamic, fine-grained **Role-Based Access Control (RBAC)** engine.
5. ~~**AI Integration via OpenRouter**~~ **REMOVED BY DECISION (2026-09-30):** the AI chatbot and all LLM/OpenRouter features are out of scope for this website. Site search remains conventional, index-backed full-text search. Any future AI work requires a separate approved proposal.
6. **Academic & Grading Automation:** Complete digitization of examination workflows where faculty download pre-populated Excel templates, input marks, and the system automatically computes Grade Points, SGPA, and CGPA, routing results through Exam Cell moderation to student dashboards and automated email dispatch with PDF transcripts attached.
7. **Accounts & Fee Portal:** Unified student ledger tracking tuition fees, institute charges, hostel allotment, mess dues, and an automated 7-stage digital "No Dues" clearance workflow with caution money refund processing.
8. **Brand-Compliant Design System:** Complete implementation of IIIT Lucknow's refined blue-dominant color palette (eliminating orange entirely) with exact visual weight ratios (55% White/Soft Gray, 20% Light Blue, 15% Primary Blue, 7% Dark Blue, 3% Green Accent).

---

## 2. Comprehensive Requirements & Technology Architecture

```
                                  [ Users & Clients ]
                                          │
                                          ▼
                   ┌───────────────────────────────────────────────┐
                   │               Cloudflare Edge                 │
                   │  - Global Anycast CDN & Static Asset Caching  │
                   │  - DDoS Protection & Web Application Firewall  │
                   │  - SSL/TLS Termination & Turnstile Anti-Bot   │
                   └──────────────────────┬────────────────────────┘
                                          │
                                          ▼
                   ┌───────────────────────────────────────────────┐
                   │            Google Cloud Platform              │
                   │                                               │
                   │   ┌───────────────────────────────────────┐   │
                   │   │     Google Cloud Run (Next.js 15)     │   │
                   │   │   - Server-Side Rendering (SSR)       │   │
                   │   │   - Edge & Dynamic API Routes         │   │
                   │   │   - Google OAuth2 (@iiitl.ac.in)      │   │
                   │   │   - Dynamic RBAC Middleware           │   │
                   │   │   - Next.js Server Actions            │   │
                   │   └───────┬───────────────┬───────────────┘   │
                   │           │               │                   │
                   │           ▼               ▼                   │
                   │   ┌──────────────┐ ┌──────────────┐           │
                   │   │ Cloud SQL    │ │ Memorystore  │           │
                   │   │ (PostgreSQL) │ │ (Redis)      │           │
                   │   └──────────────┘ └──────┬───────┘           │
                   │                           │                   │
                   │                           ▼                   │
                   │   ┌───────────────────────────────────────┐   │
                   │   │      Cloud Run Background Worker      │   │
                   │   │   - BullMQ Queue Consumer             │   │
                   │   │   - ExcelJS Batch Marks Processor     │   │
                   │   │   - Puppeteer PDF Grade Card Engine   │   │
                   │   │   - Batch Email Dispatcher            │   │
                   │   └───────────────────────────────────────┘   │
                   └───────┬───────────────────────┬───────────────┘
                           │                       │
              ┌────────────┴────────────┐    ┌─────┴───────────────────┐
              ▼                               ▼
   ┌──────────────────────┐         ┌──────────────────────┐
   │ AWS S3 / Cloud Store │         │      Email API       │
   │ - Media & PDFs       │         │ - Resend / SES       │
   │ - Excel Templates    │         │ - Result Dispatch    │
   │ - Digital Transcripts│         │ - Fee Receipts       │
   └──────────────────────┘         └──────────────────────┘
```

### 2.1 Technology Stack Matrix

| Layer | Selected Technology | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (React 19, App Router) | Fast Server-Side Rendering (SSR), Incremental Static Regeneration (ISR) for public pages, React Server Components for performance. |
| **Styling & Tokens** | Tailwind CSS v4 + Radix UI Primitives | Strict implementation of the IIITL Color System tokens with accessible ARIA primitives, dark/contrast themes. |
| **Authentication** | NextAuth.js (Auth.js v5) / Google OAuth | Domain-locked OAuth: strictly validates hosted domain `hd: "iiitl.ac.in"`. No external signups permitted. |
| **Database & ORM** | PostgreSQL 16 on Cloud SQL + Prisma ORM | Relational schema with ACID compliance, dynamic RBAC relations, course credit schemas, and financial transaction logs. |
| **Cache & Queue** | Google Cloud Memorystore / Upstash Redis | Fast session store, rate limiting, and BullMQ worker queue for asynchronous marks computation and email dispatch. |
| **Compute & Hosting** | Google Cloud Run (Containerized) | Serverless autoscaling (0 to N instances), zero-downtime blue/green traffic splitting, regional high availability. |
| **CI/CD Pipeline** | Google Cloud Build (GCB) | Automated GitHub webhook triggers, Docker multi-stage image build, automated schema migration, and deployment to Cloud Run. |
| **Edge CDN & WAF** | Cloudflare Pro / Enterprise | Anycast DNS, SSL/TLS, DDoS mitigation, Web Application Firewall (WAF), caching static assets, bot management. |
| **Blob / Object Store**| AWS S3 / GCP Cloud Storage (S3 API) | Encrypted storage for brochures, tender PDFs, photo galleries, Excel batch templates, and student transcripts. |
| **Email Delivery API**| Resend / Amazon SES | Transactional and bulk delivery of grade cards, passwordless verification, fee payment alerts, and tender notifications. |
| **Spreadsheet Engine** | ExcelJS & SheetJS (xlsx) | Programmatic creation of stylized, locked Excel templates with pre-filled student rosters and robust server parsing. |
| **PDF Generation** | Puppeteer / React-PDF Engine | High-fidelity vector generation of semester grade cards, transcripts, fee receipts, and official no-dues certificates. |
| ~~**AI Layer**~~ | **Removed by decision** | No LLM/chatbot layer. Search is conventional full-text over published content. |

---

## 3. Brand Identity & Design System Specification

### 3.1 Refined Institutional Palette (Orange Completely Removed)

| Color Token | HEX Code | Tailwind Variable | Semantic Role & UI Placement |
| :--- | :--- | :--- | :--- |
| 🔵 **Primary Blue** | `#005F99` | `brand-primary` | Main institutional brand color, header navbar, primary buttons, active links, section sub-headers. |
| 🔵 **Dark Blue** | `#00446D` | `brand-dark` | Footer background, dark feature blocks, leadership banners, active hover/focus states. |
| 🔵 **Navy Text** | `#172B3A` | `brand-navy` | High-contrast body typography, main headings (H1/H2/H3), data table values. |
| 🩵 **Light Blue** | `#E6F2F9` | `brand-light` | Hero background, notification callouts, alternating table row highlights, active card hover surfaces. |
| 🩶 **Soft Gray** | `#F7FAFC` | `brand-gray` | Secondary card backgrounds, canvas background behind cards, form input backgrounds. |
| ⚪ **White** | `#FFFFFF` | `brand-white` | Primary content canvas, card surfaces, modal dialogs, crisp contrast elements. |
| 🟢 **Green Accent** | `#008325` | `brand-green` | **Restrained Accent (3% Balance):** Decorative anchor underlines, featured research badges, successful fee badge. |
| 🟢 **Pale Green** | `#E8F5EC` | `brand-green-light`| Subtle background pills for "Verified", "Active Tender", and "Awarded Grants". |

### 3.2 Target Visual Balance Ratio
```text
WHITE / SOFT GRAY      █████████████████████████  55%  (Clean, uncluttered, readable surface)
LIGHT BLUE             █████████                  20%  (Subtle structure, hero container, section contrast)
PRIMARY BLUE           ██████                     15%  (Identity anchors: Navbar, action buttons, link states)
DARK BLUE              ███                         7%  (Grounding base: Footer, feature vision container)
GREEN ACCENT           █                            3%  (Surgical highlights: Key metrics, status indicators)
```
> **Core Architectural Rule:** Green is an *accent discovered in the experience*, never a dominant brand block. The blue-and-white harmony reflects the prestige and dignity of IIIT Lucknow.

---

### 3.3 Component & Section Styling Guidelines

#### 🏛️ Global Navbar
* **Background:** Primary Blue (`#005F99`).
* **Branding:** Official IIIT Lucknow crest/logo in crisp white vector + Institute name in English and Hindi (`भारतीय सूचना प्रौद्योगिकी संस्थान, लखनऊ`).
* **Navigation Links:** Pure white typography (`#FFFFFF`), `font-medium`, 14px uppercase tracking.
* **Active Indicator:** Thin 2px white underline (`#FFFFFF`) with smooth CSS transition (`ease-in-out duration-200`). No secondary color fills.
* **Utility Topbar:** Dark Blue (`#00446D`) utility bar housing Rajbhasha Hindi toggle, Accessibility controller, RTI link, and Portal Login.

#### 🖼️ Hero Section
* **Background:** Subtle gradient or soft solid Light Blue (`#E6F2F9`).
* **Typography:** Dark Blue (`#00446D`) and Navy (`#172B3A`) typography.
  ```text
  LEARN · INNOVATE · BUILD · IMPACT
                  ↓
        Shaping a Smarter Tomorrow
  ```
* **Call-to-Action Buttons:**
  * *Primary Button:* Solid Primary Blue (`#005F99`) background, White (`#FFFFFF`) text, slight shadow, hover Dark Blue (`#00446D`).
  * *Secondary Button:* Clean White (`#FFFFFF`) background with a 1.5px Primary Blue (`#005F99`) border and text.

#### 📊 At a Glance (Metrics & Stats)
* **Section Canvas:** Pure White (`#FFFFFF`).
* **Metric Cards:** Soft Gray (`#F7FAFC`) with subtle 1px border (`#DCE5EB`).
* **Numbers & Icons:** Primary Blue (`#005F99`), `font-extrabold`.
* **Accent Touch:** A single 2px Green Accent line (`#008325`) underneath the top statistic (e.g., "₹1.00 Cr Highest Package" or "Ranked Top 20 Among IIITs").

#### 🎓 Academics & Curriculum
* **Section Canvas:** Soft Gray (`#F7FAFC`).
* **Program Cards:** Crisp White (`#FFFFFF`) with 12px border-radius and subtle card elevation.
* **Card Icons & Header:** Primary Blue (`#005F99`).
* **Hover Interaction:** Card border morphs to `#005F99` and subtle background tint to Light Blue (`#E6F2F9`).

#### 🔬 Research & Innovation
* **Section Canvas:** White (`#FFFFFF`).
* **Typography & Headings:** Primary Blue (`#005F99`) with subtle divider in `#DCE5EB`.
* **Accent Use:** Green Accent (`#008325`) used strictly for research tags (e.g., `IEEE JSTARS`, `Springer`, `MeitY Funded`) and a thin 2px accent beneath section title:
  ```text
  RESEARCH & INNOVATION
  ─────────────────────
        ↑ #008325
  ```

#### 📰 News, Announcements & Notices
* **Section Canvas:** Pure White (`#FFFFFF`).
* **Title Links:** Primary Blue (`#005F99`) with hover color Dark Blue (`#00446D`).
* **Date Badges:** Muted Slate (`#5F7180`).
* **Dividers:** Clean Slate Borders (`#DCE5EB`). No bright or jarring colors.

#### 🧑‍🎓 Campus Life & Clubs
* **Section Canvas:** Light Blue (`#E6F2F9`).
* **Club / Activity Cards:** Pure White (`#FFFFFF`) cards with `#005F99` icons and navy body copy.

#### 🌐 Vision & Philosophy Banner
* **Container:** Deep Dark Blue (`#00446D`).
* **Typography:** Pure White headings with Light Blue (`#E6F2F9`) secondary supporting text.
* **Accent:** A delicate, thin green decorative stroke (`#008325`) separating the quote from the attribution.

#### 🏢 Global Institutional Footer
* **Background:** Deep Dark Blue (`#00446D`).
* **Institute Information:** White typography, address, emergency contact, CPIO details.
* **Hyperlinks:** Light Blue (`#E6F2F9`) with white hover states. No green required.

---

## 4. Institutional Architecture & Parity with Legacy Website

The legacy audit conducted by Auditor Subagent 1 and cross-verified by Subagent 2 uncovered all existing pages, statutory compliance documents, and operational pain points. The new portal maintains **100% content and structural parity**, while elevating every static or broken workflow into an accessible, digital experience.

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           IIITL NEW UNIFIED NAVIGATION SYSTEM                             │
├──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬────────────────┤
│  GOVERNANCE  │  ADMISSIONS  │  ACADEMICS   │   RESEARCH   │ STUDENT LIFE │ RECRUITMENT &  │
│  & STATUTORY │              │              │   & LABS     │   & CLUBS    │   TENDERS      │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼────────────────┤
│ • Director   │ • JoSAA/CSAB │ • B.Tech     │ • CDSAI      │ • Hostels &  │ • Faculty Post │
│   Desk       │   (UG)       │   Programs   │   Centre     │   Wardens    │ • Non-Teaching │
│ • BoG &      │ • CCMT (PG)  │ • PG & PhD   │ • WCARL Lab  │ • Mess Menu  │ • Projects/JRF │
│   Senate     │ • M.Sc / MBA │ • Syllabi &  │ • Research   │ • Clubs &    │ • Active       │
│ • RTI & NIRF │   Direct     │   Credits    │   Publications Council      │   Tenders      │
│ • Rajbhasha  │ • Fee Gate   │ • Academic   │ • Patents    │ • Fests:     │ • Corrigenda   │
│ • ICC & SGRC │   Redirects  │   Calendar   │   Portfolio  │   Equinox    │   & GeM        │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴────────────────┘
```

### 4.1 Master Institutional Sitemap & Parity Matrix

| Portal Module | Legacy Website Path | New Next.js Canonical Route | Legacy Problem Fixed in Rebuild |
| :--- | :--- | :--- | :--- |
| **Director's Directorate** | `/index.php/directorate/` | `/about/directorate` | Converted from static text to rich vision page with video address and annual reports. |
| **Founding Director** | `/index.php/founding-director-message/` | `/about/founding-director` | Preserved historic institutional narrative with commemorative visual timeline. |
| **At a Glance** | `/index.php/at-a-glance/` | `/about/at-a-glance` | Dynamic statistics engine fed by database metrics (placements, research, enrollment). |
| **Board of Governors** | `/index.php/board-of-governors/` | `/governance/board-of-governors` | Roster with approved minutes archive linked directly from database. |
| **Senate** | `/index.php/senate/` | `/governance/senate` | Curricula approval records, academic ordinance database, and meeting proceedings. |
| **Finance Committee** | `/index.php/finance-committee/` | `/governance/finance-committee` | Audited financial statements repository and fee revision notifications. |
| **Building Works (BWC)**| `/index.php/building-works-committee/`| `/governance/building-works` | Interactive campus master plan with infrastructure progress milestones. |
| **Rajbhasha Cell (राजभाषा)**| `/index.php/rajbhashaa/` | `/governance/rajbhasha` | Dedicated bilingual Hindi/English publishing portal adhering to GoI mandates. |
| **Statutory Committees** | `/internal-complaints-committee-icc/`<br>`/disciplinary-committee/`<br>`/anti-ragging-committee-squad/`<br>`/sgrc/` | `/governance/icc`<br>`/governance/disciplinary`<br>`/governance/anti-ragging`<br>`/governance/sgrc` | Direct online anonymous grievance submission for students and staff with tracking tickets. |
| **Right to Information (RTI)**| `/rti/`, `/manuals/`, `/information-under-rti/` | `/statutory/rti` | Fully indexed Section 4(1)(b) disclosure manuals, CPIO/FAA contacts, fee calculator, online RTI query submission. |
| **NIRF Disclosures** | **Missing on Legacy Site** | `/statutory/nirf` | **Newly Added:** Dedicated ranking portal with downloadable DCS PDFs for institutional compliance. |
| **Undergraduate Programs**| `/b-tech-in-it/`, `/b-tech-in-cs/`, `/b-tech-csb/`, `/b-tech-in-csai/` | `/academics/undergraduate/[branch]` | Dynamic interactive course catalog displaying semester breakdowns, L-T-P, prerequisites, and syllabi. |
| **Postgraduate Programs**| `/m-tech-in-computer-science/`, `/mbadigital-business/`, `/m-sc-data-science/` | `/academics/postgraduate/[program]` | Detailed eligibility, industry focus, curriculum, CCMT counselling guidelines, and fee schedule. |
| **Doctoral Program** | `/index.php/phd-advertisement-3/` | `/academics/phd` | Interactive admissions tracker, downloadable dissertation guidelines, and supervisor directory. |
| **Course Structure** | Static PDFs (`588e14e1-course_structure...pdf`) | `/academics/course-structure` | Live, searchable, filterable curriculum table with downloadable official PDF export on-the-fly. |
| **Academic Calendar** | `/index.php/academic-calendar/` | `/academics/calendar` | Interactive calendar with Google Calendar / iCal sync for students and faculty. |
| **Official Forms** | `/index.php/official-forms-format/` | `/forms` & `/dashboard/requests` | All 26 legacy PDF forms available for download + **Digitized E-Workflow** for direct digital submission. |
| **Student No Dues** | Static PDF (`Student-No-Dues_2026.pdf`) | `/dashboard/student/no-dues` | **Digitized 7-Stage Workflow**: Academic -> Library -> Labs -> Hostel -> Mess -> Sports -> Accounts. |
| **Hostel & Mess Services**| `/room-allotment/`, static mess PDF | `/campus-life/hostels` & `/dashboard/student/hostel`| Digital room allocation, daily interactive mess menu, warden directory, and complaint management. |
| **Technical Club (Axios)**| External GitHub Pages (`axios-iiitl.github.io`) | Integrated at `/campus-life/clubs/axios` (or subdomain `axios.iiitl.ac.in`) | Seamless institutional branding with GitHub API integration for club projects. |
| **Cultural Council** | Dead Google Cloud IP (`35.194.30.215/cultural-club/`) | `/campus-life/cultural` | Unified profiles for Zephyr, Goonj, Utkrisht, After Dark, Estrella, Crotonia, and Eifer. |
| **Tenders & Corrigenda**| Paginated WordPress list (`/index.php/tenders/`)| `/tenders` | Filterable by Active, Closed, and Corrigenda; GeM link; automatic countdown timer to closing dates. |
| **Faculty Directory** | Static WordPress custom post type | `/people/faculty` & `/people/faculty/[slug]` | Rich faculty profiles integrated with IRINS/Vidwan, publication feeds, open research projects, and contact info. |
| **Media Coverage** | `/index.php/media-coverage/` | `/media` | Press clipping gallery with verified news links, high-res newspaper scans, and official press releases. |

---

## 5. Security & Authentication Architecture

### 5.1 Institutional Google Workspace Single Sign-On
1. **Strict Domain Whitelist:** The OAuth callback handler strictly checks the `hd` (hosted domain) claim returned by Google:
   ```typescript
   // lib/auth.ts
   if (account?.provider === "google") {
     const email = profile?.email;
     if (!email || !email.endsWith("@iiitl.ac.in")) {
       throw new Error("Access Denied: Only @iiitl.ac.in institutional emails are authorized.");
     }
   }
   ```
2. **Auto-Provisioning & Account Sync:**
   * Upon first successful authentication, a user record is generated.
   * If the email prefix follows student format (e.g., `bcs2023001@iiitl.ac.in`, `mit2024012@iiitl.ac.in`), the system auto-assigns the `STUDENT` role and parses batch, program, and roll number.
   * If the email belongs to faculty or staff, it is mapped against the pre-approved institutional roster or flagged for Admin role allocation.
3. **Session Hardening:**
   * JWT session tokens encrypted with AES-GCM 256-bit keys (`NEXTAUTH_SECRET`).
   * Stored in `__Host-` prefixed, `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
   * Session invalidation upon role change or administrative suspension.

---

## 6. Dynamic Role-Based Access Control (RBAC) Engine

The portal implements an enterprise-grade, dynamic RBAC architecture. Roles and permissions are stored in PostgreSQL, and any role can be created, edited, or delegated by the Super Admin without code redeployment.

### 6.1 Core RBAC Entity Model (Prisma Schema)

```prisma
// prisma/schema.prisma

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  image         String?
  rollNumber    String?        @unique
  department    String?
  designation   String?
  isActive      Boolean        @default(true)
  userRoles     UserRole[]
  auditLogs     AuditLog[]
  gradesEntered GradeRecord[]  @relation("FacultyGrades")
  feeLedgers    FeeRecord[]
  noDuesRequest NoDuesRequest?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Role {
  id          String           @id @default(cuid())
  name        String           @unique // e.g. "SUPER_ADMIN", "EXAM_CELL", "PROFESSOR", "ACCOUNTS"
  description String?
  isSystem    Boolean          @default(false) // System roles cannot be deleted
  userRoles   UserRole[]
  rolePerms   RolePermission[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model Permission {
  id          String           @id @default(cuid())
  code        String           @unique // e.g. "tenders:create", "grades:moderate", "curriculum:manage"
  category    String           // e.g. "CMS", "EXAMS", "FINANCE", "USER_MANAGEMENT"
  description String
  rolePerms   RolePermission[]
}

model UserRole {
  userId    String
  roleId    String
  assignedBy String?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())

  @@id([userId, roleId])
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
}

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String   // e.g. "ROLE_ASSIGNED", "TENDER_UPLOADED", "GRADES_MODERATED"
  target     String   // e.g. "User:clx123...", "Tender:tnd_456"
  details    Json?
  ipAddress  String?
  userAgent  String?
  timestamp  DateTime @default(now())
  user       User?    @relation(fields: [userId], references: [id])
}
```

---

### 6.2 Default Role & Permission Distribution Matrix

| Permission Code | Super Admin | Institute Admin | Professor / Faculty | Exam Cell | Accounts & Finance | Registrar / Tender In-Charge | Student |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `users:manage` (Create, edit, suspend users) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `rbac:assign` (Create roles, assign permissions) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `cms:homepage` (Edit hero text, stats, collages) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `tenders:manage` (Upload PDFs, dates, corrigenda)| ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `brochure:manage` (Update admission prospectus) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `academics:programs` (Create B.Tech, M.Tech, etc.)| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `academics:subjects` (Define syllabus, credits) | ✅ | ✅ | ✅ (Assigned) | ❌ | ❌ | ❌ | ❌ |
| `grades:download_template` (Download cohort XLS) | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `grades:upload` (Upload completed marks XLS) | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `grades:moderate_compile` (Moderate, approve GPA)| ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `grades:publish` (Push to dashboard & mass mail) | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `fees:manage` (Update fees, import bank records) | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `fees:lookup` (Search student balance, mess status)| ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `nodues:clear` (Approve departmental clearance) | ✅ | ❌ | ✅ (Lab/Dept)| ❌ | ✅ (Fee NOC) | ❌ | ❌ |
| `results:view` (View own transcript & grade card)| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Own) |

---

## 7. Dynamic CMS & Content Management

The administrative dashboard allows authorized personnel to update any public content element on the fly:

1. **Homepage Hero & Texts:**
   * Headline text (`LEARN · INNOVATE · BUILD · IMPACT`).
   * Sub-headline (`Shaping a Smarter Tomorrow`).
   * Institutional Statistics (Placement percentages, recruiter counts, research funding).
2. **Campus Photo Collage & Media Gallery:**
   * Dynamic image uploader directly to AWS S3 / GCP Storage with automated thumbnail generation (`sharp`).
   * Drag-and-drop collage layout ordering with alt-text accessibility tagging.
3. **Tender & Procurement Management:**
   * Title, Reference NIT Number, Bid Opening Date, Technical Bid Date, Closing Date, GeM Portal Link.
   * Multi-file PDF upload (Main tender notice, BOQ specifications, Corrigenda 1/2/3).
   * Automatic status toggle: `ACTIVE`, `EXTENDED`, `UNDER_EVALUATION`, `AWARDED`, `ARCHIVED`.
4. **Information Brochures & Prospectuses:**
   * One-click PDF replacement for B.Tech Brochure, M.Tech Guide, Placement Brochure, and Annual Reports.
   * Auto-generated permanent redirect URLs preventing broken links in external JoSAA/CSAB portals.

---

## 8. Academic Curriculum Architecture & Credit System

The institute offers programs across Undergraduate, Postgraduate, and Doctoral levels. The curriculum database models credit distributions, prerequisites, and semester mappings.

```
┌────────────────────────────────────────────────────────┐
│                   ACADEMIC PROGRAM                     │
│  e.g. B.Tech Computer Science & AI (CSAI) - 4 Years    │
└───────────────────────────┬────────────────────────────┘
                            │ Contains 8 Semesters
                            ▼
┌────────────────────────────────────────────────────────┐
│                   SEMESTER SCHEDULE                    │
│  Semester III • Minimum Credits Required: 21           │
└───────────────────────────┬────────────────────────────┘
                            │ Maps to multiple subjects
                            ▼
┌────────────────────────────────────────────────────────┐
│                     COURSE / SUBJECT                   │
│  Course Code: CS301                                    │
│  Course Title: Design & Analysis of Algorithms         │
│  Credit System: L-T-P (3-1-2) = 5 Total Credits        │
│                                                        │
│  Assessment Weightage Distribution:                    │
│  • Mid-Semester Examination: 25%                       │
│  • End-Semester Examination: 40%                       │
│  • Continuous Assessment / Quizzes: 15%                │
│  • Laboratory Practical & Viva: 20%                    │
└────────────────────────────────────────────────────────┘
```

### 8.1 Database Schema for Academics

```prisma
model AcademicProgram {
  id          String      @id @default(cuid())
  code        String      @unique // e.g. "BTECH_CS", "BTECH_IT", "BTECH_CSAI", "BTECH_CSB", "MTECH_CS", "MBA_DB"
  name        String      // e.g. "Bachelor of Technology in Computer Science and Artificial Intelligence"
  degreeType  DegreeType  // UG, PG, DOCTORAL
  durationYrs Int         // 4 for B.Tech, 2 for M.Tech/MBA
  semesters   Semester[]
  batches     Batch[]
  createdAt   DateTime    @default(now())
}

enum DegreeType {
  UG
  PG
  DOCTORAL
}

model Semester {
  id           String           @id @default(cuid())
  programId    String
  semesterNum  Int              // 1 to 8
  minCredits   Int
  program      AcademicProgram  @relation(fields: [programId], references: [id], onDelete: Cascade)
  subjects     CourseOffering[]
}

model Subject {
  id           String           @id @default(cuid())
  code         String           @unique // e.g. "CS101", "IT202", "MA301"
  name         String           // e.g. "Data Structures and Algorithms"
  description  String?          @db.Text
  totalCredits Int              // e.g. 4
  lectureHrs   Int              // L (e.g. 3)
  tutorialHrs  Int              // T (e.g. 1)
  practicalHrs Int              // P (e.g. 2)
  syllabusUrl  String?          // PDF link on S3
  offerings    CourseOffering[]
}

model CourseOffering {
  id          String          @id @default(cuid())
  semesterId  String
  subjectId   String
  isElective  Boolean         @default(false)
  semester    Semester        @relation(fields: [semesterId], references: [id], onDelete: Cascade)
  subject     Subject         @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  batchCourses BatchCourse[]
}
```

---

## 9. Examination Cell & Automated Grading Engine

One of the core innovations in this rebuild is replacing ad-hoc manual spreadsheets and paper grading with an **automated, secure, Excel-driven grading pipeline**.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        EXAMINATION GRADING PIPELINE                             │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │
  1. Professor selects Cohort          ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Faculty Dashboard: Select Program (B.Tech CSAI), Batch (2023), Course (CS301)│
  └────────────────────────────────────┬────────────────────────────────────────┘
                                       │
  2. Dynamic Template Generated        ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ System builds .xlsx file via ExcelJS:                                       │
  │ • Metadata locked & cryptographically hashed                                │
  │ • Student Roll Numbers & Names pre-populated                                │
  │ • Component columns generated (Midsem / Endsem / Quiz / Lab)                │
  │ • Data validation rules baked in (marks cannot exceed Maximum Marks)        │
  └────────────────────────────────────┬────────────────────────────────────────┘
                                       │
  3. Offline Grading & Upload          ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Professor fills marks offline and uploads completed file back to Portal      │
  └────────────────────────────────────┬────────────────────────────────────────┘
                                       │
  4. Server Validation & Processing    ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Server Action parses file:                                                  │
  │ • Validates cryptographic checksum to ensure roll numbers weren't altered    │
  │ • Converts marks into Absolute & Relative Grade Points (O, A+, A, B, etc.)   │
  │ • Computes semester SGPA and cumulative CGPA                                │
  │ • Routes submission into Exam Cell Moderation Queue                         │
  └────────────────────────────────────┬────────────────────────────────────────┘
                                       │
  5. Exam Cell Review & Approval       ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Exam Cell verifies grading curve, moderates if necessary, and clicks APPROVE│
  └────────────────────────────────────┬────────────────────────────────────────┘
                                       │
  6. Multi-Channel Dispatch            ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ • Instant Student Portal Publishing (visible on Student Dashboard)          │
  │ • Background Queue Worker triggers Puppeteer to generate high-res PDF       │
  │ • Email API (Resend / SES) sends official Grade Card to student's inbox     │
  └─────────────────────────────────────────────────────────────────────────────┘
```

### 9.1 The Pre-Filled Excel Template Structure

When the professor selects a course offering, the backend runs `generateGradingSheet(courseOfferingId)`:
* **Sheet 1: Marks Entry (Locked Headers & Metadata)**
  * Column A: `Student Roll Number` (Read-only)
  * Column B: `Student Name` (Read-only)
  * Column C: `Attendance (%)`
  * Column D: `Continuous Assessment / Quizzes [Max: 20]`
  * Column E: `Mid-Semester Exam [Max: 30]`
  * Column F: `End-Semester Exam [Max: 50]`
  * Column G: `Lab Practical / Project [Max: 25]` (if applicable)
  * Column H: `Total Marks [Auto-Formula: =SUM(D2:G2)]`
* **Protection:** Cells outside the designated mark inputs are password-protected to prevent accidental tampering with student roll numbers or formula headers.

### 9.2 Institutional Grading Scale & GPA Calculation

$$\text{SGPA} = \frac{\sum_{i=1}^{n} (C_i \times GP_i)}{\sum_{i=1}^{n} C_i}$$

$$\text{CGPA} = \frac{\sum_{j=1}^{m} \sum_{i=1}^{n} (C_{j,i} \times GP_{j,i})}{\sum_{j=1}^{m} \sum_{i=1}^{n} C_{j,i}}$$

Where:
* $C_i$: Course Credits
* $GP_i$: Grade Points assigned based on institutional grading thresholds (e.g., 10 for Outstanding, 9 for Excellent, etc.).

---

## 10. Accounts & Finance Portal

The Accounts Section receives a dedicated, role-protected interface to track, verify, and reconcile financial obligations:

### 10.1 Key Financial Tracking Features
1. **Student Ledger Lookup:** Instant search by Roll Number or Name displaying:
   * Tuition Fee status (Paid, Pending, Partial).
   * Institute Amenity Fees.
   * Examination Fees.
   * Hostel Room Rent & Security Deposit.
   * Mess Advance & Monthly Mess Bill adjustments.
2. **Bulk Reconciliation via Excel:**
   * Accounts staff can download a batch fee template, enter transaction IDs / UTR numbers from SBI Collect or Eduqfix bank scrolls, and re-upload to update hundreds of student accounts simultaneously.
3. **Automated Digital "No Dues" Clearance Workflow:**
   * Students initiate clearance for graduation, withdrawal, or caution money refund.
   * Digital approval stages:
     1. Academic Section (Credits verified)
     2. Central Library (No unreturned books)
     3. Computer Labs (Lab assets cleared)
     4. Hostel Warden (Room inspected & vacated)
     5. Mess Contractor (Mess dues zeroed)
     6. Sports Officer (Equipment surrendered)
     7. Accounts Section (Caution money net payable calculated, bank NEFT details validated)
   * System generates official tamper-proof PDF **Digital Clearance Certificate** with cryptographic QR verification.

---

## 11. (Removed) AI Integration via OpenRouter

**This section was removed by decision on 2026-09-30.** The planned OpenRouter/LLM features — institutional semantic search, administrative drafting assistant, and the student academic advisor — are no longer part of this project, and the "Ask IIITL" chatbot has been deleted from the frontend, this specification, and the handoff docs in `agents/Docs/ToChangeFinally/`.

Search is implemented as conventional index-backed full-text search. If the institute ever wants AI-assisted answering, it must be proposed and approved separately, built server-only, and must never present a generated answer as an official institutional decision.

## 12. Deployment Architecture on Google Cloud Build (GCB)

The system is configured for automated build and zero-downtime deployment to Google Cloud Platform:

```yaml
# cloudbuild.yaml
steps:
  # Step 1: Install Dependencies & Run Automated Tests
  - name: 'node:20-alpine'
    entrypoint: 'npm'
    args: ['ci']

  - name: 'node:20-alpine'
    entrypoint: 'npm'
    args: ['run', 'test']

  # Step 2: Build Multi-Stage Docker Container
  - name: 'gcr.io/cloud-builders/docker'
    args: [
      'build',
      '-t', 'gcr.io/$PROJECT_ID/iiitl-portal:$SHORT_SHA',
      '-t', 'gcr.io/$PROJECT_ID/iiitl-portal:latest',
      '.'
    ]

  # Step 3: Push to Google Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/iiitl-portal:$SHORT_SHA']

  # Step 4: Run Database Migrations (Cloud SQL Proxy)
  - name: 'gcr.io/$PROJECT_ID/iiitl-portal:$SHORT_SHA'
    entrypoint: 'npx'
    args: ['prisma', 'migrate', 'deploy']
    env:
      - 'DATABASE_URL=${_DATABASE_URL}'

  # Step 5: Deploy to Google Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args: [
      'run', 'deploy', 'iiitl-portal',
      '--image', 'gcr.io/$PROJECT_ID/iiitl-portal:$SHORT_SHA',
      '--region', 'asia-south1',
      '--platform', 'managed',
      '--allow-unauthenticated',
      '--min-instances', '2',
      '--max-instances', '20',
      '--memory', '2Gi',
      '--cpu', '2'
    ]

substitutions:
  _DATABASE_URL: 'secrets/DATABASE_URL'

images:
  - 'gcr.io/$PROJECT_ID/iiitl-portal:$SHORT_SHA'
  - 'gcr.io/$PROJECT_ID/iiitl-portal:latest'
```

---

## 13. Comprehensive Comparison: New vs. Old Capabilities Matrix

| Architectural Dimension | Existing Website (`https://iiitl.ac.in`) | Rebuilt Next.js + Cloud Native Platform |
| :--- | :--- | :--- |
| **Core Framework** | Legacy PHP / Monolithic WordPress | **Next.js 15 (App Router, Server Actions, TypeScript)** |
| **Hosting & Infrastructure**| Unmanaged VM on Compute Engine (`35.194.30.215`) | **Containerized Google Cloud Run + Google Cloud Build CI/CD** |
| **Public IP Leakage** | Critical: Internal Cloud IP directly exposed in navigation | **Zero Exposure: Protected behind Cloudflare Enterprise WAF** |
| **Brand Identity & Color** | Inconsistent colors with unwanted orange elements | **Refined Institutional Blue Palette (`#005F99`, `#00446D`, `#E6F2F9`) with 3% Green Accent** |
| **Authentication** | Basic WordPress login or nonexistent SSO | **Domain-Locked Google OAuth strictly for `@iiitl.ac.in`** |
| **Access Control (RBAC)** | Primitive WordPress admin/subscriber roles | **Dynamic Enterprise RBAC with granular code-level permissions** |
| **Academic Programs** | Hardcoded static WordPress posts | **Dynamic Database Catalog (Programs, Semesters, Credit System)** |
| **Course Structures** | Static unindexed PDF uploads | **Interactive, filterable course browser + On-the-fly PDF export** |
| **Grading Workflow** | Manual, paper/ad-hoc spreadsheet based | **Automated Excel Template Generation, Parsing, and GPA Engine** |
| **Result Delivery** | Physical notice boards or uncoordinated emails | **Direct Student Dashboard + Mass Email API with PDF Grade Cards** |
| **Accounts & Fee Tracking** | External third-party payment links with zero sync | **Integrated Student Ledger, bulk import/export, payment verification** |
| **No Dues Clearance** | 7-stage physical paper signature form | **Fully digitized online clearance with multi-department signoffs** |
| **Tenders & Corrigenda** | Static blog archive without status filters | **Dedicated Procurement Portal with GeM link & closing countdowns** |
| **Subdomain Health** | Broken links (`cro.iiitl.ac.in`, `wcarl.iiitl.ac.in`) | **Properly configured DNS / Next.js multi-tenant routing** |
| **Third-Party Sub-sites** | Fragmented Netlify/Vercel sites (CREATE, E-Cell, Axios) | **Unified brand umbrella with subdomain canonical routing** |
| **Statutory Disclosures** | Missing NIRF; buried RTI manuals | **Full MoE compliance: dedicated NIRF portal & RTI Section 4 hub** |
| **Search Capability** | Basic WordPress text match | **Server-side full-text search over published institutional content, with faceted filters and cited snippets** |
| **Accessibility (a11y)** | Basic client-side JavaScript toolbar | **WCAG 2.1 AA Compliant: High contrast, screen reader ready, semantic ARIA** |

---

## 14. Implementation Roadmap & Milestones

1. **Sprint 1: Core Foundation & Design Tokens**
   * Next.js 15 scaffold with Tailwind CSS v4 design token configuration.
   * Cloudflare and Google Cloud Build deployment pipeline setup.
   * Google OAuth2 domain lock implementation (`@iiitl.ac.in`).
2. **Sprint 2: Dynamic RBAC & Database Schema**
   * PostgreSQL on Cloud SQL with Prisma ORM migrations.
   * Role management and permission assignment interface.
   * Audit logging engine.
3. **Sprint 3: Public Portal & Legacy Content Parity**
   * Complete migration of all institutional sections (Governance, Academics, Research, Student Life, People, Careers, Tenders).
   * High-contrast accessibility features and bilingual Hindi/English headers.
4. **Sprint 4: Academic Program & Subject Credit System**
   * Program, semester, and course catalog data entry.
   * Interactive curriculum browser with PDF syllabus downloads.
5. **Sprint 5: Examination Grading & Result Automation**
   * ExcelJS pre-filled template generator and server-side parser.
   * GPA calculation algorithm and Exam Cell moderation workflow.
   * Background queue worker for Puppeteer PDF grade card rendering and email dispatch.
6. **Sprint 6: Accounts Section & Digital No Dues Clearance**
   * Student ledger, fee status tracking, and payment reconciliation.
   * 7-stage digital clearance workflow and caution money refund module.
7. **Sprint 7: Search, Indexing & Final Security Audit**
   * Full-text index of published institutional content feeding the global search and directory search.
   * Penetration testing, load testing, and DNS switchover from legacy WordPress to Cloudflare.
