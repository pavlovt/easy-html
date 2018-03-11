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

const LCurly = tok({name: "lcurly", pattern: /{/});
const RCurly = tok({name: "rcurly", pattern: /}/});
const LSquare = tok({name: "lsquare", pattern: /\[/});
const RSquare = tok({name: "rsquare", pattern: /]/});
const Comma = tok({name: "comma", pattern: /,/});
const Colon = tok({name: "colon", pattern: /:/});
const Semicolon = tok({name: "semicolon", pattern: /;/});

const eq = tok({name: 'eq', pattern: /=/});
const dot = tok({name: 'dot', pattern: /\./});
const hash = tok({name: 'hash', pattern: /#/});
const str = tok({name: 'str', pattern: /[\w\d-]*/});
const style = tok({name: 'style', pattern: /style/});
const quote = tok({name: 'quote', pattern: /"/});

const space = tok({
name: "WhiteSpace",
pattern: /\s+/,
group: Lexer.SKIPPED,
line_breaks: true
});

// The order of tokens is important
const allTokens = [
space, RCurly, LCurly,
LSquare, RSquare, Comma, Colon, Semicolon, eq, hash, quote, str
]

const SelectLexer = new Lexer(allTokens)

allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
})

module.exports = {
    tokenVocabulary: tokenVocabulary,

    lex: function(inputText) {
        const lexingResult = SelectLexer.tokenize(inputText)

        if (lexingResult.errors.length > 0) {
            console.log(JSON.stringify(lexingResult.errors, null, "\t"))
            throw Error("lexing errors detected")
        }

        return lexingResult
    }
}
