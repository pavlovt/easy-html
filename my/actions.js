"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step3b_adding_actions_embedded.md

// Tutorial Step 3:

// Adding a actions(semantics) embedded in the grammar.
// This is the highest performance approach, but its also verbose and none modular
// Therefore using the CST Visitor is the recommended approach:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/src/step3a_actions_visitor.js

const selectLexer = require("./defs")
const Parser = require("chevrotain").Parser
const t = selectLexer.tokenVocabulary
// console.log('zzzzzzzzzzzzzzzzzzzzz', t);
// ----------------- parser -----------------
class SelectParserEmbedded extends Parser {
    constructor(input) {
        super(input, t)
        const $ = this

        /*this.expression = $.RULE("expression", () => {
            let lhs, operator, rhs

            lhs = $.CONSUME(t.str).image
            operator = $.CONSUME(t.class).image

            return {
                type: "EXPRESSION",
                el: lhs,
                cls: operator,
            }
        })*/

        this.grps = $.RULE('grps', () => {
            let c = []
            $.MANY(() => {
                c.push($.SUBRULE($.grp))
            })

            return c;
        })

        this.grp = $.RULE('grp', () => {
            let el, classes, attrs, content
            el = $.CONSUME(t.str).image
            $.OPTION(() => {
                classes = $.SUBRULE($.cls)
            })
            $.CONSUME(t.lcurly)
            content = $.SUBRULE($.grps)
            $.CONSUME(t.rcurly)

            return {el, classes, content};
        })

        this.cls = $.RULE('cls', () => {
            let c = []
            $.MANY(() => {
                c.push($.CONSUME(t.class).image.replace('.', ''))
            })

            return c;
        })

        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self analysis phase.
        Parser.performSelfAnalysis(this)
    }
}

// We only ever need one as the parser internal state is reset for each new input.
const parserInstance = new SelectParserEmbedded([])

module.exports = {
    toAst: function(inputText) {
        const lexResult = selectLexer.lex(inputText)

        // ".input" is a setter which will reset the parser's internal's state.
        parserInstance.input = lexResult.tokens

        // No semantic actions so this won't return anything yet.
        const ast = parserInstance.grps()

        if (parserInstance.errors.length > 0) {
            // console.log(JSON.stringify(parserInstance.errors, null, "\t"))
            throw Error(
                "parsing errors detected!\n" +
                    parserInstance.errors[0].message
            )
        }

        return ast
    }
}
