const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/channels/id", {
      target: "https://open-api.trovo.live/openplatform",
      secure: false,
      changeOrigin: true,
    })
  );
};
