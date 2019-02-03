import React, { Component } from 'react';
import { object } from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { drizzleConnect } from 'drizzle-react';
import {
  Modal,
  Form,
  Menu,
  Icon,
  Tab,
  Button,
  Loader,
  Label } from 'semantic-ui-react';

import { testUnits } from '../validators/forms';


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

  getTotal(){
    const { Store } = this.props;
  
    var price = 0;
    var total = 0;
    var units = parseInt(this.state.units, 10);
    units = units ? units:0;

    if(Store.buyPrice[this.buyPriceDataKey]){
      price = Store.buyPrice[this.buyPriceDataKey].value;
    }

    total = this.web3.utils.toBN(price * units);
    return this.web3.utils.fromWei(total, "ether");
  }

  getPrice(){
    const { Store } = this.props;
    var price = 0;

    if(Store.buyPrice[this.buyPriceDataKey]){
      price = Store.buyPrice[this.buyPriceDataKey].value;
    }

    return this.web3.utils.fromWei(price.toString(), "ether");;
  }

  getMin() {
    return this.props.Store.buyMin[this.buyMinDataKey].value;
  }

  handleUnits(e){
    this.setState({units:e.target.value});
  }

  isValid(){
    var valid = testUnits(this.state);
    this.setState({error: !valid});
    return valid;
  }

  onBuy(){
    if(this.isValid()){
      var total = this.getTotal();
      var value = this.web3.utils.toWei(total, "ether");
  
      this.store.methods.buy.cacheSend({value: value});
    }
  }

  render() {
    const { t } = this.props;
    const { units, error } = this.state;

    if (!(this.props.Store.buyPrice[this.buyPriceDataKey] && this.props.Store.buyMin[this.buyMinDataKey])){
      return <Loader active/>
    }

    return (
      <Form onSubmit={this.onBuy}>
        <Form.Input
          fluid
          action={{ color: 'teal', labelPosition: 'left', icon: 'cart', content: t('buy') }}
          error={error}
          value={units}
          type="number"
          placeholder={t("amount")}
          onChange={this.handleUnits} />
        <p><strong>{t('price')}</strong>: {this.getPrice()} - <strong>Min</strong>: {this.getMin()}</p>
        <p><strong>Total:</strong> {this.getTotal()} ETH</p>
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
	state = {units:0, error:false};

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
    this.handleUnits = this.handleUnits.bind(this);
  }
  
  getUnitsAllowed() {
    if (this.props.Token.allowance[this.unitsApprovedKey]){
      return this.props.Token.allowance[this.unitsApprovedKey].value;
    }
    return 0;
  }

  getTotal(){
    var price = 0;
    var units = parseInt(this.state.units, 10);
    if (this.props.Store.sellPrice[this.sellPriceDataKey]){
      price = this.props.Store.sellPrice[this.sellPriceDataKey].value; 
    }
    return this.web3.utils.fromWei((price * units).toString(), "ether");;
  }

  getPrice(){
    var price = 0;
    if (this.props.Store.sellPrice[this.sellPriceDataKey]){
      price = this.props.Store.sellPrice[this.sellPriceDataKey].value; 
    }
    return this.web3.utils.fromWei(price.toString(), "ether");;
  }

  getMin() {
    if(this.props.Store.sellMin[this.sellMinDataKey]){
      return this.props.Store.sellMin[this.sellMinDataKey].value;
    }
    return 0;
  }

  handleUnits(e){
    this.setState({units:e.target.value});
  }

  isValid(){
    var approved = this.getUnitsAllowed();
    var valid = testUnits(this.state, (units) => approved >= units);
    this.setState({ error: !valid });
    return valid;
  }

	onSell(){
    var units = this.state.units;
  
    if(this.isValid()){
      this.store.methods.sell.cacheSend(units);
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
        <p>{t("you have")} (<strong>{this.getUnitsAllowed()}</strong>) {t("usable")}!</p>
        <Form.Input
          fluid
          action={{ color: 'teal', labelPosition: 'left', icon: 'cart', content: t('sell') }}
          type="number"
          placeholder={t("amount")}
          error={error}
          onChange={this.handleUnits}
          value={units} />
        <p><strong>{t('price')}</strong>: {this.getPrice()} - <strong>Min</strong>: {this.getMin()}</p>
        <p><strong>Total</strong>: {this.getTotal()}</p>
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

class Withdraw extends Component {

  constructor(props, context){
    super(props);
    this.store = context.drizzle.contracts.Store;
    this.etherDataKey = this.store.methods.etherToPay.cacheCall(props.accounts[0]);
    this.web3 = context.drizzle.web3;

    this.handleWithdraw = this.handleWithdraw.bind(this);
  }

  handleWithdraw(){
    var ethers = parseFloat(this.getEtherToPay());

    if (parseFloat(ethers) > 0){
      this.store.methods.withdraw.cacheSend();
    }
  }

  getEtherToPay(){
    if(this.props.Store.etherToPay[this.etherDataKey]){
      return this.web3.utils.fromWei(this.props.Store.etherToPay[this.etherDataKey].value, "ether");
    }

    return 0;
  }

  render() {
    return (
      <div className="withdraw">
        <Button onClick={this.handleWithdraw}>{this.getEtherToPay()}</Button>
      </div>
    );
  }
}

Withdraw.contextTypes = { drizzle: object };

const WithdrawComponent = withNamespaces("translation")(drizzleConnect(Withdraw, state => {
  return {
    Store: state.contracts.Store,
    accounts: state.accounts,
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
      {menuItem: t("sell"), render: () => <Tab.Pane attached={false}><SellComponent /></Tab.Pane>},
      {menuItem: t("withdraw"), render: () => <Tab.Pane attached={false}><WithdrawComponent /></Tab.Pane>}
    ];
  }

  renderButton(){
    return (
      <Menu.Item onClick={this.handleOpen}>
        <Icon name="bitcoin" /><Label color="orange">{this.getBalance()}</Label>
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