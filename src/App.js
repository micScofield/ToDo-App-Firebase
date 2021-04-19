import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom'

import Dashboard from './containers/dashboard'

import './App.css'

const App = props => {
    const routes = (
        <Switch>
            <Route path='/' exact component={Dashboard} />
            <Redirect to='/' />
        </Switch>
    )
    return <Router>{routes}</Router>
}

export default App
