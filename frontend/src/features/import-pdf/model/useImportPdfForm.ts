import { useState } from "react";
import { useForm } from "react-hook-form";
import { useImportPdf } from "./useImportPdf";
import { mapExpensesWithCategories } from "../lib/mapExpensesWithCategories";
import { useChartStore } from "../../../shared/store-hooks/useChartStore";
import type { IFormValues } from "../types";
import type { IExpenseItem } from "../../../shared/types/expenses";

export const useImportPdfForm = () => {
   const { handleSubmit, control, formState: { errors } } = useForm<IFormValues>();
   const { mutate: importPdf, isPending, isSuccess } = useImportPdf();
   const { addChart } = useChartStore();
   const [message, setMessage] = useState<string>('');

   const onSubmit = async (data: IFormValues): Promise<void> => {
      if (!data.pdfFile || !data.chartName) return;

      importPdf(data.pdfFile, {
         onSuccess: (expenseItems: IExpenseItem[]) => {
            const expenseItemsMapped = mapExpensesWithCategories(expenseItems);
            setMessage('Файл успешно загружен');

            addChart(expenseItemsMapped, data.chartName);
         },
         onError: (err: Error) => setMessage(err.message || "Произошла ошибка при загрузке файла")
      });
   };

   return { handleSubmit: handleSubmit(onSubmit), control, errors, isPending, isSuccess, message }
};