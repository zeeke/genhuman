import React from "react"
import { FormGroup, FormControl, Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap'
import { connect } from "react-redux"
import * as searchActions from "../actions/searchActions"

export default class SearchContainer extends React.Component {
    render() {
        return (<div>
            <SearchForm />
            <EventList />
        </div>)
    }
}

@connect(state => ({
    searchText: state.search.searchText
}))
class SearchForm extends React.Component {

    handleClick = (event) => {
        console.log(event.target.value);
        this.props.dispatch(searchActions.search(this.props.searchText))
    }

    onSearchTextChange = (event) => {
        this.props.dispatch(searchActions.searchTextChange(event.target.value));
    }

    render() {
      return (
        <Grid>
          <Row>
            <Col md={9}>
              <FormGroup>
                <FormControl
                        value={this.props.searchText}
                        onChange={this.onSearchTextChange}
                        type="text"
                        placeholder="Search for events" />

              </FormGroup>
            </Col>
            <Col md={3}>
             <Button
                   block
                   onClick={this.handleClick}>
                <Glyphicon glyph="search" />
              </Button>
            </Col>
          </Row>
        </Grid>
      );
    }
}

@connect(state => ({
    items: state.search.items
}))
class EventList extends React.Component {
    render() {

      let renderItem = (item) => { return (<li key={item.id}>{item.id} - {item.name}</li>) }

      return (
        <ul>
            {this.props.items.map(renderItem)}
        </ul>
      )
    }
}
