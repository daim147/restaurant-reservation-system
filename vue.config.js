module.exports = {
  // Generate source maps for better debugging
  configureWebpack: {
    devtool: 'source-map',
  },

  // Set up API proxy to avoid CORS issues
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
        logLevel: 'debug',
      },
    },
  },
};
