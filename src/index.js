'use strict';
const parser = require('./rules').parse
const builder = require('./build')

/**
 * Main function
 * @param   {String}  content   jhtml file content
 */
module.exports = function loader(content) {
  const callback = this.async()

  const res = parser(content)

  if (res.lexErrors.length === 0 && res.parseErrors.length === 0) callback(null, builder(res.cst))
  else callback(res.cst)
}