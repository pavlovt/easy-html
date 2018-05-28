const parser = require('./rules').parse
const builder = require('./build')

/**
 * Converts easy-html to html
 * @param {String} content easy-html content
 * @param {Object} options options given in the webpack or brunch config files (providing macros, etc.)
 * @return {Object} {res, content} - 'res' is the parsing result and 'content' is the generated html
 */
function loader(content, options) {
  const res = parser(content)

  var ret = {res: res}
  if (res.lexErrors.length === 0 && res.parseErrors.length === 0) ret.content = builder(res.cst, options)
  else {
    var r = 'Error parsing the template: ' + content;
    try {
    r += `The error is: 
    `;
      r += ret.res.parseErrors[0].message + ' near ' + content.substr(ret.res.parseErrors[0].token.startOffset, 100);
    } catch(err) {}
    
    console.warn(r);
  }

  return ret
}

// return just the loader but add the parser and the builder in case that they are needed
loader.parser = parser
loader.builder = builder

module.exports = loader