//    websocket = new WebSocket("ws://localhost:8080/proxy");
//         websocket.onopen = function() { document.getElementById("output").innerHTML += "<p>> CONNECTED</p>"; };        
//         websocket.onmessage = function(evt) { 
//             var json = JSON.parse(evt.data)
//             switch (json.command) {
//                 case 'PING':
//                     sendToServer({ command: "PONG",  prefix: "irc.centralchat.net", args: [json.target] })
//                     break;
//             }
//             document.getElementById("output").innerHTML += "<p style='color: blue;'>> RESPONSE: " + evt.data + "</p>";                     
//         };
//         websocket.onerror = function(evt) { document.getElementById("output").innerHTML += "<p style='color: red;'>> ERROR: " + evt.data + "</p>"; };
//     }

import {IRCEvent, Emitter} from "irc/event";
import Message from 'irc/message';

class Connection {

    get events() {
        return (this._events = this._events || {});
    }

    get socket() {
        if (this._socket) return this._socket;
        this._socket = new WebSocket("ws://localhost:8080/proxy");
        return this._socket;
    }

    connect() {
        this.socket.onopen = () => {
          this.connected = true;
          this.sendToServer({ command: "CONNECT", target: "irc.centralchat.net:6667" }, true);
        }

        this.socket.onmessage = (evt) => {
            var msg = new Message(JSON.parse(evt.data));
            this.dispatchEvent(msg, false);
        }
    }

    addEventListener() {
        return this.socket.addEventListener(...arguments)
    }

    sendToServer({ prefix, command, target, args }) {
        console.log("SEND: %o", arguments)
        let obj = { 
            'command': command, 
            'prefix': prefix,
            'target': target,
            'args': args
        };

        this.dispatchEvent(new Message(obj), true)
        this.sendToServerRaw(obj)     
    }

    dispatchEvent(obj, sent) {
        let evt = IRCEvent.create(obj, sent)
        Emitter.dispatchEvent(evt) 
    }

    sendToServerRaw(obj) {
        return this.socket.send(JSON.stringify(obj));
    }
}

// Want to use getters / setters
const Conn = new Connection();

// For debug
window.Conn = Conn;

export default Conn;