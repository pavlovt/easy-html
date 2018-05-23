const defs = require('./defs').lex
const parser = require('./rules').parse
const builder = require('./build')
const macros = require('./example-macros')
// console.log(parser);
let txt = `
'zzz\\' "zz": zz'
/*
    Big comment
 */
div.row {
    div.col {
        form :submit=submit() {
            input type=number v-model=zzz :class="[{q: 'zz'}, zz, dd]" {}
            !input e-type=number e-v-model=zzz label="qq" l-class="lc" w-class="wc" e-class="ec" e-name="zzz" {
                !input e-type=number e-v-model=zzz label="qq" l-class="lc" w-class="wc" e-class="ec" e-name="zzz" {
                    'Show me!'
                }
            }
            // line comment
            select.tst-z [(*ngModel)] v="l'l ll lll" {
                option v-for="v in options" :value="v.id" {
                    'title: {{v.title}}'
                }
            }

            button.btn.btn-primary { 'Submit' }
        }
    }
}
`;
console.log(txt)
let res = parser(txt);
console.log(JSON.stringify(res, null, "\t"))
if (res.lexErrors.length === 0 && res.parseErrors.length === 0) console.log(builder(res.cst, {macros}));

// generate the html based on the parsers' result
/*function htmlElement(data) {
    let res = '', cls, tmp
    data.forEach((el) => {
        if (el.text) res += el.text.join(' ')
        else {
            tmp = el.attrs.find((v) => v.lhs === 'class')
            // we may have div.z class="zz zzz"> i.e. we have to join the classes from both places
            cls = tmp ? tmp.rhs.concat(el.classes).join(' ') : el.classes;
            res += `<${el.el} `
            if (cls.length > 0) res += ` class="${cls}"`
            el.attrs.filter(v => v.lhs !== 'class').forEach(v => {
                res += ` ${v.lhs}`
                if (v.rhs.length > 0) res += `="${v.rhs.join(' ')}"`
                
            })
            res += `>`
            res += htmlElement(el.content)
            res += `</${el.el}>\n`
        }
    })

    return res;
}



// console.log(JSON.stringify(defs(txt), null, "\t"))
// const parser = require("./actions").toAst
/*const lex = require("../step1_lexing/step1_lexing").lex

const inputText = "SELECT column1 FROM table2"
const lexingResult = lex(inputText)
console.log(JSON.stringify(lexingResult, null, "\t"))

/*let inputText = "SELECT column1, column2 FROMz table2 WHERE column2 > 3"

// let astFromVisitor = toAstVisitor(inputText)
let res = parser(inputText)

console.log(JSON.stringify(res null, "\t"))

/*assert.deepEqual(
    astFromVisitor,
    astFromEmbedded,
    "Both ASTs should be identical"
)
*/

/*txt = `
article.col-4 .{
    h2 .{ {{data.name}} }.
    p.desc .{ {{data.desc}} }.
    span .{
      ''fb: '' {{data.fb}}
    }.
    span .{
      ''tweet: '' {{data.tweet}}
    }.
    button.btn.btn-info @click=fb .{ ''fb'' }.
    button.btn.btn-info @click=tweet .{ ''tweet'' }.
    footer .{ {{data.author}} }.
  }.
`*/
/*txt = `
div .{
    div.alert.alert-info role=alert .{
      section.row .{
        art v-for="art in articles" :key=art.name :data=art .{}.
      }.
    }.
  }.
`*/
