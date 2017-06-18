import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import Me from 'irc/me';
import {Emitter} from 'irc/event';

import {NavBar, SideBar, Content} from 'components/layout';
import MessageCard from 'components/message-card';
import ChatBar from 'components/chat-bar';


class Chat extends React.Component {
  constructor() {
    super();

    this.elements = {}

    this.state = {
        recievedCount: 0,
        target: "server",
    };
  }

  get messages() {
    let target = this.target || this.props.target;
    target = target || 'server';

    return Me.buffer.get(target);
  }

  componentWillMount() {
    Me.hasUpdateCallback = (event) => {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.forceUpdate();
      }, 250);
    }
  }

  componentDidUpdate() {
    let msg  = this.messages[this.messages.length - 1],
        elem = this.elements[msg.key];

    if (elem) elem.focus();
  }

  render() {
    this.elements = {};

    return (
      <div className="page">
        <NavBar />
        <SideBar current={this.target || this.props.target} updateState={(target) => { this.target = target; this.forceUpdate(); } } />
        <div className="content">
          { _.map(this.messages, (val) => {
              return <MessageCard ref={ (elem) => { this.elements[val.key] = elem; } }  message={val} /> 
            }) 
          }
        </div>
        <ChatBar target={this.target || this.props.target} />
      </div>
    );
  }
}

Chat.contextTypes = {
  router: PropTypes.object.isRequired
};


export default Chat;