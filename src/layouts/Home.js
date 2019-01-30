import React, { Component } from 'react';
import { Container, Menu, Icon } from 'semantic-ui-react';

import { JokeFormContainer, JokeListContainer } from '../components/Joke.js';
import { ApproveComponent } from '../components/Token';
import Store from '../components/Store.js';


export default class Home extends Component {
    render() {
        return (
            <Container fluid>
                <Menu icon>
                    <Menu.Item key={1}><Icon name="podcast"/></Menu.Item>
                    <ApproveComponent key={2}/>
                    <Store key={3}/>
                </Menu>
                <JokeFormContainer />
                <JokeListContainer />
            </Container>
        )
    }
}
