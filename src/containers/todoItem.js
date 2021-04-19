import { Fragment, useState } from 'react'
import { connect } from 'react-redux'

import { updateTodo, deleteTodo, completeTodo, incompleteTodo } from '../firebase'
import { setAlert } from '../store/actions'
import Card from '../UI/Card/Card'
import formatDate from '../utility/formatDate'
import Spinner from '../UI/spinner/spinner'

const TodoItem = ({ todo, renderListForUpdating, showCheckbox, setAlert, alertMsg, alertType }) => {

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')

    const [defaultContent, setDefaultContent] = useState(true)

    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)

    const [showSpinner, setShowSpinner] = useState(false)

    const editHandler = (oldTitle, oldDesc) => {
        setTitle(oldTitle)
        setDesc(oldDesc)
        setDefaultContent(false)
        setEdit(true)
    }

    const deleteHandler = () => {
        setDefaultContent(false)
        setDel(true)
    }

    const completeHandler = async () => {
        setShowSpinner(true)
        await incompleteTodo(todo.todoId)
        setShowSpinner(false)
        renderListForUpdating()
    }

    const incompleteHandler = async () => {
        setShowSpinner(true)
        await completeTodo(todo.todoId)
        setShowSpinner(false)
        renderListForUpdating()
    }

    const confirmEditHandler = async () => {

        //check for input validation
        if (title.trim().length === 0) {
            setAlert('danger', 'Title cant be empty')
        } else if (desc.trim().length === 0) {
            setAlert('danger', 'Description cant be empty')
        } else {
            setEdit(false)
            setShowSpinner(true)
            const obj = {
                title: title,
                desc: desc
            }

            //updates todo in firestore
            await updateTodo(obj, todo.todoId)

            setTitle('')
            setDesc('')
            setShowSpinner(false)
            setDefaultContent(true)
            renderListForUpdating()
        }
    }

    const confirmDeleteHandler = async () => {
        setShowSpinner(true)

        //make delete request with todoId
        await deleteTodo(todo.todoId)

        setShowSpinner(false)
        renderListForUpdating()
    }

    let cardContent = (
        <Fragment>
            <div className='todo-card-content my-bottom-1'>

                {showCheckbox && <input type='checkbox' value={todo.todoId} />}

                <h2 className='my-bottom'>Title: {todo.title}</h2>

                <p className='my-bottom'>Description: {todo.desc}</p>

                {typeof todo.createdAt.seconds === 'number' && <p style={{ fontSize: '0.8rem' }}>Created At: {JSON.stringify(formatDate(todo.createdAt.seconds))}</p>}

                {typeof todo.createdAt.seconds === 'string' && <p style={{ fontSize: '0.8rem' }}>Created At: {todo.createdAt.seconds}</p>}

                {todo.completedAt && <p style={{ fontSize: '0.8rem' }}>Completed at: {JSON.stringify(formatDate(todo.completedAt))}</p>}

            </div>

            <button className='btn btn-dark' onClick={() => editHandler(todo.title, todo.desc, todo.todoId)}><i className="fas fa-edit"></i> Edit Task</button>

            <button className='btn btn-danger' onClick={() => deleteHandler(todo.todoId)}><i className="fas fa-trash"></i> Delete Task</button>

            {todo.completedAt ?
                <button className='btn btn-success' onClick={completeHandler}><i className="fas fa-check"></i> Completed</button>
                : <button className='btn btn-success' onClick={incompleteHandler}><i className="fas fa-times"></i> Not Completed</button>
            }

        </Fragment>
    )

    //specifying alert classes
    const alertClasses = ['alert']
    if (alertType === 'success') alertClasses.push('alert-primary')
    else alertClasses.push('alert-danger')

    let editContent = (
        <Fragment>
            <h2 className='my-bottom-1'><i className='fa fa-edit'></i> Edit todo item</h2>

            <label>Edit Title: </label><br />
            <input type='text' className='my-bottom' value={title} onChange={e => setTitle(e.target.value)} /><br />

            <label>Edit Description: </label><br />
            <textarea className='my-bottom-1' rows='3' value={desc} onChange={e => setDesc(e.target.value)} /><br />

            {alertMsg && <p className={alertClasses.join(' ')}>{alertMsg}</p>}

            <button className='btn btn-primary' onClick={confirmEditHandler}>Confirm Changes</button>

            <button className='btn btn-dark' onClick={() => {
                setEdit(false)
                setDefaultContent(true)
                setTitle('')
                setDesc('')
            }}>Go Back</button>
        </Fragment>
    )

    // Prompt user to confirm delete operation
    let deleteContent = (
        <Fragment>
            <h3 className='my-bottom-1'><strong>Are you sure ? This can not be reverted back.</strong></h3>

            <button className='btn btn-danger' onClick={confirmDeleteHandler}>Proceed</button>

            <button className='btn btn-dark' onClick={() => {
                setDel(false)
                setDefaultContent(true)
            }}>Cancel</button>
        </Fragment>
    )

    return <Fragment>
        <Card>
            {defaultContent && cardContent}
            {edit && editContent}
            {del && deleteContent}
            {showSpinner && <Spinner />}
        </Card>
    </Fragment>
}

const mapStateToProps = state => ({
    alertMsg: state.alert.msg,
    alertType: state.alert.type
})

export default connect(mapStateToProps, { setAlert })(TodoItem)