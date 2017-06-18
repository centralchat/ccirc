import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import IRCCommand from 'irc/command';

class ChatBar extends React.Component {
    handleKeyPress(evt) {
      let value = evt.target.value;
      if (evt.key == "Enter") {
        IRCCommand.processRaw(this.props.target, value);
        evt.target.value = '';
      }
    }

    render() {
      return (
        <div className='chat-bar'>
          <input onKeyPress={this.handleKeyPress.bind(this)} className='form-control' />
          <div className='send-btn'> Send </div>
        </div>
      );
    }
}

ChatBar.contextTypes = {
  router: PropTypes.object.isRequired
};

export default ChatBar;
