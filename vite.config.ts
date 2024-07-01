import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// import { resolve } from 'path';
import json from '@rollup/plugin-json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // json({
    //   // 该配置可确保 JSON 文件被正确处理并作为独立的模块输出
    //   include: '**/*.json',
    //   exclude: [],
    //   preferConst: true
    // })
  ],
  // resolve: {
  //   alias: {
  //     // 在项目中引用 JSON 文件时的别名，确保路径正确
  //     '@data': resolve(__dirname, 'src/const/data.json')
  //   }
  // }
})
