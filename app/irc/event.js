import _ from 'lodash';


class IRCEvent {

    constructor(obj) {
        this.data = obj;
        this.time = new Date();
    }

    get key() {
        return (
            this.target + "-" + this.source + "-" + this.timeStamp
        );
    }

    get timeStamp() { return this.time.getTime() }

    get type() {
        return this.outbound ? Emitter.TYPE_SENT : Emitter.TYPE_RECEIVED;
    }

    get name() {
        return this.data.command;
    }

    get target() {
        return this.data.target;
    }
    
    get source() {
        return (this.outbound ? "CLIENT" : "SERVER" );
    }

    get outbound() { return this._outbound; }
    set outbound(val) { return this._outbound = val; }
}

IRCEvent.create = function(json, outbound = true) {
    let inst = new this(json);
    inst.outbound = outbound;
    return inst;
};

const Emitter = {
    TYPE_SENT: "sent",
    TYPE_RECEIVED: "received",
    TYPE_ALL: "all",

    events: { "sent": {}, "received": {} },

    addEventListener(name, type, fnct) {
      let events = this.events[type] || {},
           chain = events[name] || [];
      
       chain.push(fnct)
       events[name] = chain;

      this.events[type] = events;
      return this;
    },

    addReceivedEvent(name, fnct) {
        return this.addEventListener(name, this.TYPE_RECEIVED, fnct);
    },

    addSentEvent(name, fnct) {
        return this.addEventListener(name, this.TYPE_SENT, fnct)
    },

    addAllEvent(name, fnct) {
        return this.addEventListener(name, this.TYPE_ALL, fnct);
    },

    eventsForType(type) {
        return this.events[type] || {};
    },

    dispatchEvent(event) {        
      let events = this.events[event.type] || {},
          chain  = events[event.name] || [];
          
      console.log("Event[%s]: Dispatching %s %o", event.type, event.name, event)

      _.forEach(chain, (fnct) => {  fnct(event) });
      
      events = this.events[this.TYPE_ALL] || {},
      // Dispatch "*" Events
      _.forEach(events["*"] || [], (fnct) => { fnct(event) });
    }
}

export {
    IRCEvent,
    Emitter,
};