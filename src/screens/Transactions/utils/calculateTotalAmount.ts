export const calculateTotalAmount = (fee: string, amount: string) => {
  return (-(Math.abs(parseFloat(fee)) + Math.abs(parseFloat(amount)))).toString();
};
