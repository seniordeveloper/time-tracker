"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require('moment');
console.log(getWorkTime('2023-11-24 16:00', '2023-11-24 16:01'));
console.log(getWorkTime('2023-11-24 16:00', '2023-11-24 16:29'));
console.log(getWorkTime('2023-11-24 17:59', '2023-11-24 18:50'));
console.log(getWorkTime('2023-11-24 16:00', '2023-11-27 11:00'));
console.log(getWorkTime('2023-11-24 16:00', '2023-11-28 11:00'));
console.log(getWorkTime('2023-11-24 16:00', '2023-11-29 11:00'));
function getWorkTime(stringedStartDateTime, stringedEndDateTime) {
    if (!(stringedEndDateTime === null || stringedEndDateTime === void 0 ? void 0 : stringedEndDateTime.length)) {
        stringedEndDateTime = new Date().toLocaleDateString();
    }
    var startDateTime = moment(stringedStartDateTime);
    var endDateTime = moment(stringedEndDateTime);
    if (endDateTime.isBefore(startDateTime)) {
        throw 'Invalid date range';
    }
    var hasMore = endDateTime.diff(startDateTime, 'days') > 0;
    var startValue = moment(stringedStartDateTime);
    var elapsedMinutes = 0;
    var endOfDay = moment(startValue);
    endOfDay.set({ hour: 18, minute: 0 });
    while (hasMore) {
        if (isBillableDay(startValue)) {
            elapsedMinutes += endOfDay.diff(startValue, 'minutes');
        }
        startValue = startValue.add(1, 'day');
        startValue.set({ hour: 9, minute: 0 });
        endOfDay = moment(startValue);
        endOfDay.set({ hour: 18, minute: 0 });
        hasMore = endDateTime.diff(startValue, 'days') > 0;
    }
    if (endDateTime.diff(endOfDay, 'minutes') > 0) {
        endDateTime.set({ hour: 18, minute: 0 });
    }
    elapsedMinutes += endDateTime.diff(startValue, 'minutes');
    return elapsedMinutes + (elapsedMinutes > 1 ? ' minutes' : ' minute');
}
function isBillableDay(date) {
    var day = date.day();
    return day !== 0 && day !== 6; // also exclude holidays... complex logic.
}
