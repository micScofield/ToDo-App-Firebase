import { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux'

import { getTodos, deleteMultiple } from '../firebase'
import formatDate from '../utility/formatDate'
import TodosByDate from '../components/todosByDate'
import TodoItem from './todoItem'
import Spinner from '../UI/spinner/spinner'
import { setAlert } from '../store/actions'

const TodoList = ({ uid, setAlert, renderTodoList, alertMsg, alertType }) => {

    const [todos, setTodos] = useState(null)
    const [loading, setLoading] = useState(false)

    //causes this component to re-render on a edit todo request
    const [renderList, setRenderList] = useState(false)
    const renderListForUpdating = () => setRenderList(!renderList)

    //for delete multiple todos functionality
    const [showCheckbox, setShowCheckbox] = useState(false)

    //for default content
    const [showDefaultContent, setShowDefaultContent] = useState(true)

    //for sectioned content
    const [showSectionedContent, setShowSectionedContent] = useState(false)
    const [todosByDate, setTodosByDate] = useState([])

    //fetches todos by user id from firestore
    const fetch = async () => {
        setLoading(true)
        const data = await getTodos(uid)
        const sorted = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
        setTodos(sorted)
        setLoading(false)
    }

    useEffect(() => {
        // fetching todos from firestore
        fetch()
    }, [renderTodoList, renderList])

    const deleteMultipleHandler = () => setShowCheckbox(true)
    const cancelMultipleDeleteHandler = () => setShowCheckbox(false)

    const proceedToDeleteMultiple = async () => {

        // fetches all checkboxes and filter checked ones
        const checkboxArr = Array.from(document.querySelectorAll('input[type="checkbox"]'))
        const selectedcheckboxArr = checkboxArr.filter(el => el.checked ? el : null)
        const selectedTodoArr = []
        selectedcheckboxArr.forEach(el => {
            selectedTodoArr.push(el.value)
        })

        //shows alert to user to choose at least one todo
        if (selectedTodoArr.length === 0) {
            setAlert('danger', 'You need to choose atleast 1 todo to perform this action.')
        } else {
            const flag = await deleteMultiple(selectedTodoArr)
            console.log(flag)
            if (flag) {
                console.log('deleted from db')
                setShowCheckbox(false)
                setRenderList(!renderList)
            }
        }
    }

    //handles sectioned todo list view
    const listByDateHandler = () => {
        const copyOfTodos = [...todos]

        //array with formatted date and first field being the date and second is respective todo itself
        const arr1 = []
        copyOfTodos.forEach(todo => {
            if (typeof todo.createdAt.seconds === 'number') {
                todo.createdAt.seconds = formatDate(todo.createdAt.seconds)
            }
            const extractedDate = todo.createdAt.seconds.split(' ')[0]
            const obj = {
                date: extractedDate,
                todo: todo
            }
            arr1.push(obj)
        })

        //grouping todos by date
        let grouped = arr1.reduce((r, a) => {
            r[a.date] = [...r[a.date] || [], a];
            return r;
        }, {});

        const finalArr = []
        for (let i in grouped) {
            const obj = {
                date: i,
                todos: grouped[i]
            }
            finalArr.push(obj)
        }

        setTodosByDate(finalArr)
        setShowDefaultContent(false)
        setShowSectionedContent(true)
    }

    const defaultListHandler = () => {
        setShowDefaultContent(true)
        setShowSectionedContent(false)
    }

    //specifying alert classes
    const alertClasses = ['alert']
    if (alertType === 'success') alertClasses.push('alert-primary')
    else alertClasses.push('alert-danger')

    let content
    content = !loading && todos && todos.length === 0 && <div>No todos yet ! Create some.</div>
    content = !loading && todos && todos.length !== 0 && <Fragment>

        {(!showCheckbox && todos) ?
            <div>
                {showDefaultContent && <button className='btn btn-grey' onClick={listByDateHandler}>List By Date</button>}

                {showSectionedContent && <button className='btn btn-grey' onClick={defaultListHandler}>Default List</button>}

                <button className='btn btn-danger' disabled={showSectionedContent} onClick={deleteMultipleHandler}>Delete Multiple</button>
            </div>
            : <div>
                <button className='btn btn-danger' onClick={cancelMultipleDeleteHandler}>Cancel Operation</button> 
                
                <button className='btn btn-danger' onClick={proceedToDeleteMultiple}>Proceed</button>
                
                {alertMsg && <p className={alertClasses.join(' ')} style={{ marginTop: '1rem' }}>{alertMsg}</p>}
            </div>}

        {/* Render todo item component for all values of todos */}
        {showDefaultContent && todos.map(todo => <TodoItem key={todo.createdAt} todo={todo} renderListForUpdating={renderListForUpdating} renderList={renderList} showCheckbox={showCheckbox} proceedToDeleteMultiple={proceedToDeleteMultiple} />)}

        {/* Render sectioned list view */}
        {showSectionedContent && todosByDate && <Fragment>
            <TodosByDate todosByDate={todosByDate} />
        </Fragment>}

    </Fragment>

    return <Fragment>
        {loading && <Spinner />}
        {!loading && content}
    </Fragment>

}

const mapStateToProps = state => ({
    uid: state.auth.uid,
    alertMsg: state.alert.msg,
    alertType: state.alert.type
})

export default connect(mapStateToProps, { setAlert })(TodoList)
