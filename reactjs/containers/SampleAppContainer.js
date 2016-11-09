import React from "react"
import Radium from "radium"
import { Router, Route, Link } from 'react-router'

import { connect } from "react-redux"

import * as counterActions from "../actions/counterActions"
import Headline from "../components/Headline"
import StartPage from './StartPage'

const styles = {
  button: {
    cursor: "pointer",
  },
  counter: {
    color: "blue",
    fontSize: "20px",
  }
}

@connect(state => ({
  counters: state.counters,
}))
@Radium
export default class SampleAppContainer extends React.Component {
  handleClick() {
    let {dispatch} = this.props;
    dispatch(counterActions.increaseCounter())
  }

  state = {
  }

  render() {
    let {counters} = this.props

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Headline>Sample App!</Headline>
            <Router history={browserHistory}>
              <Route path="/" component={StartPage}>
                <Route path="algorithms/:algorithmsId" component={AlgorithmPage} />
              </Route>
            </Router>
          </div>
        </div>
      </div>
    )
  }
}
