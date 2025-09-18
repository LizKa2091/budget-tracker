import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type { IExpensesByCategories } from "../../../shared/types/expenses";
import type { IChartItem } from "../../../shared/types/charts";
import { cutSpendingsPattern, setGoalPattern } from "../lib/patterns";

interface IAIResponse {
   answer: string;
}

interface IAIAdviceParams {
   promptType: 'cutSpendings' | 'setGoal';
   value?: string;
   expenses: IChartItem[] | IExpensesByCategories[];
}

const getAIAdvice = async ({ promptType, value = 'в целом', expenses }: IAIAdviceParams): Promise<IAIResponse> => {
   let prompt: string = '';

   if (promptType === 'cutSpendings') {
      prompt += cutSpendingsPattern + (value !== 'в целом' ? `в категории ${value}` : '');
   }
   else {
      prompt += setGoalPattern + value + ' рублей';
   }
   
   const { data } = await axios.post<IAIResponse>('http://localhost:4000/chat', {
      prompt: prompt, expenses: expenses
   });

   return data;
}

export const useAIAdvice = () => {
   return useMutation<IAIResponse, Error, IAIAdviceParams>({
      mutationKey: ['ai advice'],
      mutationFn: getAIAdvice,
      retry: 1
   });
}