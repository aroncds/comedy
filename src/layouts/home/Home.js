import React, { Component } from 'react'
import PropTypes from "prop-types";
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components';

import Profile from '../profile/ProfileContainer';


class Home extends Component {

  constructor(props, context){
    super(props);
    this.joke = context.drizzle.contracts.Joke;
    this.states = {length:0};
  }

  async componentWillMount() {
    this.states = {length: await this.joke.methods.length().call()};
  }

  renderJokes() {
    var jokes = [];
    var length = this.states.length;
    for(var i = length - 1; i >= 0; i--){
      jokes.push(<ContractData contract="Joke" method="joke" methodArgs={[i]} />);
    }
    return jokes;
  }

  render() {
    return (
      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <h2>Joke</h2>
            <p>You make a joke!</p>
            <ContractForm contract="Joke" method="create"/>
            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>Data</h2>
            {this.renderJokes()}
          </div>
        </div>
      </main>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

export default Home