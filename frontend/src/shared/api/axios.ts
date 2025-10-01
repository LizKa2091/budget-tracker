import axios, {
   AxiosError,
   type AxiosInstance,
   type AxiosRequestConfig,
   type AxiosResponse,
   isAxiosError,
   type InternalAxiosRequestConfig,
   type AxiosRequestHeaders
} from 'axios';
import { extractExpFromJson } from '../lib/extractExpFromJson';
import type { IExpenseItem } from '../types/expenses';

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
   _retry?: boolean;
}

interface IAxiosErrorResponse {
   message: string;
}

interface IRefreshResponse {
   token: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const safeErrMessage = 'Ошибка на сервере';

const createAxios = (options: AxiosRequestConfig = {}): AxiosInstance => {
   return axios.create({
      baseURL: baseUrl,
      ...options
   });
};

const importPdfAxios = createAxios();
const tokenAxios = createAxios({ withCredentials: true });
const refreshAxios = createAxios({ withCredentials: true });

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
   (config: InternalAxiosRequestConfig) => {
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
   (res: AxiosResponse) => {
      res.data = extractExpFromJson(res.data) as IExpenseItem[];
      return res;
   },
   (err: unknown) => {
      handleAxiosError(err);
   }
);

tokenAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
   const token = localStorage.getItem('token');

   if (token) {
      config.headers = config.headers ?? {};

      const headers = config.headers as AxiosRequestHeaders;

      if (typeof headers.set === 'function') {
         headers.set('Authorization', `Bearer ${token}`);
      } else {
         headers['Authorization'] = `Bearer ${token}`;
      }
   }
   return config;
});

tokenAxios.interceptors.response.use(
   (res: AxiosResponse) => {
      if (res.data?.token) {
         localStorage.setItem('token', res.data.token);
      }

      return res;
   },
   async (err: AxiosError<IRefreshResponse, AxiosRequestConfigWithRetry>) => {
      const initialConfig = err.config as
         | AxiosRequestConfigWithRetry
         | undefined;

      if (
         err.response?.status === 401 &&
         initialConfig &&
         initialConfig._retry
      ) {
         initialConfig._retry = true;

         try {
            const { data } = await refreshAxios.post<IRefreshResponse>(
               '/refresh'
            );
            localStorage.setItem('token', data.token);

            if (initialConfig.headers) {
               initialConfig.headers.set?.(
                  'Authorization',
                  `Bearer ${data.token}`
               );
            }
            return tokenAxios(initialConfig);
         } catch (error) {
            localStorage.removeItem('token');

            handleAxiosError(error);
         }
      }
      handleAxiosError(err);
   }
);

export { importPdfAxios, tokenAxios };
