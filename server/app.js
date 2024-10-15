const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8000 });

server.on("connection", handleConnection);

function handleConnection(ws) {
  console.log("---Server is connected!---");

  ws.on("close", handleClose);
  ws.on("error", handleError);
  ws.on("message", handleMessage);
}

function handleClose() {
  console.log("---Server is closed!---");

  this.send(
    JSON.stringify({
      mode: "MESSAGE",
      msg: "---Server is closed!---",
    })
  );
}

function handleError(e) {
  console.log("---Server is error!---", e);
}

/**
 * {
 *  mode: "MESSAGE" or "HEARTBEAT",
 *  msg: string
 * }
 * @param {*} message
 */
function handleMessage(data) {
  const { mode, msg } = JSON.parse(data);

  switch (mode) {
    case "MESSAGE":
      console.log("---Server is message!---", msg);
      this.send(JSON.stringify(JSON.parse(data)));
      break;
    case "HEARTBEAT":
      console.log("---Server is heartbeat!---", msg);
      this.send(JSON.stringify(JSON.parse(data)));
      break;
    default:
      console.log("---Server is unknown mode!---", mode);
      break;
  }
}
