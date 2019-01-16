import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';
import {
    Modal,
    Header,
    Form,
    Input,
    Button,
    Icon,
    Loader } from 'semantic-ui-react';


class Buy extends Component {
    state = {open: false, units:""};

    constructor(props, context) {
        super(props);

        this.store = context.drizzle.contracts.Store;
        this.token = context.drizzle.contracts.Token;

        this.buyPriceDataKey = this.store.methods.buyPrice.cacheCall();
        this.buyMinDataKey = this.store.methods.buyMin.cacheCall();
        this.balanceKey = this.token.methods.balanceOf.cacheCall(props.accounts[0]);

        this.web3 = context.drizzle.web3;

        this.onBuy = this.onBuy.bind(this);
    }

    handleOpen = () => this.setState({ open: true });
    handleClose = () => this.setState({ open: false });
    handleUnits = (e) => {
        this.setState({units:e.target.value});
    }

    onBuy(){
        var price = parseFloat(this.web3.utils.fromWei(this.props.Store.buyPrice[this.buyPriceDataKey].value, "ether"));
        var units = parseFloat(this.state.units);
        var value = this.web3.utils.toWei((units * price).toString(), "ether");

        console.log(units * price);
        console.log(value);

        if(units){
            var result = this.store.methods.buy.cacheSend({value: value});
            this.setState({units:""});
        }
    }

    getBalance(){
        if(!this.props.Token.balanceOf[this.balanceKey]){
            return this.props.Token.balanceOf[this.balanceKey];
        }
        return 0;
    }

    renderButton(){
        return (
            <Button basic onClick={this.handleOpen}><Icon name="bitcoin" /> ({this.getBalance()})</Button>
        )
    }

    render() {
        if (!(this.props.Store.buyPrice[this.buyPriceDataKey] && this.props.Store.buyMin[this.buyMinDataKey])){
            return <Loader active/>
        }

        var price = this.props.Store.buyPrice[this.buyPriceDataKey].value;
        var min = this.props.Store.buyMin[this.buyMinDataKey].value;
        var priceEther = this.web3.utils.fromWei(price, "ether");

        return (
            <Modal
                trigger={this.renderButton()}
                open={this.state.open}
                onClose={this.handleClose}
                basic size='small'>
                <Header icon='browser' content='Buy'/>
                <Modal.Content>
                    <Form onSubmit={this.onBuy}>
                        <Input
                            placeholder='Amount...'
                            onChange={this.handleUnits}
                            value={this.state.units} />
                        <Button type='submit' color='green' type='submit'>Buy</Button>
                        <p>Price: {priceEther} - Min: {min}</p>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

Buy.contextTypes = {    
    drizzle: PropTypes.object
}

export const BuyComponent = drizzleConnect(Buy, state => {
    return {
        accounts: state.accounts,
        Store: state.contracts.Store,
        Token: state.contracts.Token,
        web3: state.web3Instance
    }
});