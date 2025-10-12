export function removeEmptyFields(obj: any) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0))
  );
}