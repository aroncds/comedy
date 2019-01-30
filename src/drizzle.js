import { Drizzle } from 'drizzle';
import store from './store';
import options from './drizzleOptions';

const drizzle = new Drizzle(options, store);

export default drizzle;