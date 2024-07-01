import { EIP712, EIP712TypeDefinitions } from '../types';

function sanitizeObject(object: EIP712['message' | 'domain'], typeDefinition: EIP712TypeDefinitions, types: EIP712['types']): Record<string, unknown> {
  const sanitizedObject: Record<string, unknown> = {};
  typeDefinition.forEach(({ name, type }) => {
    if (object.hasOwnProperty(name)) {
      if (types[type]) {
        sanitizedObject[name] = sanitizeObject(object[name] as Record<string, unknown>, types[type], types);
      } else {
        sanitizedObject[name] = object[name];
      }
    }
  });
  return sanitizedObject;
}

export function sanitizeEIP712(typedMessage: EIP712): EIP712 {
  const primaryTypeDefinition = typedMessage.types[typedMessage.primaryType] || [];

  return {
    types: typedMessage.types,
    primaryType: typedMessage.primaryType,
    domain: sanitizeObject(typedMessage.domain, typedMessage.types.EIP712Domain, typedMessage.types),
    message: sanitizeObject(typedMessage.message, primaryTypeDefinition, typedMessage.types),
  };
}
