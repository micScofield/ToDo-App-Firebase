import * as actionTypes from './types'

const removeAlert = () => {
    return {
        type: actionTypes.REMOVE_ALERT
    }
}

export const setAlert = (type, msg) => dispatch => {
    dispatch({
        type: actionTypes.SET_ALERT,
        msg: msg,
        alertType: type
    })
    setTimeout(() => { dispatch(removeAlert()) }, 2000)
}