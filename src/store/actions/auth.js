import * as actionTypes from './types'

export const loadStart = () => ({ type: actionTypes.LOAD_START })
export const loadEnd = () => ({ type: actionTypes.LOAD_END })

export const loadUser = (displayName, uid) => dispatch => {
    dispatch(loadStart())
    dispatch({
        type: actionTypes.LOAD_USER,
        username: displayName,
        uid: uid
    })
}

export const signout = () => dispatch => {
    dispatch(loadStart())
    dispatch({
        type: actionTypes.SIGNOUT
    })
}