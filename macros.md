# Macros

The macros are simple user defined functions which replace the initial code in easy html with custom one in the generated html. The macros are provided in the [Webpack](https://github.com/pavlovt/easy-html-webpack-loader) config. The macros name starts with '!' followed by the function name and all the attributes are provided as arguments to this function (if in the code you have written '!input a=1 b=2 {}' then easy html will search for a macros named 'input' and execute it with argumernts: {attrs: {a:1, b:2}}). Each macros may contain easy html code or another macros.

For example if you have this easy html code:
```
div.row {
    div.col {
        form :submit=submit() {
            !input e-type=number e-v-model=zzz label="qq" l-class="lc" w-class="wc" e-class="ec" e-name="zzz" {}
        }
   }
}   
```
and [this macros](src/example-macros.js) the resulting html will be:
```html
<div class="row">
	<div class="col">
		<form>
			<div class="form-group"  class="wc">
		        <label class="lc">qq</label>
		        <input type="number" v-model="zzz" class="ec" name="zzz" />
	      </div>
		</form>
	</div>
</div>
```