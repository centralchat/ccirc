
class Message {
    constructor(jsonHsh) { 
        this.content = jsonHsh; 
        this.time    = new Date();
    }

    get key() {
        return (
            this.target + "-" + (this.prefix || 'prefix') + "-" + (this.timeStamp + Math.random())
        );
    }

    get timeStamp() { return this.time.getTime() }

    get prefix() { return this.content.prefix; }
    get target() { return this.content.target; }
    get args()   { return this.content.args || []; } 
    get command() { return this.content.command; }   

    get targetType() {
        return Message.messageType(this.target)
    }

    get prefixType() {
        return Message.messageType(this.prefix)
    }

    isNumeric() {
        return (!!(this.command.match(/^\d{3}$/)));
    }

    isServer() {
        if (!this.target)
            return true;
            
        if (this.isNumeric())
            return true;

        if (this.target == "*")
            return true;

        return this.targetType == "SERVER";
    }
}

Message.messageType = function(trgt) {
   // If this is a valid server
    let target = trgt || '';
    if (target.indexOf('.') >= 0)
        return "SERVER";
    if (target.indexOf('#'))
        return "CHANNEL";
    return "NICK"
}

export default Message;