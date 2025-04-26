export const CURRENT_YEAR = 2024;
export const START_YEAR = 2011;

export const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => ({
    key: String(CURRENT_YEAR - i),
    text: String(CURRENT_YEAR - i),
    value: String(CURRENT_YEAR - i),
  })
);
