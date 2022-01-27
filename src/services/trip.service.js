
// _getEmptyTrip()
// updateTrip()
// query() - localStorage to get trip
// clearTrip() after trip -> order

import { storageService } from './async.storage.js'

const STORAGE_KEY = 'tripDB'


export const tripService = {
    query,
    getById,
    save,
    remove,

}

_createTrips()
// CREATE TRIP
function _createTrips() {
    const trips = storageService.loadFromStorage(STORAGE_KEY) || []
    storageService.saveToStorage(STORAGE_KEY, trips)
}

// GET TRIPS
function query() {
    return storageService.query(STORAGE_KEY)
}

// GET BY ID
function getById(tripId) {
    return storageService.get(STORAGE_KEY, tripId)
}

// REMOVE
function remove(tripId) {
    return storageService.remove(STORAGE_KEY, tripId)
}

// SAVE OR UPDATE TRIP
function save(trip) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip))
}


