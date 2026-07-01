<div align="center">
  <img src="Source/assets/Academia%20Logo.png" alt="Academia Logo" width="350" />

# 🎓 Academia - College Management Ecosystem

_A modern full-stack college management ecosystem integrating a web dashboard, backend API, mobile application, and AI-powered academic services._

  <br>

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/MuhammedMahmoud0/Academia-College-Management-Ecosystem?style=for-the-badge&color=gold)](https://github.com/MuhammedMahmoud0/Academia-College-Management-Ecosystem/stargazers)
[![GitHub Contributors](https://img.shields.io/github/contributors/MuhammedMahmoud0/Academia-College-Management-Ecosystem?style=for-the-badge&color=brightgreen)](https://github.com/MuhammedMahmoud0/Academia-College-Management-Ecosystem/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/MuhammedMahmoud0/Academia-College-Management-Ecosystem?style=for-the-badge&color=purple)](https://github.com/MuhammedMahmoud0/Academia-College-Management-Ecosystem/commits/main)

  <br>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

<br>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=435&height=25&lines=TABLE+OF+CONTENTS" width="450"/>

---

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [Mobile Application](#mobile-application)
- [AI & Machine Learning](#ai-machine-learning)
    - [Course Recommendation System](#course-recommendation-system)
    - [Lecture Summarization System](#lecture-summarization-system)
- [Deployment](#deployment)
- [Team](#team)
- [Demo Videos](#demo-videos)
- [License](#license)

<br>

<a id="overview"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=435&height=25&lines=OVERVIEW" width="450"/>

---

The **Academia College Management Ecosystem** is a full-stack university management platform designed to simplify academic and administrative workflows. It consists of four integrated components—a web application, backend API, mobile application, and AI services—that work together to provide a unified experience for students, instructors, and administrators.

The backend serves as the central hub of the ecosystem, exposing REST APIs and real-time communication through Socket.IO. The React web dashboard and Flutter mobile application consume these services, while dedicated AI microservices provide intelligent course recommendations and lecture summarization. Data is stored in PostgreSQL with Supabase Storage for file management, and Redis powers caching and background job processing.

<br>

<a id="features"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=435&height=25&lines=FEATURES" width="450"/>

---

- 🔐 Authentication & Role-Based Access Control
- 👨‍🎓 Student & Staff Management
- 📚 Course Registration & Enrollment
- 📅 Attendance Tracking
- 📝 Exams & Grades
- 💳 Financial Management
- 👥 Community Platform
- 📁 Course Materials
- 📱 Mobile Application
- 🤖 AI Course Recommendation
- 📝 AI Lecture Summarization
- ⚡ Real-Time Notifications

<br>

<a id="system-architecture"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=600&height=25&lines=SYSTEM+ARCHITECTURE" width="550"/>

---

The following diagram illustrates the complete architectural topology of the Academia ecosystem, detailing data pathways between clients, API gateways, databases, background job queues, and specialized AI microservices:

```mermaid
graph TD
    subgraph Clients["📱 Client Layer"]
        FE["💻 Frontend Web Dashboard<br/>(React 19 + Vite + Tailwind v4)"]
        MB["📱 Mobile Application<br/>(Flutter + Dart + BLoC)"]
    end

    subgraph APIGateway["⚙️ Core Backend Services"]
        BE["🚀 API Gateway & Core Server<br/>(Node.js + Express 5 + Socket.IO)"]
        AUTH["🔒 Auth & RBAC Engine<br/>(JWT + bcrypt + Cookie Manager)"]
        JOBS["⏱️ Background Workers<br/>(BullMQ + Cron Jobs)"]
    end

    subgraph DataLayer["💾 Persistence & Cache Layer"]
        PG[("🐘 PostgreSQL Database<br/>(Prisma 7 ORM)")]
        REDIS_CACHE[("⚡ Redis Cache<br/>(Cache-Aside TTL)")]
        REDIS_QUEUE[("📫 Redis Message Queue<br/>(BullMQ Async Jobs)")]
    end

    subgraph AIServices["🧠 AI & ML Microservices"]
        REC["🎯 Course Recommendation API<br/>(Flask + PyTorch + SentenceTransformers + Gemini)"]
        SUM["📑 Lecture Summarization API<br/>(FastAPI + Transformers + Ollama + OCR)"]
    end

    subgraph External["☁️ External Cloud Gateways"]
        SUPA["📦 Supabase Storage<br/>(Lecture PDFs & Media)"]
        FCM["🔔 Firebase Cloud Messaging<br/>(Mobile Push Notifications)"]
        PAY["💳 Paymob / PayPal<br/>(Online Fee Processing)"]
    end

    %% Client Connections
    FE <-->|HTTPS REST / Socket.IO| BE
    MB <-->|HTTPS REST / Socket.IO| BE

    %% Internal Backend Routing
    BE --- AUTH
    BE --- JOBS

    %% Data Connections
    BE <-->|Prisma Queries| PG
    BE <-->|Read / Write Cache| REDIS_CACHE
    JOBS <-->|Queue Jobs| REDIS_QUEUE
    JOBS -->|Batch Write| PG

    %% AI Microservice Calls
    BE -->|POST /recommend| REC
    BE -->|POST /summarize/upload| SUM

    %% External Gateways
    BE <-->|Upload / Retrieve| SUPA
    BE -->|Dispatch Notifications| FCM
    BE <-->|Verify Webhooks| PAY
    FCM -->|Push Alerts| MB
```

<br>

<a id="technology-stack"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=600&height=25&lines=TECHNOLOGY+STACK" width="550"/>

---

### 🚀 Backend

| Category        | Technologies             |
| --------------- | ------------------------ |
| Runtime         | Node.js, Express.js      |
| Database        | PostgreSQL, Prisma ORM   |
| Authentication  | JWT, bcrypt              |
| Real-Time       | Socket.IO                |
| Background Jobs | BullMQ, Redis            |
| File Storage    | Supabase Storage, Multer |
| Documentation   | Swagger / OpenAPI        |

### 💻 Frontend

| Category           | Technologies              |
| ------------------ | ------------------------- |
| Framework          | React, Vite               |
| Styling            | Tailwind CSS, Material UI |
| State & Routing    | React Router              |
| Networking         | Axios, Socket.IO Client   |
| Data Visualization | Chart.js, Recharts        |
| Animation          | GSAP, Lenis               |

### 📱 Mobile

| Category         | Technologies                 |
| ---------------- | ---------------------------- |
| Framework        | Flutter, Dart                |
| State Management | Flutter BLoC                 |
| Navigation       | Go Router                    |
| Networking       | Dio                          |
| Local Storage    | Hive, Flutter Secure Storage |
| Authentication   | Local Auth                   |
| Notifications    | Firebase Cloud Messaging     |
| QR Scanner       | Mobile Scanner               |

### 🧠 AI & Machine Learning

| Category  | Technologies             |
| --------- | ------------------------ |
| Framework | PyTorch                  |
| NLP       | Sentence Transformers    |
| LLMs      | Gemini 2.5 Flash, Ollama |
| APIs      | Flask, FastAPI           |
| OCR       | PyTesseract, pdfplumber  |

### ☁️ Infrastructure

| Category       | Technologies          |
| -------------- | --------------------- |
| Database       | PostgreSQL (Supabase) |
| Object Storage | Supabase Storage      |
| Cache & Queue  | Redis, BullMQ         |
| Deployment     | Render, Netlify       |
| Documentation  | Swagger / OpenAPI     |

<br>

<a id="repository-structure"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=600&height=25&lines=REPOSITORY+STRUCTURE" width="550"/>

---

The ecosystem is organized into modular subrepositories and directories within this central documentation hub:

```text
Academia-College-Management-Ecosystem/
│
├── backend/
├── frontend/
├── mobile/
├── ai/
│   ├── recommendation/
│   └── summarization/
├── Source/
└── README.md
```

<br>

<a id="frontend"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=435&height=25&lines=FRONTEND" width="450"/>

---

### 🌟 Overview

The Academia Web Dashboard is a React-based application that provides dedicated interfaces for students, instructors, teaching assistants, and administrators. It integrates with the backend through REST APIs and Socket.IO to deliver real-time academic workflows, analytics, course management, and community features.

### ✨ Features

- 🔐 Authentication & Role-Based Access
- 📚 Course Registration & Enrollment
- 📊 Academic Analytics & Dashboards
- 👥 Community & Discussion Platform
- 💳 Online Fee & Invoice Management
- 📅 Academic Calendar & Scheduling
- 📢 Announcements & Notifications
- 📁 Course Materials & Resources

### 🛠️ Technologies

| Category           | Technologies              |
| ------------------ | ------------------------- |
| Framework          | React, Vite               |
| Styling            | Tailwind CSS, Material UI |
| State & Routing    | React Router              |
| Networking         | Axios, Socket.IO Client   |
| Data Visualization | Chart.js, Recharts        |
| Animation          | GSAP, Lenis               |

### ⚙️ Setup & Local Development

```bash
# 1. Navigate to the frontend directory
cd frontend/college-system

# 2. Install dependencies
npm install

# 3. Create environment configuration (.env)
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# 4. Launch the development server
npm run dev
```

### 🔗 Repository Link

- **Standalone Frontend Repository**: [Frontend Repository](https://github.com/VALKAN00/college-system-frontend)
  <br>

<a id="backend"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=435&height=25&lines=BACKEND" width="450"/>

---

### 🌟 Overview

The Academia Backend is the central service of the ecosystem. Built with Node.js, Express, and Prisma, it exposes REST APIs and real-time communication for the web dashboard, mobile application, and AI services while managing authentication, academic workflows, file storage, and background processing.

### ✨ Features

- 🔐 Authentication & Role-Based Access Control (RBAC)
- 📚 Course & Enrollment Management
- 📅 Attendance & Lecture Scheduling
- 📝 Grade & Examination Management
- 💳 Online Payment Integration
- 📢 Notifications & Community Features
- 📁 File Upload & Storage
- ⚡ Real-Time Communication with Socket.IO
- 🔄 Background Job Processing with BullMQ
- 🤖 AI Service Integration

### 🛠️ Technologies

| Category        | Technologies             |
| --------------- | ------------------------ |
| Runtime         | Node.js, Express.js      |
| Database        | PostgreSQL, Prisma ORM   |
| Authentication  | JWT, bcrypt              |
| Real-Time       | Socket.IO                |
| Background Jobs | BullMQ, Redis            |
| File Storage    | Supabase Storage, Multer |
| Documentation   | Swagger / OpenAPI        |

### 🏛️ Architecture & Database Diagram

```mermaid
graph LR
A[Client] --> B[Routes]
B --> C[Middleware]
C --> D[Controllers]
D --> E[Services]
E --> F[Prisma ORM]
F --> G[(PostgreSQL)]
```

### 🏗️ Architecture Highlights

- Layered Architecture
- RESTful API Design
- JWT Authentication & Refresh Token Rotation
- Role-Based Access Control (RBAC)
- Real-Time Communication with Socket.IO
- Background Jobs with BullMQ & Redis
- PostgreSQL + Prisma ORM
- Supabase Storage Integration

### 📖 API Documentation

Interactive API documentation is available through Swagger once the backend is running.

```text
http://localhost:3000/docs
```

### ⚙️ Setup & Local Development

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy the example environment file and configure variables
cp .env.example .env

# 4. Run database migrations and generate Prisma Client
npx prisma migrate dev
npx prisma generate

# 5. Start the development server with file watch
npm run dev
```

### 🔗 Repository Link

- **Standalone Backend Repository**: [Backend Repository](https://github.com/MuhammedMahmoud0/college-system-backend)

<br>

<a id="mobile-application"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=600&height=25&lines=MOBILE+APPLICATION" width="550"/>

---

### 🌟 Overview

The Academia Mobile Application is a Flutter-based companion app that enables students to access academic services from anywhere. It integrates with the backend through secure REST APIs and provides features such as attendance tracking, notifications, course materials, digital student ID, and account management.

### ✨ Features

- 🔐 Biometric Authentication
- 📱 Digital Student ID
- 📷 QR Code Attendance
- 📚 Course Materials & PDF Viewer
- 🔔 Push Notifications
- 📍 Location-Based Attendance Verification
- 🔄 Automatic Token Refresh
- 🌍 Arabic & English Localization

### 🛠️ Technologies

| Category | Technologies |<p align="center">
<a href="https://drive.google.com/file/d/1pIwiySO63U0JgaznirzbiVU-8o1hqvhq/view?usp=drivesdk">
<img src="./assets/web-demo-thumbnail.png" alt="Web Dashboard Demo" width="800"/>
</a>

</p>

<p align="center">
  <a href="https://drive.google.com/file/d/1pIwiySO63U0JgaznirzbiVU-8o1hqvhq/view?usp=drivesdk">
    ▶️ Watch the Full Web Demo
  </a>
</p>
| ---------------- | ---------------------------- |
| Framework        | Flutter, Dart                |
| State Management | Flutter BLoC                 |
| Navigation       | Go Router                    |
| Networking       | Dio                          |
| Local Storage    | Hive, Flutter Secure Storage |
| Authentication   | Local Auth                   |
| Notifications    | Firebase Cloud Messaging     |
| Device Features  | Mobile Scanner, Geolocator   |

### ⚙️ Setup & Local Development

```bash
# 1. Navigate to the mobile directory
cd mobile

# 2. Fetch Flutter packages
flutter pub get

# 3. Generate Hive adapters and localization files (if needed)
dart run build_runner build --delete-conflicting-outputs

# 4. Run on connected emulator or physical device
flutter run
```

### 📱 Supported Platforms

- ✅ Android
- ⚠️ iOS (Codebase Supported)

### 🔗 Repository Link

- **Standalone Mobile Repository**: [Mobile Repository](https://github.com/KaboOA/graduation_project)

<br>

<a id="ai-machine-learning"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=650&height=25&lines=AI+%26+MACHINE+LEARNING" width="600"/>

The Academia ecosystem integrates two AI-powered services that enhance the learning experience by providing personalized course recommendations and automatic lecture summarization. Both services are consumed by the backend through REST APIs and are available to the web and mobile applications.

---

<a id="course-recommendation-system"></a>

### 🎯 Course Recommendation System

#### 📖 Overview

Recommends relevant academic and online courses based on a student's interests and learning goals using semantic search and large language models.

#### 🔄 Workflow

```mermaid
flowchart LR

A[Student Request]
--> B[Bi-Encoder]

B --> C[Cross-Encoder]

C --> D[Gemini 2.5 Flash]

D --> E[Course Recommendations]
```

#### 🛠️ Technologies

- Python
- Flask
- PyTorch
- Sentence Transformers
- Gemini 2.5 Flash

---

<a id="lecture-summarization-system"></a>

### 📑 Lecture Summarization System

#### 📖 Overview

Summarizes lecture notes and academic documents into concise study material using OCR and transformer-based language models.

#### 🔄 Workflow

```mermaid
flowchart LR

A[PDF]

--> B[Text Extraction]

--> C[OCR]

--> D[LLM]

--> E[Summary]
```

#### 🛠️ Technologies

- Python
- FastAPI
- Transformers
- Ollama
- PyTesseract
- pdfplumber

<br>

<a id="deployment"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=435&height=25&lines=DEPLOYMENT" width="450"/>

---

Deploying the complete Academia ecosystem in production involves deploying each decoupled layer to specialized cloud infrastructure:

| Component                  | Deployment Platform           | Deployment Details                                                                                                    |
| -------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Core Backend API**       | Render                        | Deployed on Render. Uses **Supabase PostgreSQL** as the primary database and **Supabase Storage** for file storage.   |
| **Frontend Web Dashboard** | Netlify                       | Deployed on Netlify with environment variables configured for the production backend API.                             |
| **Mobile Application**     | MediaFire (APK Distribution)  | Distributed as a release APK via MediaFire for demonstration and testing. Not yet published on the Google Play Store. |
| **AI Microservices**       | Local Development Environment | Recommendation and Summarization services are executed locally during development                                     |

<br>

<a id="team"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=435&height=25&lines=TEAM" width="450"/>

---

The Academia ecosystem was developed collaboratively by students specializing in backend, frontend, mobile, and artificial intelligence.

<div align="center">

<img src="Source/assets/backend-team-banner-purple.svg" alt="Backend Team" width="450"/>

  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/MuhammedMahmoud0">
          <img src="https://avatars.githubusercontent.com/u/179109266?v=4" width="110" style="border-radius:50%;" alt="Muhammed Mahmoud"/><br />
          <sub><b>Muhammed Mahmoud</b></sub>
        </a><br />
        <small><code>@MuhammedMahmoud0</code></small><br />
        <small>muhammedmahmoud091@gmail.com</small><br />
      </td>
      <td align="center">
        <a href="https://github.com/Abdallah1Atef">
          <img src="https://avatars.githubusercontent.com/u/167599516?v=4" width="110" style="border-radius:50%;" alt="Abdallah Atef"/><br />
          <sub><b>Abdallah Atef</b></sub>
        </a><br />
        <small><code>@Abdallah1Atef</code></small><br />
        <small>atef123khmes@gmail.com</small><br />
      </td>
      <td align="center">
        <a href="https://github.com/ZizoElkhateeb">
          <img src="https://avatars.githubusercontent.com/u/130157238?v=4" width="110" style="border-radius:50%;" alt="Ziad Mohamed"/><br />
          <sub><b>Ziad Mohamed</b></sub>
        </a><br />
        <small><code>@ZizoElkhateeb</code></small><br />
        <small>CDS.ZiadMohamed23135@alexu.edu.eg</small><br />
      </td>
    </tr>
  </table>
</div>

---

<div align="center">

<img src="Source/assets/frontend-team-banner-purple.svg" alt="Frontend Team" width="450"/>

  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/VALKAN00">
          <img src="https://avatars.githubusercontent.com/u/147733659?v=4" width="110" style="border-radius:50%;" alt="Abdelrhman Ahmed"/><br />
          <sub><b>Abdelrhman Ahmed</b></sub>
        </a><br />
        <small><code>@VALKAN00</code></small><br />
        <small>lito2182002@gmail.com</small><br />
      </td>
      <td align="center">
        <a href="https://github.com/nahedrefaei">
          <img src="https://avatars.githubusercontent.com/u/125561929?v=4" width="110" style="border-radius:50%;" alt="Nahed Refaay"/><br />
          <sub><b>Nahed Refaay</b></sub>
        </a><br />
        <small><code>@nahedrefaei</code></small><br />
      </td>
    </tr>
  </table>
</div>

---

<div align="center">

<img src="Source/assets/mobile-team-banner-purple.svg" alt="Mobile Team" width="450"/>

  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/KaboOA">
          <img src="https://avatars.githubusercontent.com/u/71717647?v=4" width="110" style="border-radius:50%;" alt="Ahmed Kabary"/><br />
          <sub><b>Ahmed Kabary</b></sub>
        </a><br />
        <small><code>@KaboOA</code></small><br />
      </td>
      <td align="center">
        <a href="https://github.com/mennaossama">
          <img src="https://avatars.githubusercontent.com/u/125574589?v=4" width="110" style="border-radius:50%;" alt="Menna Ossama"/><br />
          <sub><b>Menna Ossama</b></sub>
        </a><br />
        <small><code>@mennaossama</code></small><br />
        <small>mennaossama51@gmail.com</small><br />
      </td>
    </tr>
  </table>
</div>

---

<div align="center">

<img src="Source/assets/ai-ml-team-fire-purple.svg" alt="AI & Machine Learning Team" width="450"/>

  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/MuhammedMahmoud0">
          <img src="https://avatars.githubusercontent.com/u/179109266?v=4" width="110" style="border-radius:50%;" alt="Muhammed Mahmoud"/><br />
          <sub><b>Muhammed Mahmoud</b></sub>
        </a><br />
        <small><code>@MuhammedMahmoud0</code></small><br />
        <small>muhammedmahmoud091@gmail.com</small><br />
      </td>
      <td align="center">
        <a href="https://github.com/VALKAN00">
          <img src="https://avatars.githubusercontent.com/u/147733659?v=4" width="110" style="border-radius:50%;" alt="Abdelrhman Ahmed"/><br />
          <sub><b>Abdelrhman Ahmed</b></sub>
        </a><br />
        <small><code>@VALKAN00</code></small><br />
        <small>lito2182002@gmail.com</small><br />
      </td>
      <td align="center">
        <a href="https://github.com/ZizoElkhateeb">
          <img src="https://avatars.githubusercontent.com/u/130157238?v=4" width="110" style="border-radius:50%;" alt="Ziad Mohamed"/><br />
          <sub><b>Ziad Mohamed</b></sub>
        </a><br />
        <small><code>@ZizoElkhateeb</code></small><br />
        <small>CDS.ZiadMohamed23135@alexu.edu.eg</small><br />
      </td>
    </tr>
  </table>
</div>

<br>

<a id="demo-videos"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=435&height=25&lines=DEMO+VIDEOS" width="450"/>

---

### 💻 Web Dashboard

<p align="center">
  <a href="https://drive.google.com/file/d/1pIwiySO63U0JgaznirzbiVU-8o1hqvhq/view?usp=drivesdk">
    <img src="./Source/assets/web-demo-thumbnail.png" alt="Web Dashboard Demo" width="800"/>
  </a>
</p>

<p align="center">
  <a href="https://drive.google.com/file/d/1pIwiySO63U0JgaznirzbiVU-8o1hqvhq/view?usp=drivesdk">
    ▶️ Watch the Full Web Demo
  </a>
</p>

---

### 📱 Mobile Application

> _(GitHub video will be embedded here.)_

<!-- Paste GitHub video link -->

<br>

<a id="license"></a>

<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=5a4dbf&vCenter=true&width=435&height=25&lines=LICENSE" width="450"/>

---

This project is licensed under the **ISC License**.

See the [LICENSE](LICENSE) file for more information.

---

<div align="center">
  <b>Built with ❤️ by the Academia Graduation Project Team</b><br/>
</div>
