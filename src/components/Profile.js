import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { Image } from 'semantic-ui-react';
//import Box from '3dbox';


class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {name: "", image: ""};
    }

    /*async componentWillMount() {
        var profile = await Box.getProfile(this.props.accounts[0]);
        var name = await profile.public.get("name");
        var image = await profile.public.get("image");

        this.state.name = name;
        this.state.image = image;
    }*/

    render() {
        return (
            <div className="profile">
                <Image src={this.state.image} size='small' circular/>
            </div>
        );
    }
}

const mapStateToProps = states => {
    return {
        accounts: states.accounts
    }
}

const ProfileContainer = drizzleConnect(Profile, mapStateToProps);

export default ProfileContainer