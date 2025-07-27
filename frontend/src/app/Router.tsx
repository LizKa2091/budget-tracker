import { type FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import DashBoardPage from '../pages/DashBoardPage';
import ImportPdfPage from '../pages/ImportPdfPage';

const Router: FC = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/import-pdf' element={<ImportPdfPage />} />
            <Route path='/dashboard' element={<DashBoardPage />} />
         </Routes>
      </BrowserRouter>
   )
}

export default Router;