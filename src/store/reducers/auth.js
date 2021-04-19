import * as actionTypes from '../actions/types'

const initialState = {
    loading: false,
    isAuthenticated: false,
    username: '',
    uid: null
}

const reducer = (state=initialState, action) => {
    switch(action.type) {
        case actionTypes.LOAD_START: return {...state, loading: true}
        case actionTypes.LOAD_END: return {...state, loading: false}
        case actionTypes.LOAD_USER: return {...state, isAuthenticated: true, username: action.username, loading: false, uid: action.uid}
        case actionTypes.SIGNOUT: return {...state, isAuthenticated: false, loading: false, uid: null, username: ''}
        default:
            return state
    }
}

export default reducer