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
                   {ALT: () => c.push({space: $.CONSUME5(t.space).image})},
                   // get the line comment
                   {ALT: () => c.push({comment: ['<!--', $.CONSUME5(t.linecom).image.substr(2), '-->']})},
                   // multiline comment
                   {ALT: () => {
                        c.push({comment: $.SUBRULE($.comment)})
                   }},
                ])
            })

            return c;
        })

        // html element
        this.grp = $.RULE('grp', () => {
          // console.log('element')
            let el, classes, attrs, content, type = 'element'
            el = $.CONSUME(t.str).image
            // the element starts with class: .row instead of div.row
            // in this case add the defau;lt element - div
            if (el[0] === '.') el = 'div' + el
            // this is a macros
            if (el[0] === '!') {
              type = 'macros'
              el = el.substr(1)
            }

            // check if there are classes: div.class1.class2
            el = el.split('.')
            // separate the classes
            classes = el.splice(1, el.length-1)
            // leave only the element
            el= el[0]

            $.OPTION(() => {$.CONSUME(t.space)})

            $.OPTION1(() => {
                attrs = $.SUBRULE($.attrs)
            })

            $.OPTION2(() => {$.CONSUME1(t.space)})

            $.CONSUME(t.lcurly)
            content = $.SUBRULE($.grps)
            $.CONSUME(t.rcurly)

            return {el, classes, content, attrs, type};
        })

        this.text = $.RULE('text', () => {
            let c = []
            $.CONSUME1(t.squote)
            $.MANY(() => {
                $.OR([
                   {ALT: () => c.push($.CONSUME1(t.str).image)},
                   {ALT: () => c.push($.CONSUME2(t.allbutquote).image)},
                   {ALT: () => {$.CONSUME3(t.esquote); c.push("'")}},
                   {ALT: () => c.push($.CONSUME4(t.quote).image)},
                   {ALT: () => c.push($.CONSUME5(t.eq).image)},
                   {ALT: () => c.push($.CONSUME6(t.lcurly).image)},
                   {ALT: () => c.push($.CONSUME7(t.dlcurly).image)},
                   {ALT: () => c.push($.CONSUME5(t.rcurly).image)},
                   {ALT: () => c.push($.CONSUME5(t.drcurly).image)},
                   {ALT: () => c.push($.CONSUME5(t.space).image)},
                ])
            })
            $.CONSUME2(t.squote)
            return c;
        })

        this.comment = $.RULE('comment', () => {
            let c = []
            $.CONSUME1(t.lcom)
            c.push('<!--')
            $.MANY(() => {
                $.OR([
                   {ALT: () => c.push($.CONSUME1(t.str).image)},
                   {ALT: () => c.push($.CONSUME2(t.allbutquote).image)},
                   {ALT: () => {$.CONSUME3(t.esquote); c.push("'")}},
                   {ALT: () => c.push($.CONSUME4(t.quote).image)},
                   {ALT: () => c.push($.CONSUME5(t.eq).image)},
                   {ALT: () => c.push($.CONSUME6(t.lcurly).image)},
                   {ALT: () => c.push($.CONSUME7(t.dlcurly).image)},
                   {ALT: () => c.push($.CONSUME5(t.rcurly).image)},
                   {ALT: () => c.push($.CONSUME5(t.drcurly).image)},
                   {ALT: () => c.push($.CONSUME5(t.space).image)},
                ])
            })
            $.CONSUME2(t.rcom)
            c.push('-->')
            return c;
        })

        this.expression = $.RULE('expression', () => {
            let c = []
            c.push($.CONSUME1(t.dlcurly).image)
            $.MANY(() => {
                $.OR([
                   {ALT: () => c.push($.CONSUME2(t.str).image)},
                   {ALT: () => c.push($.CONSUME5(t.allbutquote).image)},
                   {ALT: () => $.CONSUME5(t.space)},
                   // {ALT: () => c.push($.CONSUME5(t.class).image)}
                ])
            })
            c.push($.CONSUME2(t.drcurly).image)
            return c;
        })

        /*this.cls = $.RULE('cls', () => {
            let c = []
            $.MANY(() => {
                c.push($.CONSUME(t.class).image.replace('.', ''))
            })

            return c;
        })*/

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
                        // console.log('attr with q')
                            $.OPTION2(() => {$.CONSUME2(t.space)})
                            $.CONSUME1(t.eq)
                            $.OPTION3(() => {$.CONSUME3(t.space)})
                            $.CONSUME3(t.quote)
                            $.MANY2(() => {
                                $.OR2([
                                   {ALT: () => rhs.push($.CONSUME2(t.str).image)},
                                   {ALT: () => rhs.push($.CONSUME5(t.allbutquote).image)},
                                   {ALT: () => rhs.push($.CONSUME(t.lcurly).image)},
                                   {ALT: () => rhs.push($.CONSUME(t.rcurly).image)},
                                   {ALT: () => rhs.push($.CONSUME(t.dlcurly).image)},
                                   {ALT: () => rhs.push($.CONSUME(t.drcurly).image)},
                                   {ALT: () => rhs.push($.CONSUME(t.squote).image)},
                                   {ALT: () => {$.CONSUME5(t.esquote); rhs.push("'")}},
                                   {ALT: () => rhs.push($.CONSUME4(t.space).image)}
                                ])
                            })
                            $.CONSUME4(t.quote)
                       }},
                       // if no quotes the attribute can have only one right hand side value
                       {ALT: () => {
                            // console.log('attr no q')
                            $.OPTION4(() => {$.CONSUME5(t.space)})
                            $.CONSUME2(t.eq)
                            $.OPTION5(() => {$.CONSUME6(t.space)})
                            $.MANY3(() => {
                              $.OR3([
                                 {ALT: () => rhs.push($.CONSUME3(t.str).image)},
                                 {ALT: () => rhs.push($.CONSUME4(t.allbutquote).image)},
                                 {ALT: () => rhs.push($.CONSUME5(t.lcurly).image)},
                                 {ALT: () => rhs.push($.CONSUME5(t.rcurly).image)},
                                 {ALT: () => rhs.push($.CONSUME7(t.dlcurly).image)},
                                 {ALT: () => rhs.push($.CONSUME7(t.drcurly).image)},
                                 {ALT: () => rhs.push($.CONSUME8(t.squote).image)},
                                 {ALT: () => {$.CONSUME9(t.esquote); rhs.push("'")}},
                              ])
                            })
                       }},
                    ])
                })
                $.OPTION(() => {$.CONSUME1(t.space)})

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
        let cst = '';
        try {
            cst = parser.grps()
        } catch(err) {}

        return {
            cst: cst,
            lexErrors: lexResult.errors,
            parseErrors: parser.errors,
            lexResult
        }
    },
}
