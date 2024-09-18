import { isEIP712 } from './isEIP712';





export function areMessageRequestParamsValid(requestParams: any): boolean {
  const isArray = Array.isArray(requestParams);
  const firstItemIsString = typeof requestParams?.[0] === 'string';
  const secondItemIsStringOrEIP712 = typeof requestParams?.[1] === 'string' || isEIP712(requestParams?.[1]);

  return isArray && firstItemIsString && secondItemIsStringOrEIP712;
}
