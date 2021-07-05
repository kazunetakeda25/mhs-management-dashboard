let publicPath = '/';

module.exports = {
  publicPath,
  productionSourceMap: false,
  devServer: {
    "proxy": {
      "/api": {
        "target": "http://localhost:4000", // "target": "http://45.63.108.165:4000",
        "changeOrigin": true
      }
    }
  }
};
