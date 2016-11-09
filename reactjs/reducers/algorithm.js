import * as actions from "../actions/algorithmActions"
import update from 'react-addons-update'

const initialState = {
  allgorithm: {
    currentBestIndividual: {},
    individuals: {}
  }
}

export default function submission(state=initialState, action={}) {
  switch(action.type) {
    case actions.INDIVIDUAL_VALUE_CHANGE:
        return update(state, {
            individuals: {
                action.individualData: {
                    value: {$set: action.newValue}
                }
            }
        })

    case actions.SUBMIT_INDIVIDUAL_VALUE:
        return {...state, loading: true}
    case actions.SUBMIT_INDIVIDUAL_VALUE_RESPONSE:
  }
}

