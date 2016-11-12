import React from "react"
import { connect } from "react-redux"
import * as algorithmActions from "../actions/algorithmActions"

@connect(state => (
    state.algorithms
))
export default class AlgorithmPage extends React.Component {

    onRefresh = (event) => {
      this.props.dispatch(algorithmActions.fetchIndividuals(this.props.currentAlgorithm.id))
    }

    onReset = (event) => {
        this.props.dispatch(algorithmActions.resetAlgorithm(this.props.currentAlgorithm.id))
    }

    render() {
      let renderItem = (key) => {
        return (<Individual key={key}
                            item={this.props.individuals[key]}
                            dispatch={this.props.dispatch}
                            algorithm={this.props.currentAlgorithm} />)
      }

      return (
        <div>
          {/* <Individual item={this.props.currentBestIndividual} /> */}
          <button className="btn btn-primary" onClick={this.onRefresh}>Refresh</button>
          <button className="btn btn-primary" onClick={this.onReset}>Reset</button>
          <div className="row">
            {Object.keys(this.props.individuals).map(renderItem)}
          </div>
        </div>
      )
    }
}

class Individual extends React.Component {

  onValueChange = (event) => {
    this.props.dispatch(algorithmActions.individualValueChange(this.props.item.id, event.target.value))
  }

  onSubmit = (event) => {
    this.props.dispatch(algorithmActions.submitIndividualValue(this.props.algorithm.id, this.props.item.id, this.props.item.value))
  }

  render() {
    var template = this.props.algorithm.template
    var genes = this.props.algorithm.genes
    var jsonData = this.props.item.genoma

    var xmlString = template;
    genes.forEach(function(gene) {
        // TODO - Client conversion
      xmlString = xmlString.replace("{{" + gene.name + "}}", jsonData[gene.name])
    });


    let loading = this.props.item.loading ? <p>Loading ...</p> : <p></p>

    return (
      <div className="col-md-4">
        <div className="thumbnail">
          <div className="template-view" dangerouslySetInnerHTML={{__html: xmlString}}>
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

