# Webpack configuration

## Installation
- Install easy-html
```bash
npm i easy-html --save-dev
```
- Update the webpack configuration:
in webpack.common.js .module.rules (config file may be named differently) add
```javascript
{
  test: /\.ehtml$/,
    use: ['raw-loader',
      {
        loader: "easy-html",
        options: {
          macros: macros,
        }
      }
    ]
  }
```
Options parameter is required only if you are going to use macros (objects, containing methods which return html).
The macros can be added from the project: 
```javascript
const macros = require('../src/app/shared/easy-html-macros');
```
For more information on macros check out the [macros](https://github.com/pavlovt/easy-html/macros.md) page.