import React from "react"
import { connect } from "react-redux"
import * as algorithmActions from "../actions/algorithmActions"
import _ from 'underscore'

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

  onKeyPress = (event) => {
    if (event.key == 'Enter') {
        this.props.dispatch(algorithmActions.submitIndividualValue(this.props.algorithm.id, this.props.item.id, this.props.item.value))
    }
  }

  onSubmit = (event) => {
    this.props.dispatch(algorithmActions.submitIndividualValue(this.props.algorithm.id, this.props.item.id, this.props.item.value))
  }

  getClientValue = (jsonData, gene) => {
    switch(gene.gene_type) {
        case 'COLOR':
            return `rgb(${JSON.parse(jsonData[gene.name]).join(',')})`
        case 'FLOAT':
            return jsonData[gene.name]
        default:
            throw new Error("Cannot convert gene type " + gene.gene_type)
    }
  }

  render() {
    var template = this.props.algorithm.template
    var genes = this.props.algorithm.genes
    var jsonData = this.props.item.genoma

    var toShowData = {}

    genes.forEach(function(gene) {
      toShowData[gene.name] = this.getClientValue(jsonData, gene)
      //xmlString = xmlString.replace(new RegExp("{{" + gene.name + "}}", 'g'), this.getClientValue(jsonData, gene))
    }.bind(this));

    var xmlString = _.template(template)(toShowData) //Mustache.render(template, toShowData);

    let loading = this.props.item.loading ? <p>Loading ...</p> : <p></p>

    return (
      <div className="col-md-2">
        <div className="thumbnail">
          <div className="template-view" dangerouslySetInnerHTML={{__html: xmlString}}>
          </div>
          {loading}
          <div className="row">
            <div className={ "col-md-8 form-group " + (this.props.item.saved ? 'has-success': '') } >
              <label className="sr-only">Value</label>
              <input type="number"
                     className="form-control"
                     value={this.props.item.value}
                     onChange={this.onValueChange}
                     onKeyPress={this.onKeyPress} />
            </div>
            <button className="btn btn-default"
                    onClick={this.onSubmit}>-></button>
          </div>
          <pre className="hidden">{JSON.stringify(toShowData, null, 2)}</pre>
        </div>
      </div>
    )
  }
}

