export function capitalizeFirstLetter(string: unknown) {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}
