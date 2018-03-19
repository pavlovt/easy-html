// generate the html based on the parsers' result
module.exports= function htmlElement(data) {
    let res = '', cls, tmp
    data.forEach((el) => {
        if (el.text) res += el.text.join(' ')
        else {
            tmp = el.attrs.find((v) => v.lhs === 'class')
            // we may have div.z class="zz zzz"> i.e. we have to join the classes from both places
            cls = tmp ? tmp.rhs.concat(el.classes).join(' ') : el.classes.join(' ');
            // console.log('cls', el.el, el.classes, cls);
            res += `<${el.el} `
            if (cls.length > 0) res += ` class="${cls}"`
            el.attrs.filter(v => v.lhs !== 'class').forEach(v => {
                res += ` ${v.lhs}`
                if (v.rhs.length > 0) res += `="${v.rhs.join(' ')}"`
                
            })
            res += `>`
            res += htmlElement(el.content)
            res += `</${el.el}>\n`
        }
    })

    return res;
}