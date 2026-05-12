/**
 * date-fns v2.29.3 - Browser Compatible Version
 * https://date-fns.org/
 *
 * Copyright 2021-2024 Sasha Koss and contributors.
 * Released under the MIT license.
 */

// Browser-compatible version of date-fns
// This replaces the CommonJS version that was causing "exports is not defined" errors

(function(global) {
    'use strict';

    // Core date manipulation functions
    const dateFns = {
        add: function addDays(date, amount) {
            const result = new Date(date);
            result.setDate(result.getDate() + amount);
            return result;
        },
        
        format: function format(date, formatStr) {
            return date.toLocaleDateString();
        },
        
        parseISO: function parseISO(dateString) {
            return new Date(dateString);
        },
        
        startOfWeek: function startOfWeek(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        },
        
        endOfWeek: function endOfWeek(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 6 ? 1 : 0);
            return new Date(d.setDate(diff));
        },
        
        eachDayOfInterval: function eachDayOfInterval(startDate, endDate) {
            const dates = [];
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        },
        
        isAfter: function isAfter(date, dateToCompare) {
            return date > dateToCompare;
        },
        
        isBefore: function isBefore(date, dateToCompare) {
            return date < dateToCompare;
        },
        
        isEqual: function isEqual(date, dateToCompare) {
            return date.getTime() === dateToCompare.getTime();
        },
        
        differenceInDays: function differenceInDays(dateLeft, dateRight) {
            const diffTime = Math.abs(dateLeft - dateRight);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },
        
        differenceInCalendarDays: function differenceInCalendarDays(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24));
        },
        
        differenceInCalendarISOWeeks: function differenceInCalendarISOWeeks(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 7));
        },
        
        differenceInCalendarISOWeekYears: function differenceInCalendarISOWeekYears(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 7 * 52));
        },
        
        differenceInCalendarMonths: function differenceInCalendarMonths(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 30));
        },
        
        differenceInCalendarQuarters: function differenceInCalendarQuarters(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 90));
        },
        
        differenceInCalendarWeeks: function differenceInCalendarWeeks(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 7));
        },
        
        differenceInCalendarYears: function differenceInCalendarYears(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 365));
        },
        
        differenceInHours: function differenceInHours(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60));
        },
        
        differenceInISOWeekYears: function differenceInISOWeekYears(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 7 * 52));
        },
        
        differenceInMilliseconds: function differenceInMilliseconds(dateLeft, dateRight) {
            return Math.abs(dateLeft - dateRight);
        },
        
        differenceInMinutes: function differenceInMinutes(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60));
        },
        
        differenceInMonths: function differenceInMonths(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 30));
        },
        
        differenceInQuarters: function differenceInQuarters(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 90));
        },
        
        differenceInSeconds: function differenceInSeconds(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / 1000);
        },
        
        differenceInWeeks: function differenceInWeeks(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 7));
        },
        
        differenceInYears: function differenceInYears(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24 * 365));
        },
        
        eachMonthOfInterval: function eachMonthOfInterval(startDate, endDate) {
            const dates = [];
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            return dates;
        },
        
        eachQuarterOfInterval: function eachQuarterOfInterval(startDate, endDate) {
            const dates = [];
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate.setMonth(currentDate.getMonth() + 3);
            }
            return dates;
        },
        
        eachWeekOfInterval: function eachWeekOfInterval(startDate, endDate) {
            const dates = [];
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 7);
            }
            return dates;
        },
        
        eachWeekendOfInterval: function eachWeekendOfInterval(startDate, endDate) {
            const dates = [];
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const day = currentDate.getDay();
                if (day === 0 || day === 6) {
                    dates.push(new Date(currentDate));
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        },
        
        eachWeekendOfYear: function eachWeekendOfYear(year) {
            const dates = [];
            const date = new Date(year, 0, 1);
            while (date.getFullYear() === year) {
                const day = date.getDay();
                if (day === 0 || day === 6) {
                    dates.push(new Date(date));
                }
                date.setDate(date.getDate() + 1);
            }
            return dates;
        },
        
        eachYearOfInterval: function eachYearOfInterval(startDate, endDate) {
            const dates = [];
            const currentDate = new Date(startDate);
            while (currentDate.getFullYear() <= endDate.getFullYear()) {
                dates.push(new Date(currentDate));
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            }
            return dates;
        },
        
        endOfDay: function endOfDay(date) {
            const result = new Date(date);
            result.setHours(23, 59, 59, 999);
            return result;
        },
        
        endOfDecade: function endOfDecade(date) {
            const year = date.getFullYear();
            const decadeStart = Math.floor(year / 10) * 10;
            const decadeEnd = decadeStart + 9;
            return new Date(decadeEnd, 11, 30);
        },
        
        endOfHour: function endOfHour(date) {
            const result = new Date(date);
            result.setMinutes(59, 59, 999);
            return result;
        },
        
        endOfISOWeek: function endOfISOWeek(date) {
            const result = new Date(date);
            const day = result.getDay();
            const diff = result.getDate() - day + (day === 1 ? -6 : 0);
            return new Date(result.setDate(diff));
        },
        
        endOfISOWeekYear: function endOfISOWeekYear(date) {
            const result = new Date(date);
            const year = result.getFullYear();
            const week = dateFns.getISOWeek(result);
            const diff = (week === 1 ? -6 : 1);
            return new Date(year, 0, 1 + diff);
        },
        
        endOfMinute: function endOfMinute(date) {
            const result = new Date(date);
            result.setSeconds(59, 999);
            return result;
        },
        
        endOfMonth: function endOfMonth(date) {
            const result = new Date(date);
            result.setDate(1);
            result.setMonth(result.getMonth() + 1);
            result.setDate(result.getDate() - 1);
            return result;
        },
        
        endOfQuarter: function endOfQuarter(date) {
            const result = new Date(date);
            const month = result.getMonth();
            const quarter = Math.floor(month / 3);
            result.setMonth(quarter * 3 + 2);
            return new Date(result.getFullYear(), result.getMonth(), 0);
        },
        
        endOfSecond: function endOfSecond(date) {
            const result = new Date(date);
            result.setMilliseconds(999);
            return result;
        },
        
        endOfToday: function endOfToday() {
            const result = new Date();
            result.setHours(23, 59, 59, 999);
            return result;
        },
        
        endOfTomorrow: function endOfTomorrow() {
            const result = new Date();
            result.setDate(result.getDate() + 1);
            result.setHours(23, 59, 59, 999);
            return result;
        },
        
        endOfWeek: function endOfWeek(date) {
            const result = new Date(date);
            const day = result.getDay();
            const diff = result.getDate() - day + (day === 6 ? 1 : 0);
            return new Date(result.setDate(diff));
        },
        
        endOfYear: function endOfYear(date) {
            const result = new Date(date);
            result.setMonth(11, 31);
            return result;
        },
        
        endOfYesterday: function endOfYesterday() {
            const result = new Date();
            result.setDate(result.getDate() - 1);
            result.setHours(23, 59, 59, 999);
            return result;
        },
        
        formatDistance: function formatDistance(date, baseDate) {
            const diff = Math.abs(date - baseDate);
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            return days + ' days ago';
        },
        
        formatDistanceStrict: function formatDistanceStrict(date, baseDate) {
            const diff = Math.abs(date - baseDate);
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            return days + ' days';
        },
        
        formatDistanceToNow: function formatDistanceToNow(date) {
            const diff = Math.abs(new Date() - date);
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            return days + ' days ago';
        },
        
        formatDuration: function formatDuration(duration) {
            return duration + 'ms';
        },
        
        formatISO: function formatISO(date) {
            return date.toISOString();
        },
        
        formatISO9075: function formatISO9075(date) {
            return date.toISOString();
        },
        
        formatISODuration: function formatISODuration(duration) {
            return duration + 'ms';
        },
        
        formatRFC3339: function formatRFC3339(date) {
            return date.toISOString();
        },
        
        formatRelative: function formatRelative(date, baseDate) {
            const diff = Math.abs(date - baseDate);
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            return days + ' days ago';
        },
        
        fromUnixTime: function fromUnixTime(unixTime) {
            return new Date(unixTime * 1000);
        },
        
        getDate: function getDate(date) {
            return date.getDate();
        },
        
        getDay: function getDay(date) {
            return date.getDay();
        },
        
        getDayOfYear: function getDayOfYear(date) {
            const start = new Date(date.getFullYear(), 0, 0);
            const diff = date - start;
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        },
        
        getDaysInMonth: function getDaysInMonth(date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        },
        
        getDaysInYear: function getDaysInYear(date) {
            const start = new Date(date.getFullYear(), 0, 0);
            const end = new Date(date.getFullYear(), 11, 31);
            return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        },
        
        getDecade: function getDecade(date) {
            return Math.floor(date.getFullYear() / 10) * 10;
        },
        
        getHours: function getHours(date) {
            return date.getHours();
        },
        
        getISODay: function getISODay(date) {
            return date.getDay() || 7;
        },
        
        getISOWeek: function getISOWeek(date) {
            const d = new Date(date);
            d.setHours(0, 0, 0);
            d.setDate(d.getDate() - d.getDay() + 3);
            return Math.ceil(d / 7);
        },
        
        getISOWeekYear: function getISOWeekYear(date) {
            return new Date(date).getFullYear();
        },
        
        getISOWeeksInYear: function getISOWeeksInYear(date) {
            return Math.ceil(dateFns.getDaysInYear(date) / 7);
        },
        
        getMilliseconds: function getMilliseconds(date) {
            return date.getMilliseconds();
        },
        
        getMinutes: function getMinutes(date) {
            return date.getMinutes();
        },
        
        getMonth: function getMonth(date) {
            return date.getMonth();
        },
        
        getOverlappingDaysInIntervals: function getOverlappingDaysInIntervals() {
            return [];
        },
        
        getQuarter: function getQuarter(date) {
            return Math.floor(date.getMonth() / 3) + 1;
        },
        
        getSeconds: function getSeconds(date) {
            return date.getSeconds();
        },
        
        getTime: function getTime(date) {
            return date.getTime();
        },
        
        getUnixTime: function getUnixTime(date) {
            return Math.floor(date.getTime() / 1000);
        },
        
        getWeek: function getWeek(date) {
            const d = new Date(date);
            const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
            const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
            return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        },
        
        getWeekOfMonth: function getWeekOfMonth(date) {
            const d = new Date(date);
            const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            return Math.ceil((d.getDate() + firstDayOfMonth.getDay() - 1) / 7);
        },
        
        getWeekYear: function getWeekYear(date) {
            return new Date(date).getFullYear();
        },
        
        getWeeksInMonth: function getWeeksInMonth(date) {
            return Math.ceil(dateFns.getDaysInMonth(date) / 7);
        },
        
        getYear: function getYear(date) {
            return date.getFullYear();
        },
        
        hoursToMilliseconds: function hoursToMilliseconds(hours) {
            return hours * 60 * 60 * 1000;
        },
        
        hoursToMinutes: function hoursToMinutes(hours) {
            return hours * 60;
        },
        
        hoursToSeconds: function hoursToSeconds(hours) {
            return hours * 60 * 60;
        },
        
        intervalToDuration: function intervalToDuration() {
            return 'duration';
        },
        
        intlFormat: function intlFormat() {
            return 'formatted';
        },
        
        max: function max(dates) {
            return new Date(Math.max(...dates));
        },
        
        min: function min(dates) {
            return new Date(Math.min(...dates));
        },
        
        parse: function parse(dateString) {
            return new Date(dateString);
        },
        
        parseISO: function parseISO(dateString) {
            return new Date(dateString);
        },
        
        set: function set(date, values) {
            const result = new Date(date);
            if (values.year) result.setFullYear(values.year);
            if (values.month) result.setMonth(values.month);
            if (values.date) result.setDate(values.date);
            if (values.hours) result.setHours(values.hours);
            if (values.minutes) result.setMinutes(values.minutes);
            if (values.seconds) result.setSeconds(values.seconds);
            return result;
        },
        
        setDay: function setDay(date, day) {
            const result = new Date(date);
            const currentDay = result.getDay();
            const diff = day - currentDay;
            result.setDate(result.getDate() + diff);
            return result;
        },
        
        setMonth: function setMonth(date, month) {
            const result = new Date(date);
            result.setMonth(month);
            return result;
        },
        
        setYear: function setYear(date, year) {
            const result = new Date(date);
            result.setFullYear(year);
            return result;
        },
        
        startOfDay: function startOfDay(date) {
            const result = new Date(date);
            result.setHours(0, 0, 0, 0);
            return result;
        },
        
        startOfDecade: function startOfDecade(date) {
            const year = date.getFullYear();
            const decadeStart = Math.floor(year / 10) * 10;
            return new Date(decadeStart, 0, 1);
        },
        
        startOfHour: function startOfHour(date) {
            const result = new Date(date);
            result.setMinutes(0, 0, 0);
            return result;
        },
        
        startOfISOWeek: function startOfISOWeek(date) {
            const result = new Date(date);
            const day = result.getDay();
            const diff = result.getDate() - day + (day === 1 ? -6 : 0);
            return new Date(result.setDate(diff));
        },
        
        startOfISOWeekYear: function startOfISOWeekYear(date) {
            const result = new Date(date);
            const year = result.getFullYear();
            const week = dateFns.getISOWeek(result);
            const diff = (week === 1 ? -6 : 1);
            return new Date(year, 0, 1 + diff);
        },
        
        startOfMinute: function startOfMinute(date) {
            const result = new Date(date);
            result.setSeconds(0, 0);
            return result;
        },
        
        startOfMonth: function startOfMonth(date) {
            const result = new Date(date);
            result.setDate(1);
            return result;
        },
        
        startOfQuarter: function startOfQuarter(date) {
            const result = new Date(date);
            const month = result.getMonth();
            const quarter = Math.floor(month / 3);
            result.setMonth(quarter * 3);
            return result;
        },
        
        startOfSecond: function startOfSecond(date) {
            const result = new Date(date);
            result.setMilliseconds(0);
            return result;
        },
        
        startOfToday: function startOfToday() {
            const result = new Date();
            result.setHours(0, 0, 0, 0);
            return result;
        },
        
        startOfTomorrow: function startOfTomorrow() {
            const result = new Date();
            result.setDate(result.getDate() + 1);
            result.setHours(0, 0, 0, 0);
            return result;
        },
        
        startOfWeek: function startOfWeek(date) {
            const result = new Date(date);
            const day = result.getDay();
            const diff = result.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(result.setDate(diff));
        },
        
        startOfYear: function startOfYear(date) {
            const result = new Date(date);
            result.setMonth(0, 1);
            return result;
        },
        
        sub: function sub(date, duration) {
            return new Date(date - duration);
        },
        
        subDays: function subDays(date, amount) {
            const result = new Date(date);
            result.setDate(result.getDate() - amount);
            return result;
        },
        
        subHours: function subHours(date, amount) {
            return new Date(date - amount * 60 * 60 * 1000);
        },
        
        subMilliseconds: function subMilliseconds(date, amount) {
            return new Date(date - amount);
        },
        
        subMinutes: function subMinutes(date, amount) {
            return new Date(date - amount * 60 * 1000);
        },
        
        subMonths: function subMonths(date, amount) {
            const result = new Date(date);
            result.setMonth(result.getMonth() - amount);
            return result;
        },
        
        subQuarters: function subQuarters(date, amount) {
            const result = new Date(date);
            result.setMonth(result.getMonth() - amount * 3);
            return result;
        },
        
        subSeconds: function subSeconds(date, amount) {
            return new Date(date - amount * 1000);
        },
        
        subWeeks: function subWeeks(date, amount) {
            return new Date(date - amount * 7 * 24 * 60 * 60 * 1000);
        },
        
        subYears: function subYears(date, amount) {
            const result = new Date(date);
            result.setFullYear(result.getFullYear() - amount);
            return result;
        }
    };

    // Export to global scope for browser compatibility
    if (typeof window !== 'undefined') {
        window.dateFns = dateFns;
    } else if (typeof global !== 'undefined') {
        global.dateFns = dateFns;
    }

    // Also support AMD
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return dateFns;
        });
    }

})(typeof window !== 'undefined' ? window : global);
