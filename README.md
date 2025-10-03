![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![React Query](https://img.shields.io/badge/React_Query-5.83.0-FF4154?logo=react-query)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.60.0-EC5990?logo=react-hook-form)
![React Router](https://img.shields.io/badge/React_Router_DOM-7.7.0-CA4245?logo=react-router)
![Recharts](https://img.shields.io/badge/Recharts-3.1.0-22B5BF?logo=recharts)
![SCSS](https://img.shields.io/badge/SCSS-1.89.2-CC6699?logo=sass)
![Ant Design](https://img.shields.io/badge/AntDesign-5.26.5-0170FE?logo=ant-design)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?logo=vite) 
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)

# Budget Tracker
Веб-приложение для учёта личных финансов — управление расходами и доходами, категории, статистика и визуализация данных.

🔗 [Демо](https://budget-tracker-client.vercel.app/)

---

## 📌 О проекте
**Budget Tracker** помогает пользователям эффективно управлять финансами:

- добавлять расходы и доходы с указанием категорий и описания
- просматривать историю транзакций
- анализировать статистику в виде графиков и диаграмм
- планировать бюджет и отслеживать баланс

---

## 🔨 Технологии

### Frontend
- React + TypeScript
- SCSS
- React Hook Form (для форм и валидации)
- React Query + Axios (для работы с API, кеширования)
- Recharts (для построения графиков)
- React Router DOM (для роутинга)
- Context API (для глобального состояния)
- Vite (для сборки)

### Backend
- Node.js + Express
- TypeScript   
- JWT (авторизация)
- Multer (работа с файлами)
---

## 📦 Запуск и установка проекта
Клонируй репозиторий:
```
git clone https://github.com/LizKa2091/budget-tracker.git
```
Для работы проекта необходимо создать создать файл `.env` в директории `backend`, добавить `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GITHUB_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `CLIENT_URL` (по умолчанию http://localhost:5173)
### Frontend
Установите пакеты: <br />
```
cd frontend
```
```
npm install
```
```
npm run dev
```

### Backend
Установите пакеты: <br />
```
cd backend
```
```
npm install
```
```
npx ts-node server.ts
```
