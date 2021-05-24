//const url = "list.airenas.eu:7080/ausis";
const url = "atpazinimas.intelektika.lt/ausis"
const https = "s"
const server = "http" + https + "://" + url;
const wssserver = "ws" + https + "://" + url;

const PROXY_CONFIG = {
  "/transcriber/": {
    "target": server,
    "secure": false
    //"pathRewrite": {"^/transcriber": ""}
  },
  "/status.service/": {
    "target": server,
    "secure": false
    //"pathRewrite": {"^/result.provider": ""}
  },
  "/result.service/": {
    "target": server,
    "secure": false
  },
  "/status.service/subscribe": {
    "target": wssserver,
    "secure": false,
    "ws": true,
    "logLevel": "debug"
  }
}

module.exports = PROXY_CONFIG;
