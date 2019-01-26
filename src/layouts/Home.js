import React, { Component } from 'react';
import { Container, Menu, Icon } from 'semantic-ui-react';

import { JokeFormContainer, JokeListContainer } from '../components/Joke.js';
import { TokenApproveComponent } from '../components/Actions';
import Store from '../components/Store.js';


export default class Home extends Component {
    render() {
        return (
            <Container fluid>
                <Menu icon>
                    <Menu.Item><Icon name="podcast"/></Menu.Item>
                    <TokenApproveComponent key={1}/>
                    <Store key={2}/>
                </Menu>
                <JokeFormContainer />
                <JokeListContainer />
            </Container>
        )
    }
}
