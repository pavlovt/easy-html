module.exports =  {
	input(data) {
		// console.log('arguments!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', JSON.stringify(data))
		const args = data.attrs;

		return `
			<div class="form-group" ${this.attrs('w-', args)}>
				<label ${this.attrs('l-', args)}>${this.attr('label', args)}</label>
				<input  ${this.attrs('e-', args)} />
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