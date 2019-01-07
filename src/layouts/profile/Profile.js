import React, { Component } from 'react';
const Box = require('3box');


export default class Profile extends Component {

    constructor(props){
        super(props);
        debugger;
        this.states = {name: "", image: ""};
    }

    async componentWillMount() {
        var profile = await Box.getProfile(this.props.accounts[0]);
        var name = await profile.public.get("name");
        var image = await profile.public.get("image");

        this.states.name = name;
        this.states.image = image;
    }

    render() {
        return (
            <div className="profile">
                <div className="image"><img src={this.states.image} /></div>
                <div className="name">{this.states.name}</div>
            </div>
        );
    }

}
