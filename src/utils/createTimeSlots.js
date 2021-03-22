import moment from 'moment';

export function createTimeSlots(fromTime, toTime) {
  let startTime = moment(fromTime, 'HH:mm');
  let endTime = moment(toTime, 'HH:mm');
  if (endTime.isBefore(startTime)) {
    endTime.add(1, 'day');
  }
  let arr = [];
  while (startTime <= endTime) {
    arr.push(new moment(startTime).format('HH:mm'));
    startTime.add(1, 'minutes');
  }
  return arr;
}
