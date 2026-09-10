export const FONT_SCALE_STEPS = [0.875, 1, 1.125, 1.25, 1.375, 1.5] as const;
export type FontScale = (typeof FONT_SCALE_STEPS)[number];
export const DEFAULT_FONT_SCALE: FontScale = 1;
export const MIN_FONT_SCALE = FONT_SCALE_STEPS[0];
export const MAX_FONT_SCALE = FONT_SCALE_STEPS[FONT_SCALE_STEPS.length - 1];
