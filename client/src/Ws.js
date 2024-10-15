const WS_MODE = {
  MESSAGE: "MESSAGE",
  HEARTBEAT: "HEARTBEAT",
};

class Ws extends WebSocket {
  constructor(url, wsReConnect) {
    super(url);
    this.wsUrl = url;
    this.heartBeatTimer = null;
    this.reconnectTimer = null;
    this.wsReConnect = wsReConnect;

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.addEventListener("open", this.handleOpen, false);
    this.addEventListener("close", this.handleClose, false);
    this.addEventListener("error", this.handleError, false);
    this.addEventListener("message", this.handleMessage, false);
  }

  handleOpen() {
    console.log("---Client is connected---");
    this.startHeartbeat();
  }

  handleClose() {
    console.log("---Client is closed---");
    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer);
      this.heartBeatTimer = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.reconnect();
  }

  handleError(e) {
    console.log("---Client ocurred error---", e);

    this.reconnect();
  }

  handleMessage({ data }) {
    const { mode, msg } = this.receiveMessage(data);

    switch (mode) {
      case WS_MODE.MESSAGE:
        console.log("---MESSAGE---", msg);
        break;
      case WS_MODE.HEARTBEAT:
        console.log("---HEART BEAT---", data);
        break;
      default:
        break;
    }
  }

  startHeartbeat() {
    this.heartBeatTimer = setInterval(() => {
      if (this.readyState === WebSocket.OPEN) {
        this.sendMessage({
          mode: WS_MODE.HEARTBEAT,
          msg: "heartbeat",
        });
      } else {
        clearInterval(this.heartBeatTimer);
        this.heartBeatTimer = null;
      }

      this.waitForResponse();
    }, 4000);
  }

  reconnect() {
    this.reconnectTimer = setTimeout(() => {
      this.wsReConnect();
    }, 3000);
  }

  waitForResponse() {
    setTimeout(() => {
      try {
        this.close();
      } catch (e) {
        console.log("---Client is Closed---", e);
      }
    }, 2000);
  }

  receiveMessage(data) {
    return JSON.parse(data);
  }

  sendMessage(data) {
    if (this.readyState === WebSocket.OPEN) {
      this.send(JSON.stringify(data));
    }
  }

  static create(url, wsReConnect) {
    return new Ws(url, wsReConnect);
  }
}

export default Ws;
