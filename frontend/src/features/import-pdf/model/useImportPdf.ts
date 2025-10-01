import { useMutation } from '@tanstack/react-query';
import { importPdfAxios } from '../../../shared/api/axios';
import type { IExpenseItem } from '../../../shared/types/expenses';

export const useImportPdf = () => {
   return useMutation<IExpenseItem[], Error, File>({
      mutationKey: ['importPdf'],
      mutationFn: async (pdfFile) => {
         const { data } = await importPdfAxios.post<IExpenseItem[]>('/upload', {
            file: pdfFile
         });

         const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

         return data
            .filter((item) => dateRegex.test(item.date))
            .map((item) => ({ ...item, category: undefined }));
      },
      retry: 1
   });
};
