# Easy to write and understand templating language
Simple template language which can be converted to html. It is intended to be used with Vue or Angular.

## Installation
Check the [webpack or parcel installation](https://github.com/pavlovt/easy-html/webpack.md)


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
## Rules
- There are three possible elements: html element, text or [macros](macros.md)
- The html element always ends with {} and inside are all elements or text it contains
- Text is always inside single quotes
- The html emenet may have classes added directly to the element (div.some-class {}) or as class attribute (div class=some-class {})
- The html element may have attributes. If the attribute value does not contain space you can write it without double quotes (div id=my-id {}) (div style="width: 100%; padding: 0;" {})

## Why another template language?
Why create another template language when we have others like [jade](http://jade-lang.com/) and [pug](https://github.com/pugjs/pug)?

From my point of view python-like languages look simple but actually are very hard to read and understand. And you can never be sure where the code block ends :)

For me the difference between pug and easy-html is like the difference between sass and scss (guess why no one uses sass :))

The language will not have any logical constructs (like "if", "foreach") because it is aimed to be used with Vue or Angular.

The language is not ready yet but I am working actively on it.