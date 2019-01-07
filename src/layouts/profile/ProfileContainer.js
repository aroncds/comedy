import Profile from './Profile';
import { drizzleConnect } from 'drizzle-react';

const mapStateToProps = states => {
    return {
        accounts: states.accounts,
        drizzleStatus: states.drizzleStatus
    };
};

const ProfileContainer = drizzleConnect(Profile, mapStateToProps);

export default ProfileContainer