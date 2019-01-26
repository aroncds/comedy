import React, { Component } from 'react';
import { object } from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { drizzleConnect } from 'drizzle-react';
import {
  Modal,
  Form,
  Input,
  Menu,
  Icon,
  Tab,
  Message,
  Loader,
  Label } from 'semantic-ui-react';


class Buy extends Component {
  state = {units:"", error: null};

  constructor(props, context) {
    super(props);

    this.web3 = context.drizzle.web3;
    this.store = context.drizzle.contracts.Store;

    this.buyPriceDataKey = this.store.methods.buyPrice.cacheCall();
    this.buyMinDataKey = this.store.methods.buyMin.cacheCall();

    this.onBuy = this.onBuy.bind(this);
    this.handleUnits = this.handleUnits.bind(this);
  }

  getPrice(){
    var price = this.props.Store.buyPrice[this.buyPriceDataKey].value;
    return this.web3.utils.fromWei(price, "ether");
  }

  getMin() {
    return this.props.Store.buyMin[this.buyMinDataKey].value;
  }

  handleUnits(e){
    this.setState({units:e.target.value});
  }

  isValid(){
    const { t } = this.props;
    var error = null;
    var units = parseInt(this.state.units);
    if (!units || units <= 0) {
      error = t("You must type a number!");
    } else if (this.getMin() > units){
      error = t("You must buy more than the minium");
    }
    if (error){
      this.setState({error: error});
      return false;
    }
    return true;
  }

  onBuy(){
    if(this.isValid()){
      var price = parseFloat(this.getPrice());
      var units = parseFloat(this.state.units);
      var value = this.web3.utils.toWei((units * price).toString(), "ether");
      this.store.methods.buy.cacheSend({value: value});
      this.setState({units:""});
    }
  }

  renderError() {
      if (this.state.error) {
          return <Message error content={this.state.error}/>
      }
      return null;
  }

  render() {
    const { t } = this.props;

    if (!(this.props.Store.buyPrice[this.buyPriceDataKey] && this.props.Store.buyMin[this.buyMinDataKey])){
      return <Loader active/>
    }

    return (
      <Form onSubmit={this.onBuy}>
        <Input
          fluid
          action={{ color: 'teal', labelPosition: 'left', icon: 'cart', content: t('buy') }}
          type="number"
          placeholder={t("amount")}
          error={this.state.error}
          onChange={this.handleUnits}
          value={this.state.units} />
        {this.renderError()}
        <p><strong>Total:</strong> 100 ETH</p>
        <p>{t('price')}: {this.getPrice()} - Min: {this.getMin()}</p>
      </Form>
    )
  }
}


Buy.contextTypes = { drizzle: object };

const BuyComponent = withNamespaces('translation')(drizzleConnect(Buy, state => {
  return {
    accounts: state.accounts,
    Store: state.contracts.Store,
    web3: state.web3Instance
  }
}));

class Sell extends Component {
	state = {units:0, error:null};

	constructor(props, context) {
		super(props);

    this.store = context.drizzle.contracts.Store;
    this.token = context.drizzle.contracts.Token;
    this.wallet = context.drizzle.contracts.Wallet;

    this.unitsApprovedKey = this.token.methods.allowance.cacheCall(props.accounts[0], this.wallet.address);
		this.sellPriceDataKey = this.store.methods.sellPrice.cacheCall();
		this.sellMinDataKey = this.store.methods.sellMin.cacheCall();
		this.web3 = context.drizzle.web3;

    this.onSell = this.onSell.bind(this);
  }
  
  getUnitsAllowed() {
    if (this.props.Token.allowance[this.unitsApprovedKey]){
      return this.props.Token.allowance[this.unitsApprovedKey].value;
    }
    return 0;
  }

  getPrice(){
    var price = this.props.Store.sellPrice[this.sellPriceDataKey].value;
    return this.web3.utils.fromWei(price, "ether");
  }

  getMin() {
    return this.props.Store.sellMin[this.sellMinDataKey].value;
  }

  handleUnits(e){
    this.setState({units:e.target.value});
  }

  isValid(){

  }

	onSell(){
    if(this.isValid()){

    }
	}

  render() {
    const { t } = this.props;
    const { units, error } = this.state;

    if (!(this.props.Store.sellPrice[this.sellPriceDataKey] && this.props.Store.sellMin[this.sellMinDataKey])){
      return <Loader active/>
    }

    return (
      <Form onSubmit={this.onSell}>
        <div>{t("you have")} ({this.getUnitsAllowed()}) {t("usable")}</div>
        <Input
          fluid
          action={{ color: 'teal', labelPosition: 'left', icon: 'cart', content: t('sell') }}
          type="number"
          placeholder={t("amount")}
          error={error}
          onChange={this.handleUnits}
          value={units} />
        <p><strong>{t('price')}</strong>: {this.getPrice()} - <strong>Min</strong>: {this.getMin()}</p>
      </Form>
    )
  }
}

Sell.contextTypes = { drizzle: object };

const SellComponent = withNamespaces('translation')(drizzleConnect(Sell, state => {
	return {
    accounts: state.accounts,
    Wallet: state.contracts.Wallet,
		Token: state.contracts.Token,
		Store: state.contracts.Store,
		web3: state.web3Instance
	}
}));

class Store extends Component {
  state = {open: false};

  constructor(props, context) {
    super(props);
    this.token = context.drizzle.contracts.Token;
    this.balanceKey = this.token.methods.balanceOf.cacheCall(props.accounts[0]);
    this.web3 = context.drizzle.web3;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  getBalance(){
    if(this.props.Token.balanceOf[this.balanceKey]){
      return this.props.Token.balanceOf[this.balanceKey].value;
    }
    return 0;
  }

  handleOpen(){
    this.setState({ open: true });
  }

  handleClose(){
    this.setState({ open: false });
  }

  getPanes() {
    const { t } = this.props;
  
    return [
      {menuItem: t("buy"), render: () => <Tab.Pane attached={true}><BuyComponent /></Tab.Pane>},
      {menuItem: t("sell"), render: () => <Tab.Pane attached={false}><SellComponent /></Tab.Pane>}
    ];
  }

  renderButton(){
    return (
      <Menu.Item onClick={this.handleOpen}>
        <Icon name="bitcoin" /> <Label color="orange">{this.getBalance()}</Label>
      </Menu.Item>
    )
  }

  render() {
    const { t } = this.props;

    return (
      <Modal
        closeIcon
        size='small'
        centered={false}
        trigger={this.renderButton()}
        open={this.state.open}
        onClose={this.handleClose}>
          <Modal.Header>{t("store")}</Modal.Header>
          <Modal.Content>
              <Tab menu={{secondary: true}} panes={this.getPanes()} />
          </Modal.Content>
      </Modal>
    )
  }
}

Store.contextTypes = { drizzle: object };

const StoreComponent = withNamespaces("translation")(drizzleConnect(Store, state => {
  return {
    accounts: state.accounts,
    Token: state.contracts.Token,
  }
}));

export default StoreComponent