export function rem(count: number): number {
  return count * parseFloat(getComputedStyle(document.documentElement).fontSize);
}