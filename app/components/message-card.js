import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import Client from 'irc/client';

import IRCStrings from 'irc/strings';

class MessageCard extends React.Component {
    render() {
      let message = this.props.message,
          hostObj = Client.parseNickHost(message.prefix),
          str     = IRCStrings.formatString(message.content) || message.args.join(' ');

      return (
        <div key={message.key} className={ 'message ' + message.command.toLowerCase() } >
            <div className='author col-md-2'>
              {hostObj.nick}
            </div>
            <div className='text col-md-7'>{str}</div>
            <div className='timestamp col-md-2'>
              {moment(message.time).format('MM/DD/YYYY')}
            </div>
          <div className='clearfix'></div>
        </div>);
      }
}

MessageCard.contextTypes = {
  router: PropTypes.object.isRequired
};


export default MessageCard;