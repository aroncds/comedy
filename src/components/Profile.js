import React, { Component } from 'react';
import { string } from 'prop-types';
import { drizzleConnect } from 'drizzle-react';
import { withNamespaces } from 'react-i18next';
import { Image, Dropdown } from 'semantic-ui-react';
import Box from '3box';

import ProfileImage from '../images/profile.png';


const IPFS_URL = "https://ipfs.infura.io/ipfs/";
const EDIT_URL = "https://www.3box.io/0/edit";
const CREATE_URL = "https://3box.io/create";


class ProfileEdit extends Component {

    static propTypes = {
        name: string.isRequired
    }

    constructor(props){
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
    }
    
    handleEdit() {
        window.open(this.getEditUrl(), "_blank");
    }

    getEditUrl(){
        const { accounts } = this.props;
        return EDIT_URL.replace("0", accounts[0]);
    }

    render() {
        const { t, name } = this.props;

        return [
            <Dropdown.Item key={1} disabled>{name}</Dropdown.Item>,
            <Dropdown.Item onClick={this.handleEdit} key={2}>{t("edit")}</Dropdown.Item>
        ]
    }
}

const ProfileEditComponent = withNamespaces("translation")(drizzleConnect(ProfileEdit, states => {
    return {
        accounts: states.accounts
    }
}));


class ProfileCreate extends Component {

    handleCreate(){
        window.open(CREATE_URL, "_blank");
    }

    render(){
        const { t } = this.props;

        return [
            <Dropdown.Item key={1} disabled>{t("anonym")}</Dropdown.Item>,
            <Dropdown.Item onClick={this.handleCreate} key={2}>{t("create")}</Dropdown.Item>
        ]
    }
}

const ProfileCreateComponent = withNamespaces("translation")(ProfileCreate);


class ProfileMenu extends Component {

    getTrigger(){
        const { image } = this.props;

        return (
            <span>
                <Image src={image} circular avatar/>
            </span>
        )
    }

    getOptions(){
        const { name, exist } = this.props;

        if (exist){
            return <ProfileEditComponent name={name} />
        }else{
            return <ProfileCreateComponent />
        }
    }

    render() {
        return (
            <Dropdown
                item simple icon={null}
                pointing='top left'
                trigger={this.getTrigger()}>
                <Dropdown.Menu>
                    {this.getOptions()}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}


class Profile extends Component {
    state = {
        exists: false,
        name: undefined,
        image: {contentUrl:{"/":undefined}}};

    async componentWillMount() {
        let profile = await Box.getProfile(this.props.accounts[0]);
        let name = profile.name;
        let image = {contentUrl:{"/":""}};

        if (profile.image.length){
            image = profile.image[0];
        }

        this.setState({ name, image, exists: true });
    }

    getImage(){
        const { image } = this.state;
        let url = image.contentUrl["/"];

        if (!url){
            url = ProfileImage;
        }else{
            url = IPFS_URL + image.contentUrl["/"];
        }

        return url;
    }

    getName(){
        const { t } = this.props;
        const { name } = this.state;

        if (!name){
            return t("edit profile");
        }

        return name;
    }

    render() {
        const { accounts } = this.props;
        const { exists } = this.state;

        return (
            <ProfileMenu
                exist={exists}
                accounts={accounts}
                name={this.getName()}
                image={this.getImage()}/>
        );
    }
}

const ProfileContainer = withNamespaces("translation")(drizzleConnect(Profile, states => {
    return {
        accounts: states.accounts
    }
}));

export default ProfileContainer