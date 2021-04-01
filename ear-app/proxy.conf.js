const PROXY_CONFIG = {
  "/transcriber/": {
    "target": "https://atpazinimas.intelektika.lt/ausis",
    "secure": false
    //"pathRewrite": {"^/transcriber": ""}
  },
  "/status.service/": {
    "target": "https://atpazinimas.intelektika.lt/ausis",
    "secure": false
    //"pathRewrite": {"^/result.provider": ""}
  },
  "/result.service/": {
    "target": "https://atpazinimas.intelektika.lt/ausis",
    "secure": false
  },
  "/status.service/subscribe": {
    "target": "wss://atpazinimas.intelektika.lt/ausis",
    "secure": false,
    "ws": true,
    "logLevel": "debug"
  }
}

module.exports = PROXY_CONFIG;
