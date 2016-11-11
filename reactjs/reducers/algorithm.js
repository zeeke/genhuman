import * as actions from "../actions/algorithmActions"
import update from 'react-addons-update'

const initialState = {
  fetchingData: false,
  currentBestIndividual: '',
  individuals: {}
}

export default function submission(state=initialState, action={}) {
  switch(action.type) {
    case actions.INDIVIDUAL_VALUE_CHANGE:
        console.log(state);
        return update(state, {
            individuals: {
                [action.individualData]: {
                    value: {$set: action.newValue}
                }
            }
        })

    case actions.SUBMIT_INDIVIDUAL_VALUE:
        return update(state, {
            individuals: {
                [action.individualData]: {
                    saved: {$set: false},
                    loading: {$set: true}
                }
            }
        })

    case actions.SUBMIT_INDIVIDUAL_VALUE_RESPONSE:
        return update(state, {
            individuals: {
                [action.individualData]: {
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
            indexedIndividuals[item.data] = {
                    ...item,
                    saved: item.value != -1,
                    loading: false
            }

            if (item.value >= bestValue) {
              bestValue = item.value
              bestIndividual = item.data
            }
        })

        return {...state,
                  individuals: indexedIndividuals,
                  fetchingData: false,
                  bestIndividual: bestIndividual
               }

    default:
      return state;
  }
}

