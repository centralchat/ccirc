
import Channel from 'irc/channel';

class Client {
    constructor({ nick, ident, host, realName, channelPrefix }) {
        this.nick     = nick;
        this.ident    = ident;
        this.realName = realName;
        this.host    = host;
        this.channelPrefix = channelPrefix;
    }

    get channels() {
        return (this._channels = this._channels || {});
    }

    get modes() {
        return (this._modes = this._modes || []);
    }

    get hostMask() {
        return this.nick + "!" + this.ident + "@" + this.hsot;
    }
}

Client.parseNickHost = function(host) {
    if (!host) { return { nick: '' }; }

    let pieces = host.match(/^([^\!\@]+)\!?([^\@]+)\@(.+)$/)
    if (!pieces) { return { nick: host }; }

    return {
        nick: pieces[1],
        ident: pieces[2],
        host: pieces[3],
    }
}

export default Client;