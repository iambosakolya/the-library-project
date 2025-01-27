'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export const useMountedTheme = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return { mounted, theme, setTheme };
};
