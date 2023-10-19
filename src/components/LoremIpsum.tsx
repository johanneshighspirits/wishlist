'use client';

import { useEffect, useState } from 'react';

export const LoremIpsum = ({
  maxLines = 1,
  maxWords = 1,
  className,
}: {
  maxLines?: number;
  maxWords?: number;
  className?: string;
}) => {
  const [texts, setTexts] = useState(['']);
  useEffect(() => {
    const lines = Array.from(
      { length: Math.ceil(Math.random() * maxLines) },
      () => randomSentence(maxWords)
    );
    setTexts(lines);
  }, [maxLines, maxWords]);
  return (
    <>
      {texts.map((text) => (
        <p key={text} className={className}>
          {text}
        </p>
      ))}
    </>
  );
};

const randomLetter = () =>
  String.fromCodePoint(97 + Math.round(Math.random() * 28));

const randomWord = (maxLength: number = 10) =>
  Array.from({ length: Math.ceil(Math.random() * maxLength) }, () =>
    randomLetter()
  ).join('');

const randomSentence = (maxLength: number = 10) =>
  randomLetter().toUpperCase() +
  Array.from({ length: Math.ceil(Math.random() * maxLength) }, () =>
    randomWord()
  ).join(' ');
