// data/embarazoSemanas.ts
//
// trimesterOf is the only thing left here — all week-by-week content
// (title/fact/feel/tip) now lives in translations/index.ts as
// viajeSemanaXTitle / viajeSemanaXFact / viajeSemanaXFeel / viajeSemanaXTip,
// so it can switch between Spanish and Miskito via t().

export function trimesterOf(week: number): 1 | 2 | 3 {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}