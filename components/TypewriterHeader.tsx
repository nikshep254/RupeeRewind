
import React, { useState, useEffect } from 'react';

interface TypewriterHeaderProps {
  words: string[];
  className?: string;
}

const TypewriterHeader: React.FC<TypewriterHeaderProps> = ({ words, className }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 400); 
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0); // Loop back
      return;
    }

    if (subIndex === words[index].length + 1 && !reverse) {
      // Finished typing word, wait briefly then delete
      const timeout = setTimeout(() => {
        setReverse(true);
      }, 800); 
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
        // Finished deleting, move to next word
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      // Faster typing
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 20 : 40); 

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className={`${className} inline-block min-h-[1.2em] whitespace-nowrap`}>
      {words[index].substring(0, subIndex)}
      <span className={`ml-1 w-1 bg-zinc-900 dark:bg-white inline-block h-[0.8em] align-middle ${blink ? 'opacity-100' : 'opacity-0'}`}>&nbsp;</span>
    </span>
  );
};

export default TypewriterHeader;
