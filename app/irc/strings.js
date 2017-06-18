export default {
    map: {
        "JOIN": "{prefix} has joined {target}",
        "PART": "{prefix} has left {target} ({args})",
        "MODE": "{prefix} has set mode {target} {args}"
    },
    
    formatedStringFor(command) {
        return  this.map[(command || '').toUpperCase()];
    },

    formatString({ command, prefix, target, args }) {
        let formatstr = this.formatedStringFor(command)
        if (!formatstr) return null;

        return formatstr.replace('{prefix}', prefix || '')
            .replace('{target}', target || '')
            .replace('{args}', (args || []).join(' '))
            .replace('{command}', command);
    },
}