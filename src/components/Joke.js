import React, { Component } from 'react'
import { object, number } from "prop-types";
import { drizzleConnect } from 'drizzle-react';
import { withNamespaces } from 'react-i18next';
import { reverse } from '../util/arrays';
import {
  Segment,
  Form,
  Loader,
  List,
  Transition } from 'semantic-ui-react';


class Joke extends Component {

  static propTypes = {
    id: number.isRequired
  }

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

  renderContent(){
    if(!(this.dataKey && this.props.Joke.joke[this.dataKey])){
      return <Loader active />;
    }
    
    return [
      <List.Header>{this.getOwner()}</List.Header>,
      <List.Description>{this.getBody()}</List.Description>
    ];
  }

  render() {

    return (
      <List.Item>
        <List.Content>
          {this.renderContent()}
        </List.Content>
      </List.Item>
    )
  }
}

Joke.contextTypes = { drizzle: object };

const JokeComponent = drizzleConnect(Joke, state => {
  return {
    Joke: state.contracts.Joke,
    drizzleStatus: state.drizzleStatus
  }
});


class JokeForm extends Component {
  state = {body: "", error: false, loading: false}

  constructor(props, context){
    super(props);
    this.contract = context.drizzle.contracts.Joke;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBody = this.handleBody.bind(this);
  }

  isValid(){
    if (this.state.body.length > 5){
      return true;
    }

    this.setState({error: true});
    return false;
  }

  handleSubmit() {
    if (this.isValid()){
      this.contract.methods.create.cacheSend(this.state.body);
    }
  }

  handleBody(e) {
    this.setState({body: e.target.value});
  }

  render(){
    const { t } = this.props;
    const { loading, error, body } = this.state;
  
    return (
      <Form loading={loading} onSubmit={this.handleSubmit}>
        <Segment>
          <Form.TextArea
            id="body"
            placeholder={t("write joke")}
            onChange={this.handleBody}
            value={body}
            error={error}></Form.TextArea>
          
          <Form.Button type="submit" content={t("save")} />
        </Segment>
      </Form>
    );
  }
}

JokeForm.contextTypes = { drizzle: object };

export const JokeFormContainer = withNamespaces("translation")(drizzleConnect(JokeForm, state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus
  }
}));


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

JokeList.contextTypes = { drizzle: object };

export const JokeListContainer = drizzleConnect(JokeList, state => {
  return {
    accounts: state.accounts,
    Joke: state.contracts.Joke,
    drizzleStatus: state.drizzleStatus
  }
});
 