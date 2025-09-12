import { type FC } from 'react';
import { Checkbox, Flex, Segmented, type CheckboxChangeEvent } from 'antd';
import type { ChartMode } from '../../../shared/types/charts';

interface IChartModeSwitcherProps {
   displayMode: 'default' | 'categories';
   setDisplayMode: (value: ChartMode) => void;
   allCategories: string[];
   categoriesToShow: string[];
   setCategoriesToShow: (values: string[]) => void;
};

const ChartModeSwitcher: FC<IChartModeSwitcherProps> = ({ displayMode, setDisplayMode, allCategories, categoriesToShow, setCategoriesToShow }) => {
   const handleSegmentedChange = (value: string) => {
      if (value === 'Без категорий') setDisplayMode('default');
      else if (value === 'По категориям') setDisplayMode('categories');
   };

   const handleCheckbox = (e: CheckboxChangeEvent, category: string) => {
      let updatedCategories: string[];

      if (e.target.checked) {
         updatedCategories = [...(categoriesToShow ?? []), category];
      }
      else {
         updatedCategories = (categoriesToShow ?? []).filter(item => item !== category);
      }

      setCategoriesToShow(updatedCategories);
      console.log(updatedCategories);
   }

   return (
      <Flex vertical align='center' gap='large'>
         <h3>Показывать все траты</h3>
         <Segmented options={['Без категорий', 'По категориям']} onChange={handleSegmentedChange} />
         {displayMode === 'categories' &&
            <Flex vertical align='center' gap='large'>
               <h3>Показать категорию</h3>
               <Flex vertical gap='small'>
                  {allCategories?.map((category: string) => 
                     <Checkbox key={category} checked={categoriesToShow?.includes(category)} onChange={(e) => handleCheckbox(e, category)} data-category={category}>{category}</Checkbox>
                  )}
               </Flex>
            </Flex>
         }
      </Flex>
   )
}

export default ChartModeSwitcher;