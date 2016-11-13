import * as actions from "../actions/algorithmActions"
import update from 'react-addons-update'

const initialState = {
  fetchingData: false,
  currentBestIndividual: '',
  individuals: {},
  algorithms: [],
  currentAlgorithm: undefined,
  ajaxCalls: 0
}

export default function submission(state=initialState, action={}) {
  if (action.hasOwnProperty('status') && action.status != 'SUCCESS') {
    throw new Error(action)
  }

  switch(action.type) {
    case actions.INDIVIDUAL_VALUE_CHANGE:
        return update(state, {
            individuals: {
                [action.individualId]: {
                    value: {$set: action.newValue},
                    saved: {$set: false}
                }
            }
        })

    case actions.SUBMIT_INDIVIDUAL_VALUE:
        return update(state, {
            individuals: {
                [action.individualId]: {
                    saved: {$set: false},
                    loading: {$set: true}
                }
            }
        })

    case actions.SUBMIT_INDIVIDUAL_VALUE_RESPONSE:
        return update(state, {
            individuals: {
                [action.individualId]: {
                    value: {$set: action.value},
                    saved: {$set: true},
                    loading: {$set: false}
                }
            }
        })

    case actions.FETCH_INDIVIDUALS:
        return {...state, fetchingData: true}

    case actions.FETCH_INDIVIDUALS_RESPONSE:
        let indexedIndividuals = {}
        var bestValue = -1
        var bestIndividual = ''

        action.res.items.forEach((item) => {
            indexedIndividuals[item.id] = {
                    ...item,
                    saved: item.value != -1,
                    loading: false
            }

            if (item.value >= bestValue) {
              bestValue = item.value
              bestIndividual = item.id
            }
        })

        return {...state,
                  individuals: indexedIndividuals,
                  fetchingData: false,
                  bestIndividual: bestIndividual
               }

    case actions.FETCH_ALGORITHMS:
        return {...state,
            fetchingData:true
        }

    case actions.FETCH_ALGORITHMS_RESPONSE:
        return {...state, algorithms: action.res.items}

    case actions.OPEN_ALGORITHM:
        return {...state,
            currentAlgorithm: state.algorithms.find((algorithm) => algorithm.id == action.algorithmId)
        }

    case actions.CLOSE_ALGORITHM:
        return {...state,
            currentAlgorithm: undefined
        }

    case actions.RESET_ALGORITHM:
        return {...state,
            ajaxCalls: state.ajaxCalls + 1
        }

    case actions.RESET_ALGORITHM_RESPONSE:
        return {...state,
            individuals: [],
            currentBestIndividual: undefined,
            ajaxCalls: state.ajaxCalls - 1
        }

    default:
      return state;
  }
}

