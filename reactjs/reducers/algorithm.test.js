import reducer from './algorithm'
import * as actions from '../actions/algorithmActions'

describe('algorithm reducer', () => {
  it('should work for one item', () => {
    let fetchResponseAction = {
      type: actions.FETCH_INDIVIDUALS_RESPONSE,
      res: {
        individuals: [
            {
                id: 666,
                value: -1,
                genoma: { a: 10 }
            }
        ]
      }
    }

    let submitAction = {
      type: actions.SUBMIT_INDIVIDUAL_VALUE,
      individualId: 666,,
      value: 42
    }

    let submitResponseAction = {
      type: actions.SUBMIT_INDIVIDUAL_VALUE_RESPONSE,
      status: 'SUCCESS',
      id: 666,
      value: 42,
      res: {}
    }

    var state = undefined;

    state = reducer(state, fetchResponseAction)
    expect(state.individuals[666].value).toBe(-1)

    state = reducer(state, submitAction)
    expect(state.individuals[666].loading).toBe(true)

    state = reducer(state, submitResponseAction)
    expect(state.individuals[666].loading).toBe(false)
    expect(state.individuals[666].saved).toBe(true)
    expect(state.individuals[666].value).toBe(42)
  })

  it('should update best individual', () => {

    let fetchResponseAction1 = {
      type: actions.FETCH_INDIVIDUALS_RESPONSE,
      res: {
        meta: {},
        items: [
            {
                id: 666,
                value: -1,
                genoma: { a: 10 }
            },
            {
                id: 777,
                value: 42,
                genoma: { a: 42 }
            }
        ]
      }
    }

    let fetchResponseAction2 = {
      type: actions.FETCH_INDIVIDUALS_RESPONSE,
      res: {
        meta: {},
        items: [
            {
                id: 666,
                value: 100,
                genoma: { a: 10 }
            },
            {
                id: 777,
                value: 42,
                genoma: { a: 42 }
            }
        ]
      }
    }

    var state = undefined
    state = reducer(state, fetchResponseAction1)

    expect(state.bestIndividual).toBe(777)

    state = reducer(state, fetchResponseAction2)

    expect(state.bestIndividual).toBe(666)
  })
})

