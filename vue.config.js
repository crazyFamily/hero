const path = require('path');
const resolve = dir => {
  return path.join(__dirname, dir)
};
// process.env.NODE_ENV === "production" ? "/project/a22010401/" : "./"
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
            args[0].title= '平安英雄荟'
            return args
            })
        config.resolve.alias.set('@', resolve('src'))
    },
    css: {
      loaderOptions: {
        sass: {
          // 全局引入变量和 mixin
          prependData: `
            @import "@/assets/scss/mixin.scss";
          `
        }
      }
    },
    configureWebpack:{
      externals:{
        'createjs':'createjs'
      }
    }
}
