"use client";

import { useEffect, useMemo, useState } from "react";

const phrases = ["Creativity", "Focus", "Confidence"];

export default function HeroTypewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(phrases[0].length);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = useMemo(() => phrases[phraseIndex], [phraseIndex]);

  useEffect(() => {
    const typingSpeed = isDeleting ? 85 : 75;
    const pauseAtEnd = 1200;
    const pauseBeforeType = 250;

    const timer = setTimeout(
      () => {
        if (!isDeleting && charIndex < currentPhrase.length) {
          setCharIndex((value) => value + 1);
          return;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && charIndex > 0) {
          setCharIndex((value) => value - 1);
          return;
        }

        setIsDeleting(false);
        setPhraseIndex((value) => (value + 1) % phrases.length);
      },
      !isDeleting && charIndex === currentPhrase.length
        ? pauseAtEnd
        : charIndex === 0
        ? pauseBeforeType
        : typingSpeed,
    );

    return () => clearTimeout(timer);
  }, [charIndex, currentPhrase.length, isDeleting]);

  return (
    <span className="mt-5 block text-[#8a4f2b]">
      {currentPhrase.slice(0, charIndex)}
      <span className="ml-1 inline-block animate-pulse text-[#6f3f22]">|</span>
    </span>
  );
}
