import React from "react"
import { connect } from "react-redux"

@connect(state => ({
  algorithms: state.algorithms
}))
export default class StartPage extends React.Component {
    render() {
      let renderItem = (item) => { return (<AlgorithmItem key={item.id} item={item} />) }

      return (
        <div>
            <p>{this.props.algorithm.status}</p>
            {this.props.items.map(renderItem)}
        </div>
      )
    }
}

class AlgorithmItem extends React.Component {
  render() {
    return (
      <div>{this.props.item.id}</div>
    )
  }
}

