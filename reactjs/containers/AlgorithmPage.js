import React from "react"
import { connect } from "react-redux"

@connect(state => ({
  algorithm: state.algorithm
}))
export default class AlgorithmPage extends React.Component {
    render() {
      let renderItem = (item) => { return (<Individual key={item.data} item={item} />) }

      return (
        <div>
          <Individual item={this.props.algorithm.currentBestIndividual} />
          <div className="row">
            {this.props.algorithm.individuals.map(renderItem)}
          </div>
        </ul>
      )
    }
}

class Individual extends React.Component {

  onSearchTextChange = (event) => {
    this.props.dispatch(algorithmActions.individualValueChange(this.props.item.data, event.target.value))
  }

  onSubmit = (event) => {
    this.props.dispatch(algorithmActions.individualSubmitValue(this.props.item.data, this.props.item.value))
  }

  render() {
    var template = this.props.algorithm.template
    var properties this.props.algorithm.properties
    var jsonData = JSON.parse(this.props.item.data)

    var xmlString = template;
    properties.forEach(function(property) {
      xmlString = xmlString.replace("{{" + property.name + "}}", jsonData[property.name])
    });


    let loading = this.props.item.loading ? <p>Loading ...</p> : <p></p>

    return (
      <div className="col-md-4">
        <div className="thumbnail">
          <div>
            {xmlString}
          </div>
          {loading}
          <div className="form-inline">
            <div className="form-group">
              <label className="sr-only">Value</label>
              <input type="number"
                     className="form-control"
                     value={this.props.item.value}
                     onChange={this.onValueChange} />
            </div>
            <button className="btn btn-default"
                    onClick={this.onSubmit}>-></button>
          </div>
        </div>
      </div>
    )
  }
}

