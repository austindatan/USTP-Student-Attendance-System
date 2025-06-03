# USTP Student Attendance Monitoring System

A **Web-Based Student Attendance Monitoring System** developed for the **University of Science and Technology of Southern Philippines – Cagayan de Oro (USTP-CDO)**. This system modernizes the tracking and management of student attendance with real-time updates, role-based access, and visual insights.

## Project Description

This system replaces traditional attendance tracking with a centralized digital platform. It provides tailored features for three main user types:

- **Administrators** – Manage students, instructors, courses, sections, and approve drop requests.
- **Instructors** – Record attendance, monitor student presence, manage excuse letters.
- **Students** – View attendance records and submit digital excuse requests.

### Built With

- **Frontend**: React.js
- **Styling**: Tailwind CSS + Plugins
- **Data Visualization**: Chart.js, Recharts
- **Backend**: PHP (Custom APIs)
- **Database**: MySQL
- **Local Server**: XAMPP

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [XAMPP](https://www.apachefriends.org/) or any local server running PHP and MySQL

### Database Setup

1. Import the SQL database file (provided in `/database` folder or separately) into **phpMyAdmin** or via MySQL CLI.
2. Update your backend PHP files with correct database credentials.
3. Start Apache and MySQL from XAMPP control panel.

---

## Installation

Run the following commands in the root of your React frontend project:

```bash
# ESLint for React development
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks

# Tailwind CSS and plugins
npm install -D tailwindcss@3
npx tailwindcss init
npm install tailwindcss-textshadow
npm install @tailwindcss/line-clamp

# Core libraries
npm install axios
npm install react-icons
npm install date-fns
npm install react-router-dom

# Charts and graphs
npm install recharts
npm install chart.js react-chartjs-2
