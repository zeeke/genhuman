import { request } from "../utils"

export const SUBMIT_INDIVIDUAL_VALUE = "SUBMIT_INDIVIDUAL_VALUE"
export const SUBMIT_INDIVIDUAL_VALUE_RESPONSE = "SUBMIT_INDIVIDUAL_VALUE_RESPONSE"
export const INDIVIDUAL_VALUE_CHANGE = "INDIVIDUAL_VALUE_CHANGE"
export const FETCH_INDIVIDUALS = "FETCH_INDIVIDUALS"
export const FETCH_INDIVIDUALS_RESPONSE = "FETCH_INDIVIDUALS_RESPONSE"

export function submitIndividualValue(algorithmId, individualData, newValue) {
  return function (dispatch) {
    let url = process.env.BASE_API_URL + "algorithms/" + algorithmId + "/individuals/update"
    dispatch({type: SUBMIT_INDIVIDUAL_VALUE, individualId: individualId, value: newValue})
    return request(
      url, {
        method: 'POST',
        body: {
            individual_id: individualId,
            value: newValue
        }
      },
      (json) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: 'SUCCESS', individualId: individualId, value: newValue, res: json}) },
      (json) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: '400', res: json}) },
      (res) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: '500', res: res}) },
      (ex) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: 'FAILURE', error: ex}) },
    )
  }
}

export function individualValueChange(individualId, newValue) {
    return {type: INDIVIDUAL_VALUE_CHANGE, individualId: individualId, newValue: newValue}
}

export function fetchIndividuals() {
  return function(dispatch) {
    let url = process.env.BASE_API_URL + "algorithms/" + algorithmId + "/individuals"
    dispatch({type: FETCH_INDIVIDUALS, algorithmId: algorithmId})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_INDIVIDUALS_RESPONSE, status: 'SUCCESS', res: json}) },
      (json) => { dispatch({type: FETCH_INDIVIDUALS_RESPONSE, status: '400', res: json}) },
      (res) =>  { dispatch({type: FETCH_INDIVIDUALS_RESPONSE, status: '500', res: res}) },
      (ex) =>   { dispatch({type: FETCH_INDIVIDUALS_RESPONSE, status: 'FAILURE', error: ex}) },
    )
  }
}
