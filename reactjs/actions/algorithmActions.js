import { request } from "../utils"

export const SUBMIT_INDIVIDUAL_VALUE = "SUBMIT_INDIVIDUAL_VALUE"
export const SUBMIT_INDIVIDUAL_VALUE_RESPONSE = "SUBMIT_INDIVIDUAL_VALUE_RESPONSE"
export const INDIVIDUAL_VALUE_CHANGE = "INDIVIDUAL_VALUE_CHANGE"
export const FETCH_INDIVIDUALS = "FETCH_INDIVIDUALS"
export const FETCH_INDIVIDUALS_RESPONSE = "FETCH_INDIVIDUALS_RESPONSE"

export function submitIndividualValue(algorithmId, individualData, newValue) {
  return function (dispatch) {
    let url = process.env.BASE_API_URL + "algorithms/" + algorithmId + "/submitIndividualValue"
    dispatch({type: SUBMIT_INDIVIDUAL_VALUE, individualData: individualData, value: newValue})
    return request(
      url, {
        method: 'POST',
        body: {
            individualData: individualData,
            value: newValue
        }
      },
      (json) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: 'SUCCESS', individualData: individualData, value: newValue, res: json}) },
      (json) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: '400', res: json}) },
      (res) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: '500', res: res}) },
      (ex) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: 'FAILURE', error: ex}) },
    )
  }
}

export function individualValueChange(individualData, newValue) {
    return {type: INDIVIDUAL_VALUE_CHANGE, individualData: individualData, newValue: newValue}
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
