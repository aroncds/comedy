import { Component, Children } from 'react'
import PropTypes from 'prop-types'


class DrizzleProvider extends Component {
  static propTypes = {
    drizzle: PropTypes.object.isRequired
  }

  // you must specify what you’re adding to the context
  static childContextTypes = {
    drizzle: PropTypes.object.isRequired,
    drizzleStore: PropTypes.object.isRequired
  }

  constructor(context, props) {
    super(context, props)
  }

  getChildContext() {
    const { drizzle } = this.props;
    const drizzleStore = drizzle.store;
    return { drizzle, drizzleStore }
  }

  render() {
    // `Children.only` enables us not to add a <div /> for nothing
    return Children.only(this.props.children)
  }
}

export default DrizzleProvider