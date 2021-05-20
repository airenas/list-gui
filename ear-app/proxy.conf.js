const PROXY_CONFIG = {
  "/transcriber/": {
    "target": "https://list.airenas.eu:7080/ausis",
    "secure": false
    //"pathRewrite": {"^/transcriber": ""}
  },
  "/status.service/": {
    "target": "https://list.airenas.eu:7080/ausis",
    "secure": false
    //"pathRewrite": {"^/result.provider": ""}
  },
  "/result.service/": {
    "target": "https://list.airenas.eu:7080/ausis",
    "secure": false
  },
  "/status.service/subscribe": {
    "target": "wss://list.airenas.eu:7080/ausis",
    "secure": false,
    "ws": true,
    "logLevel": "debug"
  }
}

module.exports = PROXY_CONFIG;
