"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step3b_adding_actions_embedded.md

// Tutorial Step 3:

// Adding a actions(semantics) embedded in the grammar.
// This is the highest performance approach, but its also verbose and none modular
// Therefore using the CST Visitor is the recommended approach:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/src/step3a_actions_visitor.js

const lexer = require("./defs")
const Parser = require("chevrotain").Parser
const t = lexer.tokenVocabulary
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
                $.OR([
                    // if there are quotes then execute this
                   {ALT: () => {
                        c.push($.SUBRULE($.grp))
                   }},
                   // if no quotes the attribute can have only one right hand side value
                   {ALT: () => {
                        c.push({text: $.SUBRULE($.text)})
                   }},
                   // if there is an expression like: {{data.title}}
                   {ALT: () => {
                        c.push({text: $.SUBRULE($.expression)})
                   }},
                ])
            })

            return c;
        })

        this.grp = $.RULE('grp', () => {
            let el, classes, attrs, content
            el = $.CONSUME(t.str).image
            classes = $.SUBRULE($.cls)
            $.OPTION(() => {
                attrs = $.SUBRULE($.attrs)
            })
            $.CONSUME(t.lcurly)
            content = $.SUBRULE($.grps)
            $.CONSUME(t.rcurly)

            return {el, classes, content, attrs};
        })

        this.text = $.RULE('text', () => {
            let c = []
            $.CONSUME1(t.squote)
            $.MANY(() => {
                $.OR([
                   {ALT: () => c.push($.CONSUME2(t.str).image)},
                   {ALT: () => c.push($.CONSUME5(t.allbutquote).image)}
                ])
            })
            $.CONSUME2(t.squote)
            return c;
        })

        this.expression = $.RULE('expression', () => {
            let c = []
            c.push($.CONSUME1(t.dlcurly).image)
            $.MANY(() => {
                $.OR([
                   {ALT: () => c.push($.CONSUME2(t.str).image)},
                   {ALT: () => c.push($.CONSUME5(t.allbutquote).image)}
                ])
            })
            c.push($.CONSUME2(t.drcurly).image)
            return c;
        })

        this.cls = $.RULE('cls', () => {
            let c = []
            $.MANY(() => {
                c.push($.CONSUME(t.class).image.replace('.', ''))
            })

            return c;
        })

        this.attrs = $.RULE('attrs', () => {
            let c = [], res;
            res = $.MANY1(() => {
                let rhs = [], lhs

                lhs = $.CONSUME1(t.str).image
                // right hand side is not required
                $.OPTION1(() => {
                    $.OR1([
                        // if there are quotes then execute this
                       {ALT: () => {
                            $.CONSUME1(t.eq)
                            $.CONSUME3(t.quote)
                            $.MANY2(() => {
                                $.OR2([
                                   {ALT: () => rhs.push($.CONSUME2(t.str).image)},
                                   {ALT: () => rhs.push($.CONSUME5(t.allbutquote).image)}
                                ])
                            })
                            $.CONSUME4(t.quote)
                       }},
                       // if no quotes the attribute can have only one right hand side value
                       {ALT: () => {
                            $.CONSUME2(t.eq)
                            $.OR3([
                               {ALT: () => rhs.push($.CONSUME6(t.str).image)},
                               {ALT: () => rhs.push($.CONSUME7(t.allbutquote).image)}
                            ])
                       }},
                    ])
                })

                return {lhs, rhs}
            })

            return res;
        })


        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self analysis phase.
        Parser.performSelfAnalysis(this)
    }
}

// We only ever need one as the parser internal state is reset for each new input.
const parser = new SelectParserEmbedded([])

module.exports = {
    toAst: function(inputText) {
        const lexResult = selectLexer.lex(inputText)

        // ".input" is a setter which will reset the parser's internal's state.
        parser.input = lexResult.tokens

        // No semantic actions so this won't return anything yet.
        const ast = parser.grps()

        if (parser.errors.length > 0) {
            // console.log(JSON.stringify(parserInstance.errors, null, "\t"))
            throw Error(
                "parsing errors detected!\n" +
                    parser.errors[0].message
            )
        }

        return ast
    },

    parse: function parse(text) {
        const lexResult = lexer.lexer.tokenize(text)

        // setting a new input will RESET the parser instance's state.
        parser.input = lexResult.tokens

        // any top level rule may be used as an entry point
        const cst = parser.grps()

        return {
            cst: cst,
            lexErrors: lexResult.errors,
            parseErrors: parser.errors,
            lexResult
        }
    },
}
