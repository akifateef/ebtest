import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_FONT_SCALE,
  FONT_SCALE_STEPS,
  MAX_FONT_SCALE,
  MIN_FONT_SCALE,
  type FontScale,
} from "./fontSize";
import { loadFontScale, saveFontScale } from "../storage";

interface FontSizeContextValue {
  fontScale: FontScale;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

const FontSizeContext = createContext<FontSizeContextValue | null>(null);

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useState<FontScale>(
    () => loadFontScale() ?? DEFAULT_FONT_SCALE
  );

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    saveFontScale(fontScale);
  }, [fontScale]);

  function step(direction: 1 | -1) {
    setFontScale((current) => {
      const index = FONT_SCALE_STEPS.indexOf(current);
      const nextIndex = (index === -1 ? FONT_SCALE_STEPS.indexOf(DEFAULT_FONT_SCALE) : index) + direction;
      const clampedIndex = Math.min(
        Math.max(nextIndex, 0),
        FONT_SCALE_STEPS.length - 1
      );
      return FONT_SCALE_STEPS[clampedIndex];
    });
  }

  return (
    <FontSizeContext.Provider
      value={{
        fontScale,
        increaseFontSize: () => step(1),
        decreaseFontSize: () => step(-1),
        canIncrease: fontScale < MAX_FONT_SCALE,
        canDecrease: fontScale > MIN_FONT_SCALE,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize(): FontSizeContextValue {
  const ctx = useContext(FontSizeContext);
  if (!ctx) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return ctx;
}
