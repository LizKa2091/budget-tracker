import { useForm } from "react-hook-form";
import type { IFormValues } from "../types";
import { useImportPdf } from "./useImportPdf";
import ChartExports from "../../../shared/context/ChartContext";
import { useEffect, useState } from "react";
import type { IExpenseItem } from "../../../shared/types/expenses";
import { mapExpensesWithCategories } from "../lib/mapExpensesWithCategories";

const { useChartContext } = ChartExports;

export const useImportPdfForm = () => {
   const { handleSubmit, control, formState: { errors } } = useForm<IFormValues>();
   const { mutate: importPdf } = useImportPdf();
   const { addChart } = useChartContext();

   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

   useEffect(() => {
      if (isLoading) setIsSuccess(null);
   }, [isLoading]);

   const onSubmit = async (data: IFormValues): Promise<void> => {
      if (!data.pdfFile || !data.chartName) return;

      setIsLoading(true);

      importPdf(data.pdfFile, {
         onSuccess: (expenseItems: IExpenseItem[]) => {
            console.log(true)
            setIsSuccess(true);
            const expenseItemsMapped = mapExpensesWithCategories(expenseItems);

            addChart(expenseItemsMapped, data.chartName);
         },
         onError: () => {setIsSuccess(false); console.log(false)},
         onSettled: () => setIsLoading(false)
      });
   };

   return { handleSubmit: handleSubmit(onSubmit), control, errors, isLoading, isSuccess }
};