import React from 'react'

// STORE
import { connect } from 'react-redux'
import { loadStays } from '../store/stay.action.js'

// SERVICES
import { firstLetterToUpperCase } from '../services/util.service.js'

// COMPONENTS
import { StayPreview } from './stay-preview.jsx'
import { FilterBar } from './filter-bar.jsx'
import {Loader} from '../cmps/loader.jsx'
class _StayList extends React.Component {

  state = {
    filteredStays: [],
  }

  componentDidMount() {
    this.props.loadStays(this.props.filterBy)
  }

  setFiltersStays = (stays) => {
    this.setState({ filteredStays: stays })
  }

  render() {
    const stays = this.state.filteredStays.length ? this.state.filteredStays : this.props.stays
    const numOfStayText = this.props.filterBy.loc === '' ? 'stays to explore' : `stays in ${firstLetterToUpperCase(this.props.filterBy.loc)}`
    if (!stays.length) return <Loader/>
    return (
      <section className="list-section">
        <div className="text-container">
          <h1 >{stays.length} {numOfStayText} </h1>
          <p>Review COVID-19 travel restrictions before you book. <span>Learn more</span> </p>
        </div>
        <FilterBar setFiltersStays={this.setFiltersStays} stays={this.props.stays} />
        <div className="stay-list">
          {stays.map((stay) => (
            <StayPreview key={stay._id} stay={stay} />
          ))}
        </div>
      </section>
    )
  }
}


function mapStateToProps({ stayModule }) {
  return {
    stays: stayModule.stays,
    filterBy: stayModule.filterBy
  }
}

const mapDispatchToProps = {
  loadStays
}

export const StayList = connect(mapStateToProps, mapDispatchToProps)(_StayList)