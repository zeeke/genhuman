import { request } from "../utils"

export const SUBMIT_INDIVIDUAL_VALUE = "SUBMIT_INDIVIDUAL_VALUE"
export const SUBMIT_INDIVIDUAL_VALUE_RESPONSE = "SUBMIT_INDIVIDUAL_VALUE_RESPONSE"
export const INDIVIDUAL_VALUE_CHANGE = "INDIVIDUAL_VALUE_CHANGE"

export function submitIndividualValue(individualData, newValue) {
  return function (dispatch) {
    let url = process.env.BASE_API_URL + "submitIndividualValue"
    dispatch({type: SUBMIT_INDIVIDUAL_VALUE})
    return request(
      url, {
        method: 'POST',
        body: {
            data: individualData
        }
      },
      (json) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: 'SUCCESS', res: json}) },
      (json) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: '400', res: json}) },
      (res) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: '500', res: res}) },
      (ex) => { dispatch({type: SUBMIT_INDIVIDUAL_VALUE_RESPONSE, status: 'FAILURE', error: ex}) },
    )
  }
}

export function individualValueChange(individualData, newValue) {
    return {type: INDIVIDUAL_VALUE_CHANGE, individualData: individualData, newValue: newValue}
}
