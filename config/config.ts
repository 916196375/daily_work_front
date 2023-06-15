/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-11 17:49:17
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-11 18:54:12
 * @FilePath: /daily_work_front/config/config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from '@umijs/max'
import path from 'path'
// import { base, publicPath } from './const'
// import proxy from './proxy'
import routes from './routes'
// const IProxy = proxy[`${process.env.REACT_APP_ENV}`]

export default defineConfig({
    favicons: ['/favicon.png'],
    metas: [
        { name: 'title', content: 'Auto Ecrf' },
        { name: 'keywords', content: 'Auto Ecrf' },
        { name: 'description', content: 'Auto Ecrf' },
    ],
    outputPath: 'auto_ecrf',
    hash: true,
    antd: {},
    access: {},
    model: {},
    dva: {},
    initialState: {},
    request: {},
    // layout: {},
    routes: routes,
    // proxy: IProxy,
    locale: { antd: true },
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
    verifyCommit: false,
    //   base: base,
    //   publicPath: publicPath,
    alias: {
        public: '/public',
        types: path.resolve(__dirname, '../types/'),
        config: path.resolve(__dirname, '../config/'),
    },
    define: {
        'process.env.REACT_APP_ENV': process.env.REACT_APP_ENV,
    },
    // extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
    npmClient: 'pnpm',
})
