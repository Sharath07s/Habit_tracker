# 🌱 Habit Tracker

> A modern, responsive habit tracking application that helps users build consistency, monitor progress, and develop better daily routines.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 Overview

Habit Tracker is a full-stack web application designed to help users build productive habits and maintain consistency through an intuitive and interactive interface.

The application enables users to create, organize, monitor, and analyze their daily habits while providing visual insights into their progress over time.

Whether you're building healthy routines, improving productivity, or tracking personal goals, Habit Tracker offers a simple and efficient solution.

---

# ✨ Features

### 📅 Daily Habit Tracking

- Create new habits
- Edit existing habits
- Delete habits
- Mark habits as completed
- View daily progress

---

### 📊 Progress Analytics

- Daily completion tracking
- Weekly overview
- Monthly statistics
- Habit completion percentage
- Performance insights

---

### 📈 Visual Dashboard

- Interactive charts
- Progress indicators
- Completion summaries
- Activity overview
- Productivity metrics

---

### 🔍 Habit Management

- Organize habits efficiently
- Track habit history
- View completed and pending habits
- Easy habit updates

---

### 🎨 Modern UI

- Responsive design
- Mobile-friendly interface
- Clean dashboard
- Smooth animations
- Accessible components

---

### 🔐 Authentication *(if implemented)*

- User registration
- Secure login
- Session management
- Protected routes

---

# 🏗️ System Architecture

```
                    +----------------------+
                    |      Frontend        |
                    |      Next.js         |
                    +----------+-----------+
                               |
                               |
                         API Requests
                               |
                    +----------+-----------+
                    |      Backend         |
                    |  Server Actions/API  |
                    +----------+-----------+
                               |
                               |
                    +----------+-----------+
                    |      Database        |
                    |  Store User & Habits |
                    +----------------------+
```

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

---

## Backend

- Next.js API Routes / Server Actions

---

## Database

- PostgreSQL / Supabase *(Update according to your project)*

---

## Authentication

- NextAuth / Clerk / Supabase Auth *(If applicable)*

---

## UI Libraries

- ShadCN UI
- Lucide Icons
- Framer Motion *(Optional)*

---

# 📂 Project Structure

```
habit-tracker/
│
├── app/
│   ├── dashboard/
│   ├── habits/
│   ├── api/
│   ├── login/
│   └── page.tsx
│
├── components/
│
├── lib/
│
├── hooks/
│
├── public/
│
├── styles/
│
├── types/
│
├── utils/
│
├── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/yourusername/habit-tracker.git

cd habit-tracker
```

---

## Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

or

```bash
pnpm install
```

---

## Configure Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
DATABASE_URL=

NEXTAUTH_SECRET=

NEXTAUTH_URL=

SUPABASE_URL=

SUPABASE_ANON_KEY=
```

> Remove variables that are not used in your project.

---

## Start Development Server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

# 📱 Application Workflow

```
User Login
      │
      ▼
Dashboard
      │
      ▼
Create Habit
      │
      ▼
Track Daily Progress
      │
      ▼
View Analytics
      │
      ▼
Maintain Consistency
```

---

# 📊 Core Functionalities

- ✅ Create habits
- ✅ Edit habits
- ✅ Delete habits
- ✅ Track daily completion
- ✅ Progress monitoring
- ✅ Dashboard analytics
- ✅ Responsive design

---

# 🎯 Use Cases

- Personal productivity
- Fitness tracking
- Study planning
- Reading habits
- Meditation
- Water intake tracking
- Workout routines
- Daily goals

---

# 📸 Screenshots




# ⚡ Performance

- Optimized Next.js rendering
- Fast page navigation
- Responsive UI
- Efficient state management
- Optimized asset loading

---

# 🔒 Security

- Input validation
- Secure authentication
- Protected routes
- Environment variable management
- Secure API communication

---

# 🚀 Future Enhancements

- Habit reminders
- Push notifications
- Calendar integration
- Dark mode
- Streak tracking
- Achievement badges
- AI-powered habit recommendations
- Social habit sharing
- Data export
- Mobile application

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature/new-feature
```


# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Your Name**

GitHub: https://github.com/Sharath07s

LinkedIn: https://www.linkedin.com/in/sharath-hn-37b61a32a

---

## ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and supports future development.

---
