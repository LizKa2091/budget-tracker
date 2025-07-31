import { type FC, useState, useEffect } from 'react';

interface ITypewriterProps {
   words: string[];
}

const Typewriter: FC<ITypewriterProps> = ({ words }) => {
   const [currentText, setCurrentText] = useState('');
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isTyping, setIsTyping] = useState(true);

   useEffect(() => {
      let timeout: NodeJS.Timeout;

      if (isTyping) {
         if (currentText.length < words[currentIndex].length) {
            timeout = setTimeout(() => {
               setCurrentText(words[currentIndex].substring(0, currentText.length + 1));
            }, 250);
         }
         else {
            timeout = setTimeout(() => setIsTyping(false), 500);
         }
      } 
      else {
         if (currentText.length > 0) {
            timeout = setTimeout(() => {
               setCurrentText(currentText.substring(0, currentText.length - 1));
            }, 50);
         } 
         else {
            setIsTyping(true);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
         }
      }

      return () => clearTimeout(timeout);
   }, [currentText, currentIndex, isTyping, words]);

   return <span>{currentText}</span>;
};

export default Typewriter;