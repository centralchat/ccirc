import React from 'react';

import Me from 'irc/me';

import PropTypes from 'prop-types';


class Login extends React.Component {

  updateNick(event) {
    Me.client.nick = event.target.value;
  }

  updateChan() { }

  connect() {
    Me.connect();
    this.context.router.push('chat/server');
  }

  render() {
    return (
      <div className='row login-page'>
        <div className='col-md-4 col-sm-12 col-md-offset-4'>
            <div className='panel panel-default'>
              <div className='panel-body'>                
                Nick Name<br />
                <input className='form-control' onKeyUp={this.updateNick.bind(this)} onChange={this.updateNick.bind(this)}/>
                Channel<br />
                <input className='form-control' onChange={this.updateChan.bind(this)} value="#chat" />
              </div>
              <div className='panel-footing action-buttons'>
                <a className='btn btn-primary' onClick={this.connect.bind(this)}>Chat</a>
              </div>
              <div className='clearfix'></div>
            </div>
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Login;