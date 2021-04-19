import { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { loadUser, signout } from '../store/actions'
import { auth } from '../firebase'
import Todo from '../containers/todo'
import TodoList from '../containers/todoList'
import Spinner from '../UI/spinner/spinner'

const Dashboard = ({ loadUser, isAuthenticated, username, loading, signout }) => {

    //google sign in instance
    var googleProvider = new auth.GoogleAuthProvider()

    //fb signin instance
    var fbProvider = new auth.FacebookAuthProvider();

    const [showSpinner, setShowSpinner] = useState(false)
    const [renderTodoList, setRenderTodolist] = useState(false)

    const todoListRenderer = () => setRenderTodolist(!renderTodoList)

    //checking auth status on firebase
    const checkAuthStatus = () => {
        setShowSpinner(true)
        auth().onAuthStateChanged(user => {
            if (user) {
                setShowSpinner(false)
                loadUser(user.providerData[0].displayName, user.providerData[0].uid)
            } else {
                setShowSpinner(false)
            }
        })
    }

    //upon mounting of <dashboard>, checking auth status
    useEffect(() => {
        checkAuthStatus()
    }, [])

    const loginHandler = provider => {
        auth()
            .signInWithPopup(provider)
            .then((result) => {
                // The signed-in user info.
                let user = result.user.providerData[0];
                localStorage.setItem('uid', user.uid)
                loadUser(user.displayName, user.uid)
            }).catch(error => console.log(error));
    }

    const signoutHandler = () => {
        auth().signOut().then(() => {
            console.log('signed out !')
            signout()
        }).catch((error) => console.log(error));
    }

    let content = isAuthenticated && !loading ?
        <div>
            <h2 className='my-top-1 my-bottom'><i className="fas fa-user"></i> Welcome {username} <button className='btn btn-danger' style={{ marginLeft: '2%' }} onClick={signoutHandler}><i className="fa fa-sign-out-alt"></i> Sign Out</button></h2>

            <Todo todoListRenderer={todoListRenderer} />

            <TodoList renderTodoList={renderTodoList} />
        </div>
        : <Fragment>
            <p className='my-top-1 my-bottom-1 medium'>You need to log in to continue</p>

            <button className='btn btn-danger btn-large' onClick={() => loginHandler(googleProvider)}><i className="fab fa-google"></i> Sign in with Google</button>
            
            <button className='btn btn-primary btn-large' onClick={() => loginHandler(fbProvider)}><i className="fab fa-facebook"></i> Sign in with Facebook</button>
        </Fragment>

    if (showSpinner) content = <Spinner />

    return <Fragment>
        <div className='container center'>
            <p className='large'><i className="fas fa-tasks"></i> ToDo App</p>
            {content}
        </div>
    </Fragment>
}

const mapStateToProps = state => ({
    loading: state.auth.loading,
    username: state.auth.username,
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { loadUser, signout })(Dashboard)