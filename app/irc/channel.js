import Numeric  from 'irc/numeric';

import {Emitter} from 'irc/event';
import Client from 'irc/client';

import IRCCommand from 'irc/command';

import _ from 'lodash';


export default class Channel { 
    constructor(name, fnct) {
        this.topic = '';
        this.topicTime = 0;

        this.clients = {};
        this.name  = name;

        this.umodes = {};
        this.cmodes = {};

        this.updateCallback = fnct;

        this.bindEvents();
    }

    message(msg) {
        IRCCommand.message({target: this.name, message: msg });
    }

    remove(hostMask) {
        let hObj = Client.parseNickHost(hostMask);
        if (this.clients[hObj.nick]) {
            delete this.clients[hObj.nick]
        }
    }

    bindEvents() {
        Emitter
            .addReceivedEvent(Numeric['RPL_TOPICTIME'], (event) => { this.topic = event.data.args[0] })
            .addReceivedEvent("QUIT", (event) => { this.remove(event.data.prefix) })
            .addReceivedEvent("PART", (event) => { 
                event.data.target == this.name ? this.remove(event.data.prefix) : null
             })
            .addReceivedEvent("JOIN", (event) => {
                 //  Todo: Do this for free from the event handler (Also we can pass back if its a server etc)
                var hostObj = Client.parseNickHost(event.data.prefix);

                let client  = new Client({
                    nick:  hostObj.nick,
                    host:  hostObj.host,
                    ident: hostObj.ident,
                });
                
                this.clients[client.nick] = client;
            })
            .addReceivedEvent(Numeric['RPL_WHOREPLY'], (event) => {
                if (event.data.args[0] != this.name) return;

                let nick  = event.data.args[4],
                   client = this.clients[nick];

                client.host     = event.data.args[2];
                client.ident    = event.data.args[0];
                client.server   = event.data.args[3];
                client.realName = event.data.args[6];
                
            })
            .addReceivedEvent(Numeric['RPL_NAMREPLY'], (event) => {
                var data = event.data;
                if (data.args[1] == this.name) {
                    _.each(data.args[2].split(' '), (nick) => {
                        let pieces = nick.match(/([\@\~\&\+\%])?(.+)/)
                        if (pieces) {
                            this.clients[pieces[2]] = new Client({
                                nick: pieces[2],
                                channelPrefix: pieces[1],
                            });
                        }
                    });
                }
            })
            .addReceivedEvent(Numeric["RPL_ENDOFNAMES"], (event) => {
                IRCCommand.whoChannel({ target: this.name });
            });
    }
}

