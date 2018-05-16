module.exports =  {
	input(data, bilder, options) {
		// example: data = {"el":"input","classes":[],"content":[],"attrs":[{"lhs":"e-type","rhs":["number"]},{"lhs":"e-v-model","rhs":["zzz"]},{"lhs":"label","rhs":["qq"]},{"lhs":"l-class","rhs":["lc"]},{"lhs":"w-class","rhs":["wc"]},{"lhs":"e-class","rhs":["ec"]},{"lhs":"e-name","rhs":["zzz"]}],"type":"macros"}
		const args = data.attrs;

		return `
			<div class="form-group" ${this.attrs('w-', args)}>
				<label ${this.attrs('l-', args)}>${this.attr('label', args)}</label>
				<input  ${this.attrs('e-', args)} />
				<!-- build the children of the macros if any - they can be a html or another macros -->
				${bilder(data.content, options)}
			</div>
		`;
	},

	// get all attributes with the specified prefix
	attrs(prefix, args) {
		let res = '';
		const len = prefix.length
		args.forEach(v => {
			if (v.lhs.startsWith(prefix)) {
				// remove the prefix
				res += ` ${v.lhs.substr(prefix.length)}`
	      if (v.rhs.length > 0) res += `="${v.rhs.join(' ')}"`
			}
		})

		return res;
	},

	// get the value of a single attribute
	attr(prop, args) {
		res = args.find(v => v.lhs == prop);

		return res && res.rhs.join(' ');
	}
}