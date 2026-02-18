export const API_URL = process.env.REACT_APP_API_URL;

export const WS_URL = API_URL
  .replace("https", "wss")
  .replace("http", "ws");
