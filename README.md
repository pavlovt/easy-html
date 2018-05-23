
# Easy to write and understand templating language
Simple template language which can be converted to html. It is intended to be used with Vue or Angular.

## Installation
Check the [Webpack integration](https://github.com/pavlovt/easy-html-webpack-loader) for more details.


## Description
The main idea is to be able to write clear and readable code because html contains too much boilerplate and it is very hard to understand its meaning.

The language is able to convert this:
```
.row {
    .col {
        form {
            .form-group {
                label  { 'Email address' }
                input.form-control type=email placeholder="Enter email" {}
            }
            .form-group {
                label  { 'Password' }
                input.form-control type=password placeholder=Password {}
            }
            button.btn.btn-primary type=submit { 'Submit' }
        }
    }
}
```
into this:
```html
<div class="row">
    <div class="col">
        <form>
            <div class="form-group">
                <label>Email address</label>
                <input type="email" class="form-control" placeholder="Enter email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</div>
```
## Language Rules
- This is a standard html without the boilerplate - it is not a completely different language
- There are four possible elements: html element, text, comment or [macros](macros.md)
### HTML element rules
- The html element always ends with {} and inside are all elements or text it contains
- The html element may be written explicitely (div.row {}) or implicitely (.row {}) in this case it will be assumed that the element is div (in both cases the result will be: <div class="row"></div>)
- The html element may have classes added directly to the element (div.some-class {}) or as class attribute (div class=some-class {}) or even both of them
- The html element may have attributes. If the attribute value does not contain space you can write it without double quotes (div id=my-id {}) (div style="width: 100%; padding: 0;" {})
### Text rules
- Text is always inside single quotes (if you want to use single quote inside it you need to write it as \\' - e.g. 'my name is \\'John\\' ')
### Comment rules
You may use line comments
```
// comment
.row {}
```
or block comments
```
/*
  comment
 */
.row {}
```
both of them will be converted to:
```html
<!-- line comment -->
<div class="row"></div>
```

## Why another template language?
Why create another template language when we have others like [jade](http://jade-lang.com/) and [pug](https://github.com/pugjs/pug)?

For me the difference between pug and easy-html is like the difference between sass and scss - being able to explicitely define where the code block ends makes a huge difference in readability and maintainability.

The language will not have any logical constructs (like "if", "foreach") because it is aimed to be used with Vue or Angular but macros can be used to overcome Angular 2+ limitations (for example transferring multiple attributes to an inner element without defining each one of them).

## Usage
The best way to use easy-html is in integration with [Webpack](https://github.com/pavlovt/easy-html-webpack-loader) but it can also be used directly:
```js
const parser = require('easy-html')
const ret = parser(`.row {}`)
// will output: <div class="row"></div>
console.log(ret)
```

Please read the [Webpack integration](https://github.com/pavlovt/easy-html-webpack-loader) for more details on how to use it with Angular or Vue.

## Syntax highlighting
There are basic syntax highlighters for [Sublime Text 3](https://github.com/pavlovt/easy-html-sublime-syntax) and [Visual Studio Code](https://github.com/pavlovt/easy-html-vscode-syntax)


## License

MIT (http://www.opensource.org/licenses/mit-license.php)