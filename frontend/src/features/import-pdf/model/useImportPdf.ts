import { useMutation } from "@tanstack/react-query";
import { extractExpFromJson } from "../../../shared/lib/extractExpFromJson";
import { type IExpenseItem } from "../../../shared/types/expenses";
import axios from "axios";

const importPdf = async (pdfFile: File): Promise<IExpenseItem[]> => {
   const formData = new FormData();
   formData.append('pdfFile', pdfFile);
   console.log('pdfFile', pdfFile);


   const { data } = await axios.post<IExpenseItem[]>('http://localhost:4000/upload', 
      formData
   );
   console.log('data was outp', data)

   return extractExpFromJson(data);
};

export const useImportPdf = () => {
   return useMutation<IExpenseItem[], Error, File>({
      mutationKey: ['importPdf'],
      mutationFn: importPdf,
      retry: 1
   })
};