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
    input: 'src/components/index.js',
    output: [
      {
        file: 'components/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'components/index.js',
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
      del({ targets: ['components/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: 'src/hooks/index.js',
    output: [
      {
        file: 'hooks/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'hooks/index.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      external(),
      postcss({
        modules: false,
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
      del({ targets: ['hooks/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: 'src/utils/index.js',
    output: [
      {
        file: 'utils/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'utils/index.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      external(),
      postcss({
        modules: false,
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
      del({ targets: ['utils/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: 'src/actions/index.js',
    output: [
      {
        file: 'actions/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'actions/index.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      external(),
      postcss({
        modules: false,
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
      del({ targets: ['actions/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: 'src/reducers/index.js',
    output: [
      {
        file: 'reducers/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'reducers/index.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      external(),
      postcss({
        modules: false,
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
      del({ targets: ['reducers/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: 'src/selectors/index.js',
    output: [
      {
        file: 'selectors/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'selectors/index.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      external(),
      postcss({
        modules: false,
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
      del({ targets: ['selectors/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: 'src/pages/index.js',
    output: [
      {
        file: 'pages/index.cjs.js',
        format: 'cjs',
        inlineDynamicImports: true,
        sourcemap: true,
      },
      {
        file: 'pages/index.js',
        format: 'esm',
        inlineDynamicImports: true,
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      external(),
      postcss({
        modules: false,
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
      del({ targets: ['pages/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: 'src/services/index.js',
    output: [
      {
        file: 'services/index.cjs.js',
        format: 'cjs',
        inlineDynamicImports: true,
        sourcemap: true,
      },
      {
        file: 'services/index.js',
        format: 'esm',
        inlineDynamicImports: true,
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      external(),
      postcss({
        modules: false,
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
      del({ targets: ['services/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
]
