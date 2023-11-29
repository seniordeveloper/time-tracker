import { Moment} from 'moment';

let moment = require('moment');

console.log(getWorkTime('2023-11-24 16:00', '2023-11-24 16:01'));
console.log(getWorkTime('2023-11-24 16:00', '2023-11-24 16:29'));
console.log(getWorkTime('2023-11-24 17:59', '2023-11-24 18:50'));

console.log(getWorkTime('2023-11-24 16:00', '2023-11-27 11:00'));
console.log(getWorkTime('2023-11-24 16:00', '2023-11-28 11:00'));
console.log(getWorkTime('2023-11-24 16:00', '2023-11-29 11:00'));

function getWorkTime(stringedStartDateTime: string, stringedEndDateTime: string): string {
    if (!stringedEndDateTime?.length) {
        stringedEndDateTime = new Date().toLocaleDateString();
    }

    let startDateTime = moment(stringedStartDateTime);
    let endDateTime = moment(stringedEndDateTime);

    if (endDateTime.isBefore(startDateTime)) {
        throw 'Invalid date range';
    }

    let hasMore = endDateTime.diff(startDateTime, 'days') > 0;
    let startValue = moment(stringedStartDateTime);
    let elapsedMinutes = 0;
    let endOfDay = moment(startValue);
    endOfDay.set({hour: 18, minute: 0});

    while(hasMore) {

        if(isBillableDay(startValue)) {
            elapsedMinutes += endOfDay.diff(startValue, 'minutes');
        }
        
        startValue = startValue.add(1, 'day');
        startValue.set({hour: 9, minute: 0});
        endOfDay = moment(startValue);
        endOfDay.set({hour: 18, minute: 0});
        hasMore = endDateTime.diff(startValue, 'days') > 0;
    }
    
    if(endDateTime.diff(endOfDay, 'minutes') > 0) {
        endDateTime.set({hour: 18, minute: 0});
    }

    elapsedMinutes += endDateTime.diff(startValue, 'minutes');
    
    return elapsedMinutes + (elapsedMinutes > 1 ? ' minutes' : ' minute');
}

function isBillableDay(date: Moment): boolean {
    let day = date.day();
    return day !== 0 && day !== 6; // also exclude holidays... complex logic.
}
