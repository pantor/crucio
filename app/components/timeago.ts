import { app } from './../crucio';

class TimeagoController {
  result: string;
  datetime: number;

  $onInit() {
    const strings = {
      prefixAgo: 'vor',
      prefixFromNow: 'in',
      suffixAgo: '',
      suffixFromNow: '',
      seconds: 'wenigen Sekunden',
      minute: 'etwa einer Minute',
      minutes: '%d Minuten',
      hour: 'etwa einer Stunde',
      hours: '%d Stunden',
      day: 'etwa einem Tag',
      days: '%d Tagen',
      month: 'etwa einem Monat',
      months: '%d Monaten',
      year: 'etwa einem Jahr',
      years: '%d Jahren',
      wordSeparator: ' ',
      numbers: [],
    };

    const given = this.datetime;
    const current = new Date().getTime();

    const distanceMillis = Math.abs(current - given);
    const seconds = distanceMillis / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365;

    const prefix = strings.prefixAgo;
    const suffix = strings.suffixAgo;

    function isFunction(functionToCheck): boolean {
      const getType = {};
      return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    function substitute(s: string, index: number): string { // object is either string or function
      const value = (strings.numbers && strings.numbers[index]) || index;
      return s.replace(/%d/i, value);
    }

    function trim(s: string): string {
      return s.replace(/^\s+|\s+$/g, '');
    }

    const words = seconds < 45 && substitute(strings.seconds, Math.round(seconds)) ||
      seconds < 90 && substitute(strings.minute, 1) ||
      minutes < 45 && substitute(strings.minutes, Math.round(minutes)) ||
      minutes < 90 && substitute(strings.hour, 1) ||
      hours < 24 && substitute(strings.hours, Math.round(hours)) ||
      hours < 42 && substitute(strings.day, 1) ||
      days < 30 && substitute(strings.days, Math.round(days)) ||
      days < 45 && substitute(strings.month, 1) ||
      days < 365 && substitute(strings.months, Math.round(days / 30)) ||
      years < 1.5 && substitute(strings.year, 1) ||
      substitute(strings.years, Math.round(years));

    this.result = trim([prefix, words, suffix].join(strings.wordSeparator));
  }
}

export const TimeagoComponent = 'timeago';
app.component(TimeagoComponent, {
  template: '<span>{{ $ctrl.result }}</span>',
  controller: TimeagoController,
  bindings: {
    datetime: '<'
  }
});
