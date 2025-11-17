import { type FC, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useChartStore } from '../../../shared/store-hooks/useChartStore';
import { Flex, Card, Statistic, Divider } from 'antd';
import { type IChartSlot } from '../../../shared/types/charts';
import styles from './Home.module.scss';

const Home: FC = () => {
   const { charts } = useChartStore();

   const lastChart = useMemo(() => {
      const chartsArr = Array.isArray(charts) ? charts : [];

      const filtered = chartsArr.filter((chart: IChartSlot) => chart.data && chart.data.length > 0);

      return filtered.length > 0 ? filtered[filtered.length - 1] : null;
   }, [charts]);

   const lastChartData = useMemo(() => lastChart?.data || [], [lastChart]);

   const totalSpent = useMemo(() => lastChartData.reduce((sum, item) => sum + (item.amount || 0), 0), [lastChartData]);
   const biggestExpense = useMemo(() => {
      if (lastChartData.length === 0) return { title: '–', amount: 0 };

      return lastChartData.reduce((max, item) => item.amount > max.amount ? item : max, { title: '', amount: 0 });
   }, [lastChartData]);

   return (
      <>
         <h2>Добро пожаловать в Budget Tracker</h2>
         <p className={styles.info}>
            Анализируйте расходы, экспериментируйте с бюджетом и принимайте решения на основе данных и советов от нейросети. 
            Импортируйте PDF, добавляйте траты, смотрите графики по категориям, просите советы
         </p>
         <Flex wrap gap='large' justify='center'>
            <Card hoverable actions={[<Link to='/import-pdf'>Перейти</Link>]} className={styles.card}>
               <p className={styles.cardTitle}>Импортировать PDF</p>
               <p>Загрузите файл с выпиской, начните анализ своих расходов</p>
            </Card>
            <Card hoverable actions={[<Link to='/dashboard'>Перейти</Link>]} className={styles.card}>
               <p className={styles.cardTitle}>Дашборд</p>
               <p>Посмотрите сохранённые диаграммы и статистику по ним</p>
            </Card>
            <Card hoverable className={styles.card}>
               <p className={styles.cardTitle}>Эксперименты</p>
               <p>Что если убрать траты? Поставьте цель и получите советы от нейросети</p>
            </Card>
         </Flex>
         {lastChart ? (
            <Flex vertical align='center' gap='medium'>
            <h3>Ваша последняя сохранённая диаграмма: {lastChart.name}</h3>
            <Divider />
            <Flex wrap justify='center' gap='large'>
               <Statistic title='Общие расходы' value={totalSpent} suffix='₽'/>
               <Statistic title='Самая крупная трата' value={biggestExpense.title} />
               <Statistic title='Сумма самой крупной траты' value={biggestExpense.amount} suffix='₽' />
            </Flex>
            <Divider />
         </Flex>
         ) : (
            <p>Пока нет сохранённых диаграмм. Начните с импорта PDF или добавления расходов</p>
         )}
      </>
   )
}

export default Home;