/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';

const external = [
  // 'rxjs',
  // 'rxjs/operators',
  'react',
  'react-dom',
  'CrafterCMSNext',
  'prettier',
  'prettier/standalone',
  '@prettier/plugin-xml',
  '@prettier/plugin-xml/src/plugin',
  'chevrotain',
  'fast-xml-parser',
  '@uppy/core',
  '@uppy/xhr-upload',
  '@uppy/utils/lib/getDroppedFiles',
  '@uppy/progress-bar',
  '@uppy/form',
  '@uppy/utils/lib/toArray',
  '@uppy/core/src/style.scss',
  '@uppy/progress-bar/src/style.scss',
  '@uppy/file-input/src/style.scss'
];

const globals = {
  // 'rxjs': 'window.CrafterCMSNext.rxjs',
  // 'rxjs/operators': 'window.CrafterCMSNext.rxjs.operators',
  'react': 'window.CrafterCMSNext.React',
  'react-dom': 'window.CrafterCMSNext.ReactDOM',
  'CrafterCMSNext': 'window.CrafterCMSNext',
  'chevrotain': 'undefined'
};

const plugins = [
  replace({ 'process.env.NODE_ENV': '"production"' }),
  babel({
    exclude: 'node_modules/**',
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    plugins: [
      'babel-plugin-transform-react-remove-prop-types',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining'
    ]
  }),
  resolve({
    preferBuiltins: true,
    browser: true
  }),
  commonjs({
    include: /node_modules/
  }),
  copy({
    targets: [{ src: './bundle.js', dest: '/Users/rart/Workspace/craftercms/3.1.x/crafter-authoring/data/repos/sites/editorial/sandbox/config/studio/plugins/apps/sidebar' }],
    hook: 'writeBundle'
  }),
  image(),
  json()
];

export default [
  {
    input: 'src/plugin.js',
    external,
    output: {
      sourcemap: false,
      name: 'studioPluginSidebar',
      file: 'bundle.js',
      format: 'iife',
      globals
    },
    plugins,
    context: 'this'
  },
];
