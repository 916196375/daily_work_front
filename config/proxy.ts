/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-16 10:41:42
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-16 17:26:18
 * @FilePath: \daily-word-front\config\proxy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const proxy: any = {
    development: {
      '/api': {
        target: 'http://localhost:3000', // 服务器
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
    test: {
      '/api': {
        target: 'http://localhost:3000', // 服务器
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
    production: {
      '/api': {
        target: 'http://localhost:3000', // 服务器
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
  }
  export default proxy