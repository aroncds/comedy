import React, { Component } from 'react';
import { Container, Menu } from 'semantic-ui-react';

import { JokeFormContainer, JokeListContainer } from '../components/Joke.js';
import { ApproveComponent } from '../components/Token';
import ProfileContainer from '../components/Profile.js';
import Store from '../components/Store.js';


export default class Home extends Component {
    render() {
        return (
            <Container fluid>
                <Menu icon>
                    <ProfileContainer key={1} />
                    <ApproveComponent key={2}/>
                    <Store key={3}/>
                </Menu>
                <JokeFormContainer />
                <JokeListContainer />
            </Container>
        )
    }
}
