import { interval, fromEvent, merge, empty } from 'rxjs';
import {
  switchMap,
  scan,
  takeWhile,
  startWith,
  mapTo,
  tap,
} from 'rxjs/operators';
import * as d3 from 'd3';
import moment from 'moment';

const fromDate = new Date('2009-01-01');
const toDate = new Date('2009-12-31');
// elem refs
const remainingLabel = document.getElementById('remaining');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const startButton = document.getElementById('start');

// streams
const interval$ = interval(1000);
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
const resume$ = fromEvent(resumeButton, 'click').pipe(mapTo(true));
const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));

const timer$ = merge(pause$, resume$, start$)
  .pipe(
    startWith(false),
    switchMap((val) => (val ? interval$ : empty())),
    tap((value) => {
      console.log('value from switch map', value);
    }),
    scan((acc, curr: Date) => {
      return curr ? moment(acc).add(1, 'days') : acc;
    }, fromDate),
    takeWhile((v) => v <= toDate)
  )
  .subscribe((val: any) => {
    /* let days = d3
      .scaleLinear()
      .domain([0, 100])
      .range([new Date('2009-01-01'), new Date('2009-12-31')]);*/
    remainingLabel.innerHTML = val;
  });
