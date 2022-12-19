/* eslint-disable import/no-anonymous-default-export */
import babel from '@rollup/plugin-babel'
import external from 'rollup-plugin-peer-deps-external'
import del from 'rollup-plugin-delete'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import url from '@rollup/plugin-url'
import pkg from './package.json'
import image from '@rollup/plugin-image'
import json from '@rollup/plugin-json'

export default [
  {
    input: 'src/global/index.js',
    output: [
      {
        file: 'global/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'global/index.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      external(),
      postcss({
        extract: false,
        modules: true,
        use: ['sass'],
      }),
      image(),
      url(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs(),
      json(),
      del({ targets: ['global/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
]
