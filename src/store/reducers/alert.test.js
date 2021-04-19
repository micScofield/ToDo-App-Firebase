import { configure } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import reducer from './alert'

configure({adapter: new EnzymeAdapter()})

describe('Auth reducer', () => {
    let wrapper;
    const initialState = {      
        msg: null,
        type: null
    }
    it('should return initial state', () => {
        wrapper = reducer(undefined, {} )   // two JS args, initial state, and action. Action can be {} for simulation
        expect(wrapper).toEqual(initialState)
    })
})