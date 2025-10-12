export function transliterate(text: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
    е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
    й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
    о: 'o', п: 'p', р: 'r', с: 's', т: 't',
    у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
    ш: 'sh', щ: 'shch', ы: 'y', э: 'e', ю: 'yu',
    я: 'ya', ъ: '', ь: '',

    А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D',
    Е: 'E', Ё: 'E', Ж: 'Zh', З: 'Z', И: 'I',
    Й: 'Y', К: 'K', Л: 'L', М: 'M', Н: 'N',
    О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T',
    У: 'U', Ф: 'F', Х: 'H', Ц: 'Ts', Ч: 'Ch',
    Ш: 'Sh', Щ: 'Shch', Ы: 'Y', Э: 'E', Ю: 'Yu',
    Я: 'Ya', Ъ: '', Ь: '',
  };

  return text
    .split('')
    .map(char => map[char] ?? char)
    .join('')
    .toLowerCase(); // можно убрать, если нужна оригинальная капитализация
}
