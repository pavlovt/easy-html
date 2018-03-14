"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step1_lexing.md

// Tutorial Step 1:
// Implementation of A lexer for a simple SELECT statement grammar
const chevrotain = require("chevrotain")
// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {}

const tok = chevrotain.createToken;
const Lexer = chevrotain.Lexer;

const lcurly = tok({name: "lcurly", pattern: /\.{/});
const rcurly = tok({name: "rcurly", pattern: /}\./});
const dlcurly = tok({name: "dlcurly", pattern: /{{/});
const drcurly = tok({name: "drcurly", pattern: /}}/});
// const lsquare = tok({name: "lsquare", pattern: /\[/});
// const rsquare = tok({name: "rsquare", pattern: /]/});
// const comma = tok({name: "comma", pattern: /,/});
// const colon = tok({name: "colon", pattern: /:/});
const semicolon = tok({name: "semicolon", pattern: /;/});

const eq = tok({name: 'eq', pattern: /=/});
const dot = tok({name: 'dot', pattern: /\./});
const hash = tok({name: 'hash', pattern: /\#/});
const str = tok({name: 'str', pattern: /:?@?[\w\d-\(\)\.]+/});
const style = tok({name: 'style', pattern: /style/});
const quote = tok({name: 'quote', pattern: /\"/});
const squote = tok({name: 'squote', pattern: /''/});
const cls = tok({name: 'class', pattern: /\.[\w\d-]+/});
const allbutquote = tok({name: 'allbutquote', pattern: /[^"\s]+/});

const space = tok({
name: "WhiteSpace",
pattern: /\s+/,
group: Lexer.SKIPPED,
line_breaks: true
});

// The order of tokens is important
const allTokens = [
space, rcurly, lcurly, str, cls, drcurly, dlcurly, eq, hash, quote, squote, allbutquote
]

const lexer = new Lexer(allTokens, {
    // Less verbose tokens will make the test's assertions easier to understand
    positionTracking: "onlyOffset"
})

allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
})

module.exports = {
    tokenVocabulary: tokenVocabulary,

    lexer,

    lex: function(inputText) {
        const lexingResult = SelectLexer.tokenize(inputText)

        if (lexingResult.errors.length > 0) {
            // console.log(JSON.stringify(lexingResult.errors, null, "\t"))
            throw Error("lexing errors detected")
        }

        return lexingResult
    }
}
