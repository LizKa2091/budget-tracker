import axios from 'axios';
import { extractExpFromJson } from '../lib/extractExpFromJson';
import type { IExpenseItem } from '../types/expenses';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const safeErrMessage = 'Ошибка на сервере';

const importPdfAxios = axios.create({
   baseURL: baseUrl
});

importPdfAxios.interceptors.request.use(
   (config) => {
      const configData = config.data as { file?: File };

      if (configData?.file instanceof File) {
         const formData = new FormData();
         formData.append('pdfFile', configData.file);
         config.data = formData;
      }
      return config;
   }
);
importPdfAxios.interceptors.response.use(
   (res) => {
      res.data = extractExpFromJson(res.data) as IExpenseItem[];
      return res;
   },
   (err) => {
      if (isAxiosError(err)) {
         throw new Error(err.response?.data.message || safeErrMessage);
      }
      else if (err instanceof Error) {
         throw new Error(err.message || safeErrMessage);
      }

      throw new Error(safeErrMessage);
   }
)

export { importPdfAxios };