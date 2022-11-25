react-calendars is react component library that allows the rendering of dynamic calendars and datepickers

# Installation

```
$ npm install react-calendars
```

# Usage

* [Calendar](#Calendar)
* [DatePicker](#DatePicker)
* [Configuration](#Configuration)

## Calendar

```jsx
<script>
import { Calendar } from 'react-calendars';
</script>

<Calendar />
```

### Props

#### month (number) && year (number)
Active month and year at which the calendar will first display

#### visibleMonths (number)
Amount of months to display in calendar

#### displayDayTitles (bool)
If true will display day titles as defined by config option daysTitles

#### displayMonthPicker (bool)
If true will display current month with previous and next buttons

#### displayMonthTitle (bool)
Will display the month name over each visible month in calendar

#### displayYearPicker (bool)
If true will display current year with previous and next buttons

#### renderMonthTitle (function)
This function can be used to override the way the month title is rendered, 
it takes two arguments : month (as defined in configuration) and year and 
should return a React node

#### selectedDay (Date)
Preselected date (will change when user clicks on date)

#### onSelect (function)
Callback that will be called on selected date change with three parameters: 
- the original event
- the selected date object
- the previous selected date object

#### dateClasses (array<array<Date,String>>)
The dateClasses prop is an array of arrays that contain a Date and string, if the date in the calendar matches the provided date, the class will be applied

#### after (node)
The after prop allows inserting content after the calendar dates

#### afterYearPicker (node)
The afterYearPicker prop allows inserting content after the year picker if displayYearPicker is true

#### afterMonthPicker (node)
The afterMonthPicker prop allows inserting content after the month picker if displayMonthPicker is true

#### isDisabledDay (function)
This function has three arguments (year, month, day) and should return a boolean to enable the disabled attribute on the Day button

## DatePicker
```jsx
<script>
import { DatePicker } from 'react-calendars';
</script>

<DatePicker />
```

### props

The datepicker uses all the props from the calendar component with extra optional props

### dateToValue (function)
The function used to translate the selected date to the string in the input field, by default:
```
date => date.toLocaleDateString(),
```
### valueToDate (function)
The function used to translate the string value in the field to a date object:
```
value => {
        value = value.split(/[/.,-]/g).map(v => parseInt(v));
        const testValue = new Date(2020, 0, 25).toLocaleDateString().split(/[/.,-]/g).map(v => parseInt(v));
        const yearIndex = testValue.indexOf(2020);
        const monthIndex = testValue.indexOf(1);
        const dayIndex = testValue.indexOf(25);
        return new Date(value[yearIndex], value[monthIndex] - 1, value[dayIndex])
    }
```

## Configuration

Global configuration can be changed by calling the setConfiguration method:
```
import { setConfiguration } from 'react-calendars';
setConfiguration({
    daysTitles: ['MON', 'TUE', 'WEN', 'THU', 'FRI', 'SAT', 'SUN'],
    firstDay: 1, // set to 0 to start week sunday
    libClassName: 'react-calendar',    
    monthTitles: [
         'January',
         'February',
         'March',
         'April',
         'May',
         'June',
         'July',
         'August',
         'September',
         'October',
         'November',
         'December'
    ],
    previousButton: 'Previous', // Inner of previous button on YearPicker and MonthPicker
    nextButton: 'Next' // Inner of next button on YearPicker and MonthPicker
});
```
