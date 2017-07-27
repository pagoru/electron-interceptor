This module is a simple `file` protocol interceptor for [electron](https://github.com/atom/electron) which compiles all (local) URLs to files with any extension to whatever you want.

[![npm version](https://badge.fury.io/js/electron-interceptor.svg)](https://www.npmjs.com/package/electron-interceptor) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# Installation

```
npm install electron-interceptor

```

# Usage
```js
const {BrowserWindow, app} = require('electron');

const pug = require('pug');
const less = require('less');

require('electron-interceptor')([
    //Example with `.pug` extension to html
    {
        extension: '.pug',
        mimeType: 'text/html',
        exec: (content, callback) => {
            callback(pug.render(content.toString(), {}));
        }
    },
    //Example with `.less` extension to css
    {
        extension: '.less',
        mimeType: 'text/css',
        exec: (content, callback) => {
            less.render(content.toString(), (error, compiled) => {
                if(error){
                    callback(error);
                    return;
                }
                callback(compiled.css);
            });
        }
    }
    //...
]);
```