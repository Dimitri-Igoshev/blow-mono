export const onlyDigits = (input: string): string => {
  return input.replace(/\D/g, '');
}
