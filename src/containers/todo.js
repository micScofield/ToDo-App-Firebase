import { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import uuid from 'react-uuid'

import { createTodoDocument } from '../firebase'
import Modal from '../UI/Modal/Modal'
import Spinner from '../UI/spinner/spinner'
import { setAlert, loadStart, loadEnd } from '../store/actions'

const Todo = ({ history, setAlert, alertType, alertMsg, uid, loading, todoListRenderer }) => {

    const [showModal, setShowModal] = useState(false)
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [test, setTest] = useState(false)

    //for better UX, either allow to add more todo or view list of todos
    const [isSaved, setIsSaved] = useState(false)
    const [showTodoForm, setShowTodoForm] = useState(true)

    const saveTodoHandler = async () => {
        if (title.trim().length === 0) {
            setAlert('danger', "Title can't be empty")
        } else if (desc.trim().length === 0) {
            setAlert('danger', "Description can't be empty")
        } else {
            setTest(true)

            //creating todo object to save
            const obj = {
                uid: uid,
                title: title,
                desc: desc,
                createdAt: new Date(),
                completedAt: null,
                todoId: uuid()
            }

            //saves todo in firestore
            await createTodoDocument(obj, obj.todoId)
            setTest(false)
            setTitle('')
            setDesc('')
            setShowTodoForm(false)
            setIsSaved(true)
        }
    }

    const todoButtonHandler = () => {
        setIsSaved(false)
        setShowTodoForm(true)
        setShowModal(true)
    }

    const backdropHandler = () => {
        setTitle('')
        setDesc('')
        todoListRenderer()
        setShowModal(false)
    }

    //specifying alert classes
    const alertClasses = ['alert']
    if (alertType === 'success') alertClasses.push('alert-primary')
    else alertClasses.push('alert-danger')

    const todoForm = (
        <div className='todo' style={{ textAlign: 'left' }}>

            <label className='my-bottom'>Title: </label><br />
            <input className='my-bottom-1' type='text' value={title} placeholder='Enter title here' onChange={e => setTitle(e.target.value)} autoFocus /><br />

            <label className='my-bottom'>Description: </label><br />
            <textarea className='my-bottom-1' rows='3' value={desc} placeholder='Enter description here' onChange={e => setDesc(e.target.value)} /><br />

            {alertMsg && <p className={alertClasses.join(' ')}>{alertMsg}</p>}

            {!test && <button className='btn btn-danger btn-large' onClick={saveTodoHandler}><i className='fa fa-plus'></i> Save</button>}
            {test && <Spinner />}

        </div>
    )

    const modalContent = (
        <Fragment>
            <h3 className='my-bottom-1'>Lets create a todo</h3>

            {/* Shows todo form */}
            {showTodoForm && todoForm}

            {/* If a todo is created, asks user to either add more or list todos */}
            {isSaved && <label className='my-bottom-1'>Todo saved successfully !<br /> <button className='btn btn-dark' onClick={() => {
                setIsSaved(false)
                setShowTodoForm(true)
            }}>Want to add more ?</button>

            <button className='btn btn-primary' onClick={backdropHandler}>Go to your todos</button></label>}

        </Fragment>
    )

    return <Fragment>
        <button className='btn btn-large btn-primary my-bottom' onClick={todoButtonHandler}>Create a todo</button>

        {showModal && <Modal showModal backdropClicked={backdropHandler}>{modalContent}</Modal>}

    </Fragment>
}

const mapStateToProps = state => ({
    alertMsg: state.alert.msg,
    alertType: state.alert.type,
    uid: state.auth.uid,
    loading: state.auth.loading
})

export default connect(mapStateToProps, { setAlert, loadStart, loadEnd })(Todo)