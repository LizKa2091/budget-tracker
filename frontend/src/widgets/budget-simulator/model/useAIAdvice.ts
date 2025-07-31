import { useMutation } from "@tanstack/react-query";
import type { IExpensesByCategories } from "../../../shared/types/expenses";
import type { IChartItem } from "../../../shared/types/charts";

interface IAIResponse {
   answer: string;
};

interface IAIAdviceParams {
   promptType: 'cutSpendings' | 'setGoal';
   value?: string;
   expenses: IChartItem[] | IExpensesByCategories[];
}

const cutSpendingsPattern: string = 'мне нужно сократить расходы, я тебе предоставляю json файл с моими тратами за месяц. дай небольшой текстовый совет, как сэкономить ';
const setGoalPattern: string = 'я хочу накопить деньги. я тебе предоставляю json файл с моими тратами за месяц. дай небольшой текстовый совет, как накопить ';

const getAIAdvice = async ({ promptType, value = 'в целом', expenses }: IAIAdviceParams): Promise<IAIResponse> => {
   let prompt: string = '';

   if (promptType === 'cutSpendings') {
      prompt += cutSpendingsPattern + (value !== 'в целом' ? `в категории ${value}` : '');
   }
   else {
      prompt += setGoalPattern + value + ' рублей';
   }
   
   const response = await fetch('http://localhost:4000/chat', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, expenses })
   });

   if (!response.ok) throw new Error('ошибка при получении ответа');

   return await response.json();
};

export const useAIAdvice = () => {
   return useMutation<IAIResponse, Error, IAIAdviceParams>({
      mutationKey: ['ai advice'],
      mutationFn: getAIAdvice,
      retry: 1
   });
};