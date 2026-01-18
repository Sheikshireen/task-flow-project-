import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ColorPalette = 'teal-indigo' | 'blue-purple' | 'green-orange';

interface ColorPaletteContextType {
  palette: ColorPalette;
  setPalette: (palette: ColorPalette) => void;
}

const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(undefined);

const PALETTE_STORAGE_KEY = 'taskflow-color-palette';

export const ColorPaletteProvider = ({ children }: { children: ReactNode }) => {
  const [palette, setPaletteState] = useState<ColorPalette>(() => {
    // Get from localStorage or default to teal-indigo
    const stored = localStorage.getItem(PALETTE_STORAGE_KEY) as ColorPalette | null;
    return stored && ['teal-indigo', 'blue-purple', 'green-orange'].includes(stored)
      ? stored
      : 'teal-indigo';
  });

  useEffect(() => {
    // Apply palette to document root
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem(PALETTE_STORAGE_KEY, palette);
  }, [palette]);

  const setPalette = (newPalette: ColorPalette) => {
    setPaletteState(newPalette);
  };

  return (
    <ColorPaletteContext.Provider value={{ palette, setPalette }}>
      {children}
    </ColorPaletteContext.Provider>
  );
};

export const useColorPalette = () => {
  const context = useContext(ColorPaletteContext);
  if (context === undefined) {
    throw new Error('useColorPalette must be used within a ColorPaletteProvider');
  }
  return context;
};
