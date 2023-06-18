/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-11 17:49:17
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-17 11:15:00
 * @FilePath: /daily_work_front/config/config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from '@umijs/max'
import path from 'path'
// import { base, publicPath } from './const'
import routes from './routes'
import proxy from './proxy'
// const IProxy = proxy[`${process.env.REACT_APP_ENV}`]
const IProxy = proxy.development
console.log('IProxy', IProxy)
// const IProxy = proxy.development

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: {
        title: "Daily Work",
        favicons: ['/favicon.png'],

    },
    routes: routes,
    npmClient: "pnpm",
    // tailwindcss: {},
    favicons: ['/favicon.png'],
    // metas: [
    //     { name: 'title', content: 'Auto Ecrf' },
    //     { name: 'keywords', content: 'Auto Ecrf' },
    //     { name: 'description', content: 'Auto Ecrf' },
    // ],
    // outputPath: 'auto_ecrf',
    hash: true,

    dva: {},
    // // layout: {},
    // layout: {
    //     title: "@umijs/max",
    //   },
    // routes: routes,
    proxy:  {
        '/api': {
          'target': 'http://127.0.0.1:3000',
          'changeOrigin': true,
          'pathRewrite': { '^/api' : '' },
        }
      },
    // locale: { antd: true },
    jsMinifier: 'terser',
    jsMinifierOptions: {
        compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
        },
    },
    codeSplitting: {
        jsStrategy: 'granularChunks',
    },
    targets: {
        chrome: 50,
        firefox: 15,
        safari: 12,
        edge: 8,
        ie: 10,
        opera: 10,
    },
    // verifyCommit: false,
    // //   base: base,
    // //   publicPath: publicPath,
    alias: {
        public: '/public',
        types: path.resolve(__dirname, '../types/'),
        config: path.resolve(__dirname, '../config/'),
    },
    define: {
        'process.env.REACT_APP_ENV': process.env.REACT_APP_ENV,
    },
    // extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
})
