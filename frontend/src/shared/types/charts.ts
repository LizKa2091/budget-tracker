export interface IChartSlot {
   id: number;
   data: IChartItem[] | null;
}

export interface IChartItem {
   date: string;
   title: string;
   amount: number;
   category?: string;
}