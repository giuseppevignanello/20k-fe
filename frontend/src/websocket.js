export const websocket = {
  ws: null,
  isConnected: false,
  eventHandlers: {},

  connect(url) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.isConnected = true;
      console.log("WebSocket connected!");
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type) {
        window.dispatchEvent(
          new CustomEvent(message.type, {
            detail: message,
          })
        );
      }
    };
  },

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open.");
    }
  },
};

export default websocket;
