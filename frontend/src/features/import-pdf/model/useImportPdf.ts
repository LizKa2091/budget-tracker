import { useMutation } from "@tanstack/react-query";
import { type IExpenseItem } from "../../../shared/types/expenses";
import { importPdfAxios } from "../../../shared/api/axios";

export const useImportPdf = () => {
   return useMutation<IExpenseItem[], Error, File>({
      mutationKey: ['importPdf'],
      mutationFn: async (pdfFile) => {
         const { data } = await importPdfAxios.post<IExpenseItem[]>('/upload', { file: pdfFile });
         return data;
      },
      retry: 1
   })
};