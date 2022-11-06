const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:10000/',
        ws: true,
        changeOrigin: true
      }
    }
  },
  chainWebpack: (config) => {
    config
        .plugin('html')
        .tap(args => {
            args[0].title = 'Smart City';
            args[0].meta = {viewport: 'width=device-width,initial-scale=1'};

         return args;
  })
}
});
