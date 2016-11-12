import { request } from "../utils"

export const SUBMIT_INDIVIDUAL_VALUE = "SUBMIT_INDIVIDUAL_VALUE"
export const SUBMIT_INDIVIDUAL_VALUE_RESPONSE = "SUBMIT_INDIVIDUAL_VALUE_RESPONSE"
export const INDIVIDUAL_VALUE_CHANGE = "INDIVIDUAL_VALUE_CHANGE"
export const FETCH_INDIVIDUALS = "FETCH_INDIVIDUALS"
export const FETCH_INDIVIDUALS_RESPONSE = "FETCH_INDIVIDUALS_RESPONSE"
export const FETCH_ALGORITHMS = "FETCH_ALGORITHMS"
export const FETCH_ALGORITHMS_RESPONSE = "FETCH_ALGORITHMS_RESPONSE"

export function submitIndividualValue(algorithmId, individualId, newValue) {
  return function (dispatch) {
    let url = process.env.BASE_API_URL + "algorithms/" + algorithmId + "/individuals/update"
    dispatch({type: SUBMIT_INDIVIDUAL_VALUE, individualId: individualId, value: newValue})
    return request(
      url, {
        method: 'POST',
        body: JSON.stringify({
            individual_id: individualId,
            value: newValue
        })
      },
      (json) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: 'SUCCESS', individualId: individualId, value: newValue, res: json}) },
      (json) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: '400', res: json}) },
      (res) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: '500', res: res}) },
      (ex) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: 'FAILURE', error: ex}) },
    )
  }
}

export const RESET_ALGORITHM = "RESET_ALGORITHM"
export const RESET_ALGORITHM_RESPONSE = "RESET_ALGORITHM_RESPONSE"

export function resetAlgorithm(algorithmId) {
  return function (dispatch) {
    let url = process.env.BASE_API_URL + "algorithms/" + algorithmId + "/reset"
    dispatch({type: RESET_ALGORITHM, algorithmId: algorithmId})
    return request(
      url, {
        method: 'POST',
        body: ''
      },
      (json) => { dispatch({type: RESET_ALGORITHM_RESPONSE, status: 'SUCCESS', algorithmId: algorithmId, res: json}) },
      (json) => { dispatch({type: RESET_ALGORITHM_RESPONSE, status: '400', res: json}) },
      (res) => { dispatch({type: RESET_ALGORITHM_RESPONSE, status: '500', res: res}) },
      (ex) => { dispatch({type: RESET_ALGORITHM_RESPONSE, status: 'FAILURE', error: ex}) },
    )
  }
}


export function individualValueChange(individualId, newValue) {
    return {type: INDIVIDUAL_VALUE_CHANGE, individualId: individualId, newValue: newValue}
}

export function fetchIndividuals(algorithmId) {
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

export function fetchAlgorithms() {
    return function(dispatch) {
    let url = process.env.BASE_API_URL + "algorithms"
    dispatch({type: FETCH_ALGORITHMS})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_ALGORITHMS_RESPONSE, status: 'SUCCESS', res: json}) },
      (json) => { dispatch({type: FETCH_ALGORITHMS_RESPONSE, status: '400', res: json}) },
      (res) =>  { dispatch({type: FETCH_ALGORITHMS_RESPONSE, status: '500', res: res}) },
      (ex) =>   { dispatch({type: FETCH_ALGORITHMS_RESPONSE, status: 'FAILURE', error: ex}) },
    )
  }
}

export const CLOSE_ALGORITHM = 'CLOSE_ALGORITHM'
export const OPEN_ALGORITHM = 'OPEN_ALGORITHM'

export function openAlgorithm(algorithmId) {
    return {type: OPEN_ALGORITHM, algorithmId: algorithmId}
}

export function closeAlgorithm() {
    return {type: CLOSE_ALGORITHM}
}