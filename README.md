# Easy to write and understand templating language
Json-like template language exported to html.

The main idea is to be able to write clear and readable code because html contains too much boilerplate and it is very hard to understand its meaning.

The language should be able to convert this:
```
div.row {
    div.col {
        form :submit=submit() {
            input type=number v-model=zzz

            select.tst-z v-model=choose {
                option v-for="v in options" :value="v.id" {
                    ''title: '' {{v.title}}
                }
            }

            button.btn.btn-primary { ''Submit'' }
        }
    }
}
```
into this:
```html
<div class="row">
    <div class="col">
        <form :submit="submit()">
            <input type="number" v-model="zzz" />
            <select v-model="choose" class="tst">
                <option v-for="v in options" :value="v.id">{{v.title}}</option>
            </select>

            <button class="btn btn-primary">Submit</button>
        </form>
    </div>
</div>
```
## Why another template language?
Why create another template language when we have others like [jade](http://jade-lang.com/) and [pug](https://github.com/pugjs/pug)?

From my point of view python-like languages look simple but actually are very hard to read and understand. And you can never be sure where the code block ends :)

For me the difference between pug and jhtml is like the difference between sass and scss (guess why no one uses sass :))

The language will not have any logical constructs (like "if", "foreach") because it is aimed to be used with Vue.js or Angular.

The language is not ready yet but I am working actively on it.