import React, { Component } from 'react';
import { Container, Menu, Input } from 'semantic-ui-react';
import { JokeFormContainer, JokeListContainer } from '../components/Joke.js';
import { BuyComponent } from '../components/Store.js';
import Profile from '../components/Profile';


export default class Home extends Component {
    render() {
        return (
            <Container fluid>
                <Menu secondary>
                    <Menu.Item><Profile /></Menu.Item>
                    <Menu.Item><Input icon='search' placeholder='Search...' /></Menu.Item>
                    <Menu.Item position='right'><BuyComponent /></Menu.Item>
                </Menu>

                <JokeFormContainer />
                <JokeListContainer />
            </Container>
        )
    }
}
