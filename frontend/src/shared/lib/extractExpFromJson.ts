import { type IExpenseItem } from "../types/expenses";

export const extractExpFromJson = (data: any): IExpenseItem[] => {
   const expenses: IExpenseItem[] = [];

   const pages = data.result?.document?.page || [];

   for (const page of pages) {
      const rows = page.row || [];

      for (const row of rows) {
         const columns = row.column || [];

         const getText = (colIndex: number) => {
            const col = columns[colIndex];

            if (col?.text?.['#text']) {
               return col.text['#text'].trim();
            }

            return '';
         };

         const date = getText(0);
         const title = getText(2);
         const rawAmount = getText(3);

         if (date && title && rawAmount) {
            const amount = parseFloat(rawAmount.replace(/[−–—]/, '-').replace(',', '.'));
            if (!isNaN(amount)) {
               expenses.push({ date, title, amount });
            }
         }
      }
   }

   return expenses;
};
