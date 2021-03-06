import React from 'react'
import { Link } from 'react-router-dom'

// STORE
import { connect } from 'react-redux'
import { loadStays, setFilter } from '../store/stay.action.js'
import { toggleModal } from '../store/page.action.js'

// SVG
import search from '../assest/svg/app-header/search.svg'

// SERVICES
import { tripService } from '../services/trip.service.js'
import { utilService } from '../services/util.service.js'

// COMPONENTS
import { GuestsDropDown } from './guests-dropdown.jsx'
import { DateRange as DateRangePicker } from 'react-date-range'
import { SearchSuggestionModal } from './search-sug-modal.jsx'
import 'react-date-range/dist/styles.css' // main css file  
import 'react-date-range/dist/theme/default.css' // theme css file


export class _TripFilter extends React.Component {
    state = {
        filterBy: {
            loc: '',
            capacity: 0
        },
        trip: {
            stayTime: {
                startDate: 0,
                endDate: 0,
            },
            guests: {
                adults: 1,
                children: 0
            },
            stay: {
                address: ''
            },
            totalPrice: 0
        },
        dateRangeModal: false,
        guestsModal: false,
        isCityDropDownShown: false
    }

    // CITY HANDLE 
    handleSearchChanges = (ev) => {
        const field = ev.target.name
        const value = ev.target.value
        this.setState((prevState) => ({
            filterBy: { ...prevState.filterBy, [field]: value }
        }))
    }

    handleSelect

    // GUESTS HANDLE
    updateNumOfGuests = (diff, type, ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const { guests } = this.state.trip
        if (guests[type] + diff < 0) return
        guests[type] += diff
        this.setState((prevState) => ({
            trip: { ...prevState.trip, guests },
        }))
    }

    // DATES HANDLE
    handleSelect = (ranges) => {
        let startDate = ranges.selection.startDate.getTime()
        let endDate = ranges.selection.endDate.getTime()
        this.setState((prevState) => ({
            trip: { ...prevState.trip, stayTime: { startDate, endDate } }
        }))
        this.setState({ dateRangeModal: false })
    }

    // FILTER BY ADDRESS
    onSetStayFilter = (ev) => {
        ev.preventDefault()
        const { filterBy, trip } = this.state
        this.props.setFilter(filterBy)
        this.props.loadStays(filterBy)
        tripService.save(trip)
    }

    

    render() {
        const { trip, isCityDropDownShownn } = this.state
        const { guests } = trip
        const { isMiniHeader, modalState, isModalOpen, toggleModal,setFilter,loadStays } = this.props
        const selectionRange = {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
        return (
            <div className="trip-build-container flex">

                {!isMiniHeader && <form action="">
                    <div className="trip-location-selector flex" onClick={() => { isModalOpen ? toggleModal() : toggleModal('searchSuggestion') }}>
                        <div className="trip-destination" >
                            <div className="location-indicator" >Location</div>
                            <input className="search-input"
                                onChange={this.handleSearchChanges}
                                type="text"
                                aria-autocomplete="none"
                                autoCorrect="off"
                                autoComplete="off"
                                name="loc"
                                value={this.state.filterBy.loc}
                                placeholder="Where are you going?"
                            />
                            {modalState.searchSuggestion && <SearchSuggestionModal  handleSearchChanges={this.handleSearchChanges} setFilter={setFilter} loadStays={loadStays} />}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="trip-selections trip-dates-filter" onClick={() => { isModalOpen ? this.props.toggleModal() : this.props.toggleModal('dateRangeModal') }}>
                            <div className="location-indicator">Check in</div>
                            <input readOnly
                                type="text"
                                onChange={this.handleSelect}
                                value={utilService.formattedDates(trip.stayTime.startDate)}
                                name="stayTime"
                                placeholder="Add date" />
                        </div>

                        <div className="trip-selections trip-dates-filter" onClick={() => { isModalOpen ? this.props.toggleModal() : this.props.toggleModal('dateRangeModal') }}>
                            <div className="location-indicator">Check out</div>
                            <input readOnly
                                type="text"
                                onChange={this.handleSelect}
                                value={utilService.formattedDates(trip.stayTime.endDate)}
                                name="stayTime"
                                placeholder="Add date" />
                        </div>

                        <div className="search-btn-container flex">
                            <div onClick={() => { this.props.isModalOpen ? this.props.toggleModal() : this.props.toggleModal('guestsModal') }} className="trip-selections trip-dates-filter">
                                <div>Guests</div>
                                <div>
                                    <input
                                        readOnly
                                        className="search-input"
                                        type="text"
                                        onChange={this.handleSelect}
                                        name="guests"
                                        value={`Adults ${trip.guests.adults}, Childern ${trip.guests.children}`}
                                        placeholder="Add guests"
                                    />
                                </div>
                            </div>

                            <div className="search-btn flex" onClick={this.onSetStayFilter}>
                                <Link className="clean-link" to="/stay">
                                    <div className="img-container flex"><img className="search-btn-img" src={search} alt="" /> </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>}
                {isMiniHeader &&
                    <div onClick={this.props.toggleMiniHeader} className="mini-header-filter flex">
                        <div className="mini-header-content flex">
                            {!this.state.filterBy.loc ? 'Location' : this.state.filterBy.loc}
                        </div>
                        <div className="search-img-btn flex">
                            <div className="img-container flex"><img onClick={this.onSetStayFilter} className="search-btn-img" src={search} alt="" /> </div>
                        </div>

                    </div >}
                {modalState.dateRangeModal && <div className='date-range-container'>
                    <DateRangePicker
                        className="date-range-calender"
                        appearance="default"
                        placeholder="Default"
                        ranges={[selectionRange]}
                        months={2}
                        direction='horizontal'

                        date={new Date()}
                        onChange={this.handleSelect}
                        moveRangeOnFirstSelection={true}
                        hasCustomRendering={false}
                    />
                </div>}
                {modalState.guestsModal && <div>
                    <GuestsDropDown
                        guests={guests}
                        updateNumOfGuests={this.updateNumOfGuests} />
                </div>}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        modalState: state.pageModule.modalState,
        isModalOpen: state.pageModule.isModalOpen
    }
}

const mapDispatchToProps = {
    loadStays,
    setFilter,
    toggleModal
}

export const TripFilter = connect(
    mapStateToProps,
    mapDispatchToProps
)(_TripFilter)