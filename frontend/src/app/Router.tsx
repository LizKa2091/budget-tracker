import { type FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import DashBoardPage from '../pages/DashBoardPage/DashBoardPage';
import ImportPdfPage from '../pages/ImportPdfPage/ImportPdfPage';
import ChartSlotsPage from '../pages/ChartSlotsPage/ChartSlotsPage';

const Router: FC = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/import-pdf' element={<ImportPdfPage />} />
            <Route path='/dashboard' element={<ChartSlotsPage />} />
            <Route path='/dashboard/:id' element={<DashBoardPage />} />
         </Routes>
      </BrowserRouter>
   )
}

export default Router;