import { Fragment } from 'react'

import Backdrop from '../Backdrop/Backdrop';
import './Modal.css'

const Modal = props => {

    return (
        <Fragment>
            <div className='Modal'>
                {props.children}
            </div>

            <Backdrop show={props.showModal} backdropClicked={props.backdropClicked} />
        </Fragment>
    )
}

export default Modal