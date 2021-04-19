import './Backdrop.css';

const Backdrop = (props) => (
    props.show ? <div className = 'Backdrop' onClick = {props.backdropClicked} ></div> : null
)

export default Backdrop;