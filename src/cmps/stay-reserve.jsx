import React from 'react'

// STORE 
import { connect } from 'react-redux'
import { addOrder, updateUnreadCount } from '../store/order/order.actions.js'
import { toggleModal } from '../store/page.action.js'

// LIBS
import { DateRange as DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main css file  
import 'react-date-range/dist/theme/default.css' // theme css file

// SERVICES
import { tripService } from '../services/trip.service.js'
import { utilService } from "../services/util.service.js";

// COMPONENTS
import { GuestsDropDown } from './guests-dropdown.jsx'

// SVG
import Star from '../assest/svg/app-detials/star.svg'
import Flag from '../assest/svg/app-detials/flag.svg'

class _StayReserve extends React.Component {
    state = {
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
        },
        isTripCreated: false,
        istBtnDisabled: false,
        isStayTimePicked: false,
        totalPrice: this.props.stay.price,
    }

    componentDidMount() {
        const { stay } = this.props
        tripService.query().then(trip => {
            this.setState({ trip: { ...trip, stay: { address: stay.loc.address } } })
        })
    }

    onAddTrip = (ev) => {
        ev.preventDefault()
        let { trip } = this.state
        tripService.save(trip)
        this.setState({ MenuDropDownModal: false, isTripCreated: true })
    }

    toggleDisableBtn = () => {
        this.setState({ istBtnDisabled: true }, () => {
            setTimeout(() => {
                this.setState({ istBtnDisabled: false })
            }, 5000)
        })
    }

    onCreateOrder = () => {
        const { trip, totalPrice } = this.state
        let price = (totalPrice * 0.15) + (totalPrice * 0.1) + (totalPrice * 0.05)
        const orderToSave = {
            host: this.props.stay.host,
            createdAt: Date.now(),
            buyer: {
                _id: this.props.user._id,
                fullname: this.props.user.fullname,
            },
            totalPrice: price,
            startDate: trip.stayTime.startDate,
            endDate: trip.stayTime.endDate,
            guests: trip.guests,
            stay: {
                _id: this.props.stay._id,
                name: this.props.stay.name,
                price: this.props.stay.price
            },
            image: this.props.stay.imgUrls[0],
            status: 'pending',
            isRead: false
        }
        this.props.addOrder(orderToSave)
        this.toggleDisableBtn()
        this.setState({ totalPrice: orderToSave.totalPrice })
        this.clearState()
    }

    onSetFilterBy = (filterBy) => {
        this.props.setFilterBy(filterBy)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.filterBy !== this.props.filterBy) {
            this.props.loadStays(this.props.filterBy)
        }
    }

    handleSelect = (ranges) => {
        const { trip } = this.state
        let startDate = ranges.selection.startDate.getTime()
        let endDate = ranges.selection.endDate.getTime()
        let price = this.props.stay.price * (endDate - startDate) / 1000 / 60 / 60 / 24
        this.setState((prevState) => ({
            trip: { ...prevState.trip, stayTime: { startDate: startDate, endDate: endDate } }
        }))
        this.setState({ MenuDropDownModal: false, isStayTimePicked: this.state.isStayTimePicked = true, totalPrice: price })
    }

    clearState = () => {
        this.setState({ trip: { stayTime: { startDate: '', endDate: '', }, guests: { adults: 1, children: 0 }, stay: { address: '' } }, totalPrice: this.props.stay.price })
    }

    updateNumOfGuests = (diff, type, ev) => {
        ev.stopPropagation()
        const { guests } = this.state.trip
        if (guests[type] + diff < 0) return
        guests[type] += diff
        this.setState((prevState) => ({
            trip: { ...prevState.trip, guests },
        }))
    }

    onHandleChange = ({ target }) => {
        const { trip } = this.state
        const value = target.type === 'number' ? +target.value : target.value
        if (value < 1) return
        this.setState((prevState) => ({
            trip: { ...prevState.trip, guests: { adults: value, children: trip.guests.children } }
        }))
    }

    // getCells() {
    //     const cells = []
    //     for (let i = 0; i < 100; i++) {
    //         cells.push(<div key={`cell-${i}`} className="cell"></div>)
    //     }
    //     return cells
    // }

    render() {
        const { isTripCreated, trip, isStayTimePicked, totalPrice } = this.state
        const { guests, stayTime } = trip
        const { toggleModal, isModalOpen, modalState } = this.props
        const selectionRange = {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
        return <main>
            <section className="order-container">
                <div className="order-form-header">
                    <p><span className="cost">${this.props.stay.price}</span> / night</p>
                    <p> <img src={Star} alt="" />{this.props.stay.avgRate} <span className="dot">· </span><span className="reviews">({this.props.stay.reviews.length} reviews)</span></p>
                </div>

                <div className="order-data">
                    <div className="date-picker">
                        <div className="date-input">
                            <label onClick={() => { isModalOpen ? toggleModal() : toggleModal('datePickerModal') }} >CHECK-IN</label>
                            <input onChange={this.handleSelect} value={utilService.formattedDates(stayTime.startDate)} name="stayTime" placeholder="Add date"></input>
                            <div>{trip.startDate}</div>
                        </div>
                        <div className="date-input">
                            <label onClick={() => { isModalOpen ? toggleModal() : toggleModal('datePickerModal') }} >CHECKOUT</label>
                            <input onChange={this.handleSelect} value={utilService.formattedDates(stayTime.endDate)} name="stayTime" placeholder="Add date"></input>
                            <div>{trip.endDate}</div>
                        </div>
                    </div>
                    <div className="guest-input" onClick={() => { isModalOpen ? toggleModal() : toggleModal('reserveGuestsModal') }} >
                        <label>GUESTS</label>
                        <input readOnly value={trip.guests.adults + trip.guests.children} name="guests" onChange={this.onHandleChange} placeholder="1 guest"></input>
                    </div>
                </div>
                {isTripCreated ?
                    <div onClick={this.onCreateOrder} className={this.state.istBtnDisabled ? "btn-container disabled" : "btn-container"}>
                        {utilService.getCells()}
                        <div className="content">
                            <button className="action-btn" >
                                <span>Reserve</span>
                            </button>
                        </div>
                    </div>
                    : <div onClick={this.onAddTrip} className="btn-container">
                        {utilService.getCells()}
                        <div className="content">
                            <button className="action-btn" >
                                <span>Check availability</span>
                            </button>
                        </div>
                    </div>
                }
                {isStayTimePicked &&
                    <div>
                        <ul className="clean-list reserve-charge-notification">
                            <li className="reserve-charge-notification-txt">You won't be charged yet</li>
                        </ul>
                        <div className="reserve-charge-breakdown">
                            <div className="reserve-charge-row flex">
                                <span className="reserve-charge-txt">
                                    ${this.props.stay.price} x {(trip.stayTime.endDate - trip.stayTime.startDate) / 1000 / 60 / 60 / 24} nights
                                </span>
                                <span className="reserve-charge-sum">
                                    ${(totalPrice).toFixed(2)}
                                </span>
                            </div>
                            <div className="reserve-charge-row flex">
                                <span className="reserve-charge-txt">
                                    Cleaning fee
                                </span>
                                <span className="reserve-charge-sum">
                                    ${(totalPrice * 0.1).toFixed(2)}
                                </span>
                            </div>
                            <div className="reserve-charge-row flex">
                                <span className="reserve-charge-txt">
                                    Service fee
                                </span>
                                <span className="reserve-charge-sum">
                                    ${(totalPrice * 0.05).toFixed(2)}
                                </span>
                            </div>
                            <div className="reserve-charge-row flex">
                                <span className="reserve-charge-txt">
                                    Occupancy taxes and fees
                                </span>
                                <span className="reserve-charge-sum">
                                    ${(totalPrice * 0.15).toFixed(2)}
                                </span>
                            </div>
                            <div className="reserve-charge-total flex">
                                <span>
                                    Total
                                </span>
                                <span>
                                    ${(totalPrice + totalPrice * 0.1 + totalPrice * 0.05 + totalPrice * 0.15).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>}
            </section >
            <p className="footer"> <img src={Flag} alt="" /> <a href="#">Report this listing</a></p>
            <div className='date-range-container'>
                {modalState.datePickerModal && <DateRangePicker
                    className="date-range-calender reserve-modal"
                    appearance="default"
                    placeholder="Default"
                    ranges={[selectionRange]}
                    months={2}
                    direction="horizontal"

                    date={new Date()}
                    onChange={this.handleSelect}
                    moveRangeOnFirstSelection={true}
                    hasCustomRendering={false}
                />}
            </div>
            {
                modalState.reserveGuestsModal && <div>
                    <GuestsDropDown
                        guests={guests}
                        updateNumOfGuests={this.updateNumOfGuests} />
                </div>
            }
        </main >
    }
}

function mapStateToProps(state) {
    return {
        order: state.orderModule.order,
        user: state.userModule.user,
        modalState: state.pageModule.modalState,
        isModalOpen: state.pageModule.isModalOpen
    }
}

const mapDispatchToProps = {
    addOrder,
    toggleModal,
    updateUnreadCount
}

export const StayReserve = connect(mapStateToProps, mapDispatchToProps)(_StayReserve)