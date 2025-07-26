import { useMutation } from "@tanstack/react-query";

const importPdf = async (pdfFile: File): Promise<unknown> => {
   const response = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      body: pdfFile
   });

   if (!response.ok) throw new Error('ошибка сервера');
   
   return await response.json();
};

export const useImportPdf = () => {
   return useMutation({
      mutationKey: ['importPdf'],
      mutationFn: importPdf,
      retry: 1
   })
};