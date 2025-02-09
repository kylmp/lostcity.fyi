export function getLines(text: string): string[] {
  return text.split(/\r\n|\r|\n/);
}
