# Scafront - scaffolding generator

**Beta version**

Minimal front-end scaffolding generator library.

## Required

NodeJS >=0.12

## Install

```shell
npm install scafront --save-dev
```

## Usage

gen.js

```js
var Scafont = require('scafront');
var scaf = new Scafont();
scaf.prompt({
    // inquirer options
}).prompt({
    // inquirer options
}).exec(function() {
    // done
});
```

```shell
node gen.js
```

More information of [inquirer options](https://github.com/SBoudrias/Inquirer.js/)

## Public API

### scaf.prompt(options)

`inquirer's prompt` wrapper

```
@return Scafront Object
```

### scaf.exec

Execute prompts

```
@return Scafront Object
```

### scaf.generate(input, output, data);

Generate file from template file.

```
@param input - template file path
@param output - export path of generated file
@param data - template params

@return Promise
```

### scaf.append(input,str);

Appending text to file.

```
@param input - file path
@param str - appending text

@return Promise
```

### scaf.clear();

Clear prompts

### scaf.all([]);

`Promise.all()` alias

```
@param [] - Array(Promise,Promise...)
@return Promise
```

## test

```shell
npm test
```

## LICENSE

The MIT License (MIT)

Copyright (c) 2015 frontainer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.