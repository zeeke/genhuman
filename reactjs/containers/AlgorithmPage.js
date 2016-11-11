import React from "react"
import { connect } from "react-redux"

@connect(state => ({
  algorithm: state.algorithm
}))
export default class AlgorithmPage extends React.Component {

    onRefresh = (event) => {
      this.props.dispatch(actions.fetchIndividuals())
    }

    render() {
      let renderItem = (item) => { return (<Individual key={item.id} item={item} />) }

      return (
        <div>
          <Individual item={this.props.algorithm.currentBestIndividual} />
          <button className="btn btn-primary" onClick={this.onRefresh}>Refresh</button>
          <div className="row">
            {this.props.algorithm.individuals.map(renderItem)}
          </div>
        </ul>
      )
    }
}

class Individual extends React.Component {

  onSearchTextChange = (event) => {
    this.props.dispatch(algorithmActions.individualValueChange(this.props.item.id, event.target.value))
  }

  onSubmit = (event) => {
    this.props.dispatch(algorithmActions.individualSubmitValue(this.props.item.id, this.props.item.value))
  }

  render() {
    var template = this.props.algorithm.template
    var genes this.props.algorithm.genes
    var jsonData = JSON.parse(this.props.item.genoma)

    var xmlString = template;
    genes.forEach(function(gene) {
        // TODO - Client conversion
      xmlString = xmlString.replace("{{" + gene.name + "}}", jsonData[gene.name])
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

