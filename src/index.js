'use strict';
const parser = require('./rules').parse
const builder = require('./build');
const loaderUtils = require("loader-utils");

/**
 * Main function
 * @param   {String}  content   jhtml file content
 */
module.exports = function loader(content, map) {
  const options = loaderUtils.getOptions(this);

  this.cacheable();

  const res = parser(content)

  if (res.lexErrors.length === 0 && res.parseErrors.length === 0) this.callback(null, builder(res.cst, options), map)
  else this.callback(res.cst)
}