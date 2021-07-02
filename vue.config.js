let publicPath = process.env.NODE_ENV === 'production' ? 'light-blue-vue-admin/' : '/';

module.exports = {
  publicPath,
  productionSourceMap: false,
  devServer: {
    "port": 3000,
    "proxy": {
      "/api": {
        "target": "http://localhost:4000",
        "changeOrigin": true
      }
    }
  }
};
