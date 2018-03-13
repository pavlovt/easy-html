const defs = require('./defs').lex
const parser = require('./actions').toAst
// console.log(parser);
const txt = `
div.row.zz.zz1 {
    span.zz {}
    span.zz1 {}
}
span.zz {}
`;
let res = parser(txt);
console.log(JSON.stringify(res, null, "\t"))
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