// proxy.js
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 8080;

app.use(cors());

app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:1234", // LM Studio API
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // /api/completions → /completions
    },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy for chat bot is running at http://localhost:${PORT}`);
});
