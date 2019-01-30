import React, { Component } from 'react'
import { object, number } from "prop-types";
import { drizzleConnect } from 'drizzle-react';
import { withNamespaces } from 'react-i18next';
import {
  Segment,
  Form,
  Loader,
  List,
  Dimmer,
  Button,
  Icon,
  Transition } from 'semantic-ui-react';

import { reverse } from '../util/arrays';
import { testUnits } from '../validators/forms';
import { handleTransactionUpdate } from '../util/transaction';


class Like extends Component {
  state = {loading: false, error: false, units: ""};

  static propTypes = {
    joke: object.isRequired,
    jokeId: number.isRequired
  }

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUnits = this.handleUnits.bind(this);
    this.handleTransaction = this.handleTransaction.bind(this);
  }

  isValid(){
    var valid = testUnits(this.state);
    this.setState({error: !valid});
    return valid;
  }

  handleTransaction(state){
    if(state === "success" || state === "error"){
      this.setState({loading: false});
    }
  }

  handleUnits(e){
    this.setState({units: e.target.value});
  }

  handleSubmit(){
    const { units } = this.state;
    const { joke, jokeId } = this.props;

    if(this.isValid()){
      this.setState({loading: true});
      handleTransactionUpdate(
        joke.methods.addLike.cacheSend(jokeId, units),
        this.handleTransaction);
    }
  }

  render() {
    const { t } = this.props;
    const { loading, units, error } = this.state;

    if (loading){
      return <Loader active/>
    }
  
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          type="number"
          value={units}
          error={error}
          onChange={this.handleUnits}
          action={{ color: 'teal', labelPosition: 'left', icon: 'like', content: t('send') }}
          placeholder={t("amount")} />
      </Form>
    );
  }
}

const LikeComponent = withNamespaces("translation")(Like);


class Joke extends Component {
  state = { active: false };

  static propTypes = {
    id: number.isRequired
  }

  constructor(props, context){
    super(props);
    this.joke = context.drizzle.contracts.Joke;
    this.dataKey = this.joke.methods.joke.cacheCall(props.id);
    this.handleLike = this.handleLike.bind(this);
    this.handleLikeClose = this.handleLikeClose.bind(this);
  }

  getLikes(){
    var data = this.props.Joke.joke[this.dataKey].value;
    return data[3];
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

  handleLike(){
    this.setState({active: true});
  }

  handleLikeClose(){
    this.setState({active: false});
  }

  renderContent(){
    if(!(this.dataKey && this.props.Joke.joke[this.dataKey])){
      return <Loader active />;
    }
    
    return (
      <div>
        <List.Header>{this.getOwner()}</List.Header>
        <List.Description>
          {this.getBody()}<br /><br />
          <Button onClick={this.handleLike} compact><Icon name="like"/> ({this.getLikes()})</Button>
        </List.Description>
      </div>
    );
  }

  render() {
    const { active } = this.state;

    return (
      <List.Item>
        <Dimmer.Dimmable
            onMouseLeave={this.handleLikeClose}
            as={List.Content}
            dimmed={active}>

          <Dimmer active={active} inverted>
            <LikeComponent
              jokeId={this.props.id}
              joke={this.joke}
              onClose={this.handleLikeClose}/>
          </Dimmer>

          {this.renderContent()}
        </Dimmer.Dimmable>
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
    this.joke = context.drizzle.contracts.Joke;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBody = this.handleBody.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
  }

  isValid(){
    if (this.state.body.length > 0){
      return true;
    }

    this.setState({error: true});
    return false;
  }

  handleStatus(status){
    console.log(status);
    if (status === "success" || status === "error"){
      this.setState({loading: false});
      return true;
    }
    return false;
  }

  handleSubmit() {
    const { body } = this.state;
  
    if (this.isValid()){
      this.setState({loading:true});

      handleTransactionUpdate(
        this.joke.methods.create.cacheSend(body),
        this.handleStatus);
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
    transactionStack: state.transactionStack,
    transactions: state.transactions
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
    Joke: state.contracts.Joke
  }
});
 