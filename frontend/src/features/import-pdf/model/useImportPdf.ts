import { useMutation } from "@tanstack/react-query";
import { extractExpFromJson } from "../../../shared/lib/extractExpFromJson";
import { type IExpenseItem } from "../../../shared/types/expenses";

const importPdf = async (pdfFile: File): Promise<IExpenseItem[]> => {
   const response = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: pdfFile
   });

   if (!response.ok) throw new Error('ошибка сервера');

   const result = await response.json();
   
   return extractExpFromJson(result);
};

export const useImportPdf = () => {
   return useMutation<IExpenseItem[], Error, File>({
      mutationKey: ['importPdf'],
      mutationFn: importPdf,
      retry: 1
   })
};