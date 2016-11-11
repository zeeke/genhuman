import reducer from './algorithm'
import * as actions from '../actions/algorithmActions'

describe('algorithm reducer', () => {
  it('should work for one item', () => {
    let fetchResponseAction = {
      type: actions.FETCH_INDIVIDUALS_RESPONSE,
      res: {
        items: [
            {
                value: -1,
                data: '{a: 10}'
            }
        ]
      }
    }

    let submitAction = {
      type: actions.SUBMIT_INDIVIDUAL_VALUE,
      individualData: '{a: 10}',
      newValue: 42
    }

    let submitResponseAction = {
      type: actions.SUBMIT_INDIVIDUAL_VALUE_RESPONSE,
      status: 'SUCCESS',
      individualData: '{a: 10}',
      value: 42,
      res: {}
    }

    var state = undefined;

    state = reducer(state, fetchResponseAction)
    expect(state.individuals['{a: 10}'].value).toBe(-1)

    state = reducer(state, submitAction)
    expect(state.individuals['{a: 10}'].loading).toBe(true)

    state = reducer(state, submitResponseAction)
    expect(state.individuals['{a: 10}'].loading).toBe(false)
    expect(state.individuals['{a: 10}'].saved).toBe(true)
    expect(state.individuals['{a: 10}'].value).toBe(42)
  })

  it('should update best individual', () => {

    let fetchResponseAction1 = {
      type: actions.FETCH_INDIVIDUALS_RESPONSE,
      res: {
        items: [
            {
                value: -1,
                data: '{a:100}'
            },
            {
                value: 42,
                data: '{a:42}'
            }
        ]
      }
    }

    let fetchResponseAction2 = {
      type: actions.FETCH_INDIVIDUALS_RESPONSE,
      res: {
        items: [
            {
                value: 100,
                data: '{a:100}'
            },
            {
                value: 42,
                data: '{a:42}'
            }
        ]
      }
    }

    var state = undefined
    state = reducer(state, fetchResponseAction1)

    expect(state.bestIndividual).toBe('{a:42}')

    state = reducer(state, fetchResponseAction2)

    expect(state.bestIndividual).toBe('{a:100}')
  })
})

