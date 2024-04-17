import TcpSocket from 'react-native-tcp-socket';

function connect(config, callback) {
  const client = TcpSocket.createConnection(
    {
      port: config.port,
      host: config.host,
      tls: true,
      tlsCheckValidity: true,
    },
    callback,
  );

  this._noDelay = true;

  client.setTimeout = () => {};
  client.setEncoding = () => {};
  client.setKeepAlive = () => {};

  const realSetNoDelay = client.setNoDelay;
  client.setNoDelay = noDelay => {
    this._noDelay = noDelay;
  };

  client.on('connect', () => {
    realSetNoDelay.apply(client, [this._noDelay]);
  });

  return client;
}

module.exports.connect = connect;
