
import Conn from 'irc/connection';
import {Emitter, IRCEvent} from 'irc/event';

import IRCCommand from 'irc/command';

import Numeric from 'irc/numeric';

import Client from 'irc/client';
import Channel from 'irc/channel';

import Buffer from 'irc/buffer';


class Me {
    constructor(nick = 'ccIRC') {
        this.channels = {};
        
        // Direct Messages
        this.messages = {};

        this.client = new Client({ 
            nick:  'ccIRC',
            ident: 'ccIRC',
            realName: 'ccIRC User',
            host: '',
        });
        
        // Stub
        this.server  = { name: "irc.centralchat.net" }

        this.buffer = new Buffer();

        this.bindEvents()
    }


    join(chanName, updater) {
      let chan = this.channels[chanName];
      if (chan) return chan;

      // TODO: Check valid names
      chan = new Channel(chanName)
      this.channels[chanName] = chan;

      IRCCommand.join({ target: chanName })

      return chan;
    }

    get host() { return this.client.host; }
    get nick() { return this.client.nick; }

    connect() { Conn.connect(); }

    bindEvents() {
        Emitter
            .addSentEvent('CONNECT',  this.eventConnect.bind(this))
            .addReceivedEvent('PING', this.eventPing.bind(this))
            .addReceivedEvent(Numeric['RPL_WELCOME'], (event) => { this.isRegistered = true })
            .addReceivedEvent(Numeric['RPL_USERHOST'], this.eventSetHost.bind(this))
            .addReceivedEvent(Numeric['RPL_DISPLAYHOST'], this.eventSetHost.bind(this))
            .addReceivedEvent(Numeric['ERR_NICKNAMEINUSE'], this.eventNameInUse.bind(this))
            .addAllEvent("*", (event) => {
                let target = event.target;

                if (event.name == "PING")
                    return;

                if (event.name == "PONG")
                    return;

                // if (event.outbound && event.name == "JOIN")
                //     return; // dont put this in the buffer wait for server to ack.

                if (event.data.isServer())
                    target = "server";
                if (event.name == "MODE" && target == this.client.nick)
                    target = "server";

                if (event.name == "QUIT") {
                    for (let chan in Object.keys(Me.channels || {})) {
                        let hostObj = Client.parseNickHost(event.prefix || Me.nick)
                        if (chan[hostObj.nick]) {
                            this.buffer.add(chan, event.data);
                        }
                    }
                    return;
                }

                this.buffer.add(target, event.data);
                if (this.hasUpdateCallback) 
                    this.hasUpdateCallback(event) 
            })
    }

    eventNameInUse(event) {
        this.client.nick = 'ccIRC' + this.randomNumber(1000, 100000)
        IRCCommand.register(this.client);
    }

    // Events are here or now todo break these up.
    eventSetHost(event) {
        this.client.host = event.data.args[0];
    }

    eventConnect(event) {
        window.setTimeout(() => { IRCCommand.register(this.client); }, 300); // For now just delay
    }

    eventPing(event) {
        var evt = event.data;

        console.log("PING %o", evt);

        IRCCommand.ping({
            prefix: this.isRegistered ? this.nick : this.server.name,
            target: this.isRegistered && evt.prefix != "" ? evt.prefix : evt.target,
            args: evt.args
        });
    }

    randomNumber(min, max) {
         return Math.floor(Math.random() * (max - min) + min);
    }
}


// I Want to use effing get/set
const M = new Me();
window.Me = M;

export default M;