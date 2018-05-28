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

const lcurly = tok({name: "lcurly", pattern: /\{/});
const rcurly = tok({name: "rcurly", pattern: /\}/});
const dlcurly = tok({name: "dlcurly", pattern: /\{\{/});
const drcurly = tok({name: "drcurly", pattern: /\}\}/});
// const lsquare = tok({name: "lsquare", pattern: /\[/});
// const rsquare = tok({name: "rsquare", pattern: /]/});
// const comma = tok({name: "comma", pattern: /,/});
// const colon = tok({name: "colon", pattern: /:/});
// const semicolon = tok({name: "semicolon", pattern: /;/});
// const dot = tok({name: 'dot', pattern: /\./});
// const hash = tok({name: 'hash', pattern: /\#/});
const cls = tok({name: 'class', pattern: /\.[\w\d-]+/});

const eq = tok({name: 'eq', pattern: /=/});
// holds elements and classes
const str = tok({name: 'str', pattern: /:?@?[\w\d-\(\)\[\]\*\.!]+/});
const style = tok({name: 'style', pattern: /style/});
const quote = tok({name: 'quote', pattern: /"/});
// escaped double quote
const equote = tok({name: 'equote', pattern: /\\"/});
const squote = tok({name: 'squote', pattern: /'/});
// escaped single quote
const esquote = tok({name: 'esquote', pattern: /\\'/});
/*const esquote = tok({name: 'esquote', pattern: (text, pos) => {
    console.log('txt', text.substr(pos,2), text.substr(pos,2) == "\'" ? [text] : null)
    return text.substr(pos,2) == "\\'" ? [text.substr(pos,2)] : null
}});*/
const allbutquote = tok({name: 'allbutquote', pattern: /[^"'\s]+/});
const linecom = tok({name: 'linecom', pattern: /\/\/.*/});
const lcom = tok({name: 'lcom', pattern: /\/\*/});
const rcom = tok({name: 'rcom', pattern: /\*\//});

const space = tok({
name: "space",
pattern: /\s+/,
// group: Lexer.SKIPPED,
line_breaks: true
});

// The order of tokens is important
const allTokens = [
linecom, lcom, rcom, space, drcurly, dlcurly, rcurly, lcurly, eq, equote, quote, esquote, squote, str, allbutquote
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
