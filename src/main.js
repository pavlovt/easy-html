const defs = require('./defs').lex
const parser = require('./rules').parse
const builder = require('./build')
// console.log(parser);
const txt = `
div.row.zz.zz1 @art="as fsds !$#@" :zz=qq qqq class="[{c1:q1}, c2, c3]" style="background-color: white; color: black;" .{
    span.zz .{}.
    span.zz1 .{}.
}.
span .{
    {{data.title}}
}.
''qqq qqq''
`;
let res = parser(txt);
console.log(JSON.stringify(res, null, "\t"))
if (res.lexErrors.length === 0 && res.parseErrors.length === 0) console.log(builder(res.cst));

// generate the html based on the parsers' result
function htmlElement(data) {
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