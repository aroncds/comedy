import React, { Component } from 'react';
import { object } from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { drizzleConnect } from 'drizzle-react';
import {
  Form,
  Modal, 
  Menu,
  Icon,
  Label } from 'semantic-ui-react';


class TokenApprove extends Component {
  state = {open:false, units: 0};

  constructor(props, context) {
    super(props);

    this.token = context.drizzle.contracts.Token;
    this.wallet = context.drizzle.contracts.Wallet;

    this.allowanceKey = this.token.methods.allowance
      .cacheCall(props.accounts[0], this.wallet.address);
  
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleUnits = this.handleUnits.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
  }

  getAllowanceUnits(){
    if(this.props.Token.allowance[this.allowanceKey]){
      return this.props.Token.allowance[this.allowanceKey].value;
    }
    return 0;
  }

  isValid() {
    var units = parseInt(this.state.units);
    if (units && units > 0){
      return true;
    }
    return false;
  }

  handleOpen(){
    this.setState({open:true});
  }

  handleClose(){
    this.setState({open:false});
  }

  handleUnits(e){
    this.setState({units: e.target.value});
  }

  handleApprove(){
    if(this.isValid()){
      this.token.methods.approve.cacheSend(this.wallet.address, this.state.units);
    }
  }

  renderButton(){
    const { t } = this.props;
    return (
      <Menu.Item
        color="green"
        position="right"
        onClick={this.handleOpen}>
          <Icon name="check" /><Label color='teal'>{this.getAllowanceUnits()}</Label>
      </Menu.Item>
    );
  }

  render(){
    const { t } = this.props;
    const { open, units } = this.state;
  
    return (
      <Modal
          closeIcon
          size='small'
          centered={false}
          open={open}
          onClose={this.handleClose}
          trigger={this.renderButton()}>
        <Modal.Header>{t("approve")}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleApprove}>
            <Form.Input 
              fluid
              action={{color: 'teal', labelPosition: 'left', icon: 'check', content: t("approve")}}
              type="number"
              placeholder={t("amount")}
              onChange={this.handleUnits}
              value={units}/>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

TokenApprove.contextTypes = { drizzle: object };

export const ApproveComponent = withNamespaces("translation")(drizzleConnect(TokenApprove, state => {
  return {
    Token: state.contracts.Token,
    Wallet: state.contracts.Wallet,
    accounts: state.accounts
  }
}));
