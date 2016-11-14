import React from "react"
import { connect } from "react-redux"
import * as algorithmActions from "../actions/algorithmActions"
import { Link } from 'react-router'
import AlgorithmPage from './AlgorithmPage'

@connect(state => (
   state.algorithms
))
export default class StartPage extends React.Component {

    componentDidMount() {
      this.props.dispatch(algorithmActions.fetchAlgorithms())
    }

    render() {
      let renderItem = (item) => {
        return (<AlgorithmItem key={item.id} dispatch={this.props.dispatch} item={item} />)
      }

      var currentAlgorithmSection = this.props.currentAlgorithm == undefined ? '' : (<AlgorithmPage />)
      return (
        <div>
            {this.props.algorithms.map(renderItem)}
            {currentAlgorithmSection}
        </div>
      )
    }
}

class AlgorithmItem extends React.Component {

  onSelectAlgorithm = (event) => {
    this.props.dispatch(algorithmActions.openAlgorithm(this.props.item.id))
  }

  render() {
    return (
      <div key={this.props.item.id}>
        <button className="btn btn-primary"
                onClick={this.onSelectAlgorithm}>
                {this.props.item.title}
        </button>
      </div>
    )
  }
}
