export const sanitizeNumericValue = (value: string) => {
  let newValue = value.replace(',', '.');

  if (newValue.startsWith('.')) {
    newValue = `0${newValue}`;
  }

  if (/^0\d/.test(newValue)) {
    newValue = newValue.replace(/^0+/, '');
  }

  newValue = newValue.replace(/[^0-9.]+/g, '').replace(/(\..*?)\.+/g, '$1');
  return newValue;
};
