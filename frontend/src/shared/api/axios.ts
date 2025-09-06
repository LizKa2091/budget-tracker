import axios from 'axios';
import { extractExpFromJson } from '../lib/extractExpFromJson';
import type { IExpenseItem } from '../types/expenses';
import { isAxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import type { AxiosError } from 'axios';

interface IAxiosErrorResponse {
   message: string;
};

interface IRefreshResponse {
   token: string;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const safeErrMessage = 'Ошибка на сервере';

const importPdfAxios = axios.create({
   baseURL: baseUrl
});

const tokenAxios = axios.create({
   baseURL: baseUrl,
   withCredentials: true
});

const handleAxiosError = (err: unknown): never => {
   if (isAxiosError(err)) {
      const axiosErr = err as AxiosError<IAxiosErrorResponse>;
      throw new Error(axiosErr.response?.data.message || safeErrMessage);
   }
   if (err instanceof Error) {
      throw new Error(err.message || safeErrMessage);
   }

   throw new Error(safeErrMessage);
};

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
      handleAxiosError(err);
   }
);

tokenAxios.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token');

      if (token) {
         config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
      }
      return config;
   }
);

tokenAxios.interceptors.response.use(
   (res: AxiosResponse) => {
      if (res.data?.token) {
         localStorage.setItem('token', res.data.token);
      }

      return res;
   },
   async (err) => {
      if (err.response?.status === 401 && !err.config._retry) {
         err.config._retry = true;

         try {
            const { data } = await tokenAxios.post<IRefreshResponse>('/refresh');
            localStorage.setItem('token', data.token);

            err.config.headers = { ...err.config.headers, Authorization: `Bearer ${data.token}` };
            return tokenAxios(err.config);
         }
         catch (error) {
            localStorage.removeItem('token');
            
            handleAxiosError(error);
         }
      }
      handleAxiosError(err);
   }
)

export { importPdfAxios };