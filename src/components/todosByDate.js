import { Fragment } from 'react'
import uuid from 'react-uuid'

import formatDate from '../utility/formatDate'
import Card from '../UI/Card/Card'

const TodosByDate = ({ todosByDate }) => {

    console.log(todosByDate)
    
    let content
    content = (<Fragment>
        {todosByDate.map(todo => <Fragment key={uuid()}>

            <p className='badge badge-primary my-top-1'>{todo.date}</p>

            {todo.todos.map(todo => {
                return <Fragment key={todo.todo.todoId}>
                    <Card>
                        <h2 className='my-bottom'>Title: {todo.todo.title}</h2>

                        <p className='my-bottom'>Description: {todo.todo.desc}</p>

                        {typeof todo.todo.createdAt.seconds === 'number' && <p style={{ fontSize: '0.8rem' }}>Created At: {JSON.stringify(formatDate(todo.todo.createdAt.seconds))}</p>}

                        {typeof todo.todo.createdAt.seconds === 'string' && <p style={{ fontSize: '0.8rem' }}>Created At: {todo.todo.createdAt.seconds}</p>}

                        {todo.todo.completedAt && <p style={{ fontSize: '0.8rem' }}>Completed at: {JSON.stringify(formatDate(todo.todo.completedAt))}</p>}

                    </Card>
                </Fragment>
            })}
        </Fragment>)}
    </Fragment>)

    return <Fragment>
        <h3 style={{marginTop: '2rem'}}>Sectioned by date</h3>

        <p className='my-bottom-1'>(*Please go to the default list view to perform delete operations and for updated todo items )</p>
        
        {content}
    </Fragment>
}

export default TodosByDate