import TcpSocket from 'react-native-tcp-socket';

function Socket() {
  this._socket = false;

  this._noDelay = true;

  this._listeners = {};

  this.setTimeout = () => {};
  this.setEncoding = () => {};
  this.setKeepAlive = () => {};

  this.setNoDelay = noDelay => {
    if (this._socket) this._socket.setNoDelay(noDelay);
    this._noDelay = noDelay;
  };

  this.connect = (port, host, callback) => {
    this._socket = TcpSocket.createConnection(
      {
        port,
        host,
        tls: false,
      },
      callback,
    );

    this._socket.on('data', data => {
      this._passOnEvent('data', data);
    });
    this._socket.on('error', data => {
      this._passOnEvent('error', data);
    });
    this._socket.on('close', data => {
      this._passOnEvent('close', data);
    });
    this._socket.on('connect', data => {
      this._passOnEvent('connect', data);
      this._socket.setNoDelay(this._noDelay);
    });
    this._socket.on('connection', data => {
      this._passOnEvent('connection', data);
    });
  };

  this._passOnEvent = (event, data) => {
    this._listeners[event] = this._listeners[event] || [];
    for (const savedListener of this._listeners[event]) {
      savedListener(data);
    }
  };

  this.on = (event, listener) => {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push(listener);
  };

  this.removeListener = (event, listener) => {
    this._listeners[event] = this._listeners[event] || [];
    const newListeners = [];

    let found = false;
    for (const savedListener of this._listeners[event]) {
      if (savedListener === listener) {
        found = true;
      } else {
        newListeners.push(savedListener);
      }
    }

    if (found) {
      this._listeners[event] = newListeners;
    } else {
      this._listeners[event] = [];
    }
  };

  this.end = () => {
    this._socket.end();
  };

  this.destroy = () => {
    this._socket.destroy();
  };

  this.write = data => {
    this._socket.write(data);
  };
}

module.exports.Socket = Socket;
