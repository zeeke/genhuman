import * as actions from "../actions/searchActions"

const initialState = {
  items: [],
  loading: false,
  searchText: ''
}

export default function submissions(state=initialState, action={}) {
  switch (action.type) {
  case actions.SEARCH:
    return {...state, loading: true}
  case actions.SEARCH_RESPONSE:
    switch (action.status) {
      case 'SUCCESS':
        return {...state, loading: false, items: action.res.items}
      case 'FAILURE':
      case '400':
      case '500':
        return {...state, loading: false}
    }
  case actions.SEARCH_TEXT_CHANGE:
    return {...state, searchText: action.newText}
  default:
    return state
  }
}
