import { request } from "../utils"

export const SEARCH = "SEARCH"
export const SEARCH_RESPONSE = "SEARCH_RESPONSE"
export const SEARCH_TEXT_CHANGE = "SEARCH_TEXT_CHANGE"

export function search(searchText) {
  return function (dispatch) {
    let url = process.env.BASE_API_URL + "search?query=" + searchText
    dispatch({type: SEARCH})
    return request(
      url, {},
      (json) => { dispatch({type: SEARCH_RESPONSE, status: 'SUCCESS', res: json}) },
      (json) => { dispatch({type: SEARCH_RESPONSE, status: '400', res: json}) },
      (res) => { dispatch({type: SEARCH_RESPONSE, status: '500', res: res}) },
      (ex) => { dispatch({type: SEARCH_RESPONSE, status: 'FAILURE', error: ex}) },
    )
  }
}

export function searchTextChange(newText) {
    return {type: SEARCH_TEXT_CHANGE, newText: newText}
}
