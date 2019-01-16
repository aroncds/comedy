import React, { Component } from 'react'
import PropTypes from "prop-types";
import { drizzleConnect } from 'drizzle-react';
import {
  Segment,
  Form,
  Loader,
  List,
  Transition} from 'semantic-ui-react';
import { reverse } from '../util/arrays';


class Joke extends Component {

  constructor(props, context){
    super(props);
    this.joke = context.drizzle.contracts.Joke;
    this.dataKey = this.joke.methods.joke.cacheCall(props.id);
  }

  getBody() {
    var data = this.props.Joke.joke[this.dataKey].value;
    return data[5];
  }

  getDate(){
    var data = this.props.Joke.joke[this.dataKey].value;
    return (new Date(parseInt(data[2]))).toString();
  }

  getOwner(){
    var data = this.props.Joke.joke[this.dataKey].value;
    return data[4];
  }

  render() {

    if(!(this.dataKey && this.props.Joke.joke[this.dataKey])){
      return (
        <Segment>
          <Loader active />
        </Segment>
      )
    }

    return (
      <List.Item>
        <List.Content>
          <List.Header>{this.getOwner()}</List.Header>
          <List.Description>{this.getBody()}</List.Description>
        </List.Content>
      </List.Item>
    )
  }
}

Joke.contextTypes = {
  drizzle: PropTypes.object
}

const JokeComponent = drizzleConnect(Joke, state => {
  return {
    Joke: state.contracts.Joke,
    drizzleStatus: state.drizzleStatus
  }
});


class JokeForm extends Component {

  constructor(props, context){
    super(props);
    this.state = this.getInitialState();
    this.contract = context.drizzle.contracts.Joke;
    this.handleState = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getInitialState() {
    return {body: "", loading: false};
  }

  onSubmit() {
    this.setState({loading:true});
    var result = this.contract.methods.create.cacheSend(this.state.body);
    this.setState({loading:false, body:""});
  }

  handleChange(e) {
    var state = {};
    state[e.target.id] = e.target.value;
    this.setState(state);
  }

  render(){
    return (
      <Form loading={this.state.loading} onSubmit={this.onSubmit}>
        <Segment>
          <Form.TextArea
            id="body"
            placeholder="Write your joke..."
            value={this.state.body}
            onChange={this.handleState}></Form.TextArea>
          
          <Form.Button type="submit" content="Salvar" />
        </Segment>
      </Form>
    );
  }
}

JokeForm.contextTypes = {
  drizzle: PropTypes.object
}

export const JokeFormContainer = drizzleConnect(JokeForm, state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus
  }
});


class JokeList extends Component {

  constructor(props, context) {
    super(props);
    this.joke = context.drizzle.contracts.Joke;
    this.dataKey = this.joke.methods.length.cacheCall();
  }
  
  render() {
    if (!(this.dataKey && this.props.Joke.length[this.dataKey])){
      return <Loader active/>
    }

    var length = parseInt(this.props.Joke.length[this.dataKey].value);

    return (
      <Transition.Group
          as={List}
          duration={200}
          divided
          verticalAlign='middle'>
        {reverse(length, (i) => {return <JokeComponent id={i} key={i} />})}
      </Transition.Group>
    )
  }
}

JokeList.contextTypes = {
  drizzle: PropTypes.object
}

export const JokeListContainer = drizzleConnect(JokeList, state => {
  return {
    accounts: state.accounts,
    Joke: state.contracts.Joke,
    drizzleStatus: state.drizzleStatus
  }
});
