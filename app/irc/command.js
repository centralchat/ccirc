import Conn from 'irc/connection';
import Me from 'irc/me';

export default {
    register({ nick, ident, realName }) {
        Conn.sendToServer({ command: "NICK", target: nick });
        Conn.sendToServer({ command: "USER", args: [ ident, "0", "*",  realName ] });
    },

    ping({ prefix, target, args }) {
        Conn.sendToServer({ command: "PONG", target:  target, prefix: prefix });
    },

    whoChannel({ target }) {
        Conn.sendToServer({ command: "WHO", target: target });
    },

    join({ target }) {
        Conn.sendToServerRaw({ command: "JOIN", target: target });
    },

    message({ target, message }) {
        Conn.sendToServer({ command: "PRIVMSG", target: target, args: [message], prefix: Me.client.hostMask });
    },

    raw(obj) { Conn.sendToServerRaw(obj) },
 
    processRaw(target, value) {
        if (value[0] == '/') {
          let args    = value.substr(1).split(' '),
              command = args.shift(),
              trg     = (args[0] || '')[0] == '#' ? args.shift() : target;

          this.raw({ target:  trg, command: command, args: args })
          return;
        }
        this.message({ target: target, message: value })
    },
};