export const getRandomColor = () => {
   const values: string = '0123456789ABCDEF';
   let resultColor: string = '#';

   for (let i=0; i<6; i++) {
      resultColor += values[Math.floor(Math.random() * 16)];
   }

   return resultColor;
};