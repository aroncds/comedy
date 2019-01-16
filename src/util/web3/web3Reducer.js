const initialState = {
  web3Instance: null
}

const web3Reducer = (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZED')
  {
    console.log("asdas web3");
    return Object.assign({}, state, {
      web3Instance: action.payload.web3Instance
    })
  }

  return state
}

export default web3Reducer
