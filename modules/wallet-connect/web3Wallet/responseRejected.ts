export const responseRejected = (id: number) => ({ id, jsonrpc: '2.0', error: { code: 5000, message: 'User rejected' } });
