import { type FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import DashBoardPage from '../pages/DashBoardPage/DashBoardPage';
import ImportPdfPage from '../pages/ImportPdfPage/ImportPdfPage';
import ChartSlotsPage from '../pages/ChartSlotsPage/ChartSlotsPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import AuthPage from '../pages/AuthPage/AuthPage';
import ResetPasswordPage from '../pages/ResetPasswordPage/ResetPasswordPage';
import AuthedUserRoute from '../shared/lib/router/AuthedUserRoute';
import GuestRoute from '../shared/lib/router/GuestRoute';

const Router: FC = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/import-pdf' element={
               <AuthedUserRoute>
                  <ImportPdfPage />
               </AuthedUserRoute>
               } 
            />
            <Route path='/dashboard' element={
               <AuthedUserRoute>
                  <ChartSlotsPage />
               </AuthedUserRoute>
               } 
            />
            <Route path='/dashboard/:id' element={
               <AuthedUserRoute>
                  <DashBoardPage />
               </AuthedUserRoute>
               } 
            />
            <Route path='/auth' element={
               <GuestRoute>
                  <AuthPage />
               </GuestRoute>
               } 
            />
            <Route path='/reset-password' element={
               <GuestRoute>
                  <ResetPasswordPage />
               </GuestRoute>
               } 
            />
            <Route path='*' element={<NotFoundPage />} />
         </Routes>
      </BrowserRouter>
   )
}

export default Router;