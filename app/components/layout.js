import PropTypes from 'prop-types';

import React from 'react';
import _ from 'lodash';

import Me from 'irc/me';

class NavBar extends React.Component {
    render() {
      return (
        <nav className="navbar navbar-default navbar-fixed-top">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
          </ul>
        </div>
      </nav>);
    }
}

class Content extends React.Component {
  render() {
    return (
      <div className='content'>
        {this.props.children || ''}
      </div>
    );
  }
};

class SideBar extends React.Component {
  navigateTo(link) {     
    // this.context.router.push('chat/' + link);
    if (this.props.updateState)
      this.props.updateState(link)
  }

  render() {
    let links = Object.keys(Me.buffer.data);

    return (
      <div className='sidebar'>
        <div className='info'>{Me.nick}</div>
        <ul>
          { _.map(links, (link) => {
              return (
                <li className={ this.props.current == link ? 'active' : '' } onClick={ ()=> { this.navigateTo(link) } }>
                  {link}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
};

SideBar.contextTypes = {
  router: PropTypes.object.isRequired
};

export {
    NavBar,
    Content,
    SideBar,
}