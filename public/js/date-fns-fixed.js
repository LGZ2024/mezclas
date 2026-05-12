/**
 * date-fns browser-compatible version
 * Simple implementation to avoid "exports is not defined" errors
 */

(function(global) {
    'use strict'

    // Basic date functions needed for Chart.js adapter
    const dateFns = {
        add: function(date, amount) {
            const result = new Date(date)
            result.setDate(result.getDate() + amount)
            return result
        },

        format: function(date, formatStr) {
            return date.toLocaleDateString()
        },

        parseISO: function(dateString) {
            return new Date(dateString)
        },

        startOfWeek: function(date) {
            const d = new Date(date)
            const day = d.getDay()
            const diff = d.getDate() - day + (day === 0 ? -6 : 1)
            return new Date(d.setDate(diff))
        },

        endOfWeek: function(date) {
            const d = new Date(date)
            const day = d.getDay()
            const diff = d.getDate() - day + (day === 6 ? 1 : 0)
            return new Date(d.setDate(diff))
        },

        eachDayOfInterval: function(startDate, endDate) {
            const dates = []
            const currentDate = new Date(startDate)
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate))
                currentDate.setDate(currentDate.getDate() + 1)
            }
            return dates
        },

        isAfter: function(date, dateToCompare) {
            return date > dateToCompare
        },

        isBefore: function(date, dateToCompare) {
            return date < dateToCompare
        },

        isEqual: function(date, dateToCompare) {
            return date.getTime() === dateToCompare.getTime()
        },

        differenceInDays: function(dateLeft, dateRight) {
            const diffTime = Math.abs(dateLeft - dateRight)
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        },

        differenceInCalendarDays: function(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24))
        },

        differenceInHours: function(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60))
        },

        differenceInMinutes: function(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / (1000 * 60))
        },

        differenceInSeconds: function(dateLeft, dateRight) {
            return Math.ceil((dateLeft - dateRight) / 1000)
        },

        differenceInMilliseconds: function(dateLeft, dateRight) {
            return Math.abs(dateLeft - dateRight)
        },

        eachMonthOfInterval: function(startDate, endDate) {
            const dates = []
            const currentDate = new Date(startDate)
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate))
                currentDate.setMonth(currentDate.getMonth() + 1)
            }
            return dates
        },

        eachWeekOfInterval: function(startDate, endDate) {
            const dates = []
            const currentDate = new Date(startDate)
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate))
                currentDate.setDate(currentDate.getDate() + 7)
            }
            return dates
        },

        endOfDay: function(date) {
            const result = new Date(date)
            result.setHours(23, 59, 59, 999)
            return result
        },

        endOfHour: function(date) {
            const result = new Date(date)
            result.setMinutes(59, 59, 999)
            return result
        },

        endOfMonth: function(date) {
            const result = new Date(date)
            result.setDate(1)
            result.setMonth(result.getMonth() + 1)
            result.setDate(result.getDate() - 1)
            return result
        },

        endOfYear: function(date) {
            const result = new Date(date)
            result.setMonth(11, 31)
            return result
        },

        formatDistance: function(date, baseDate) {
            const diff = Math.abs(date - baseDate)
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
            return days + ' days ago'
        },

        formatDistanceToNow: function(date) {
            const diff = Math.abs(new Date() - date)
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
            return days + ' days ago'
        },

        fromUnixTime: function(unixTime) {
            return new Date(unixTime * 1000)
        },

        getDate: function(date) {
            return date.getDate()
        },

        getDay: function(date) {
            return date.getDay()
        },

        getDaysInMonth: function(date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
        },

        getHours: function(date) {
            return date.getHours()
        },

        getMinutes: function(date) {
            return date.getMinutes()
        },

        getMonth: function(date) {
            return date.getMonth()
        },

        getSeconds: function(date) {
            return date.getSeconds()
        },

        getTime: function(date) {
            return date.getTime()
        },

        getUnixTime: function(date) {
            return Math.floor(date.getTime() / 1000)
        },

        getYear: function(date) {
            return date.getFullYear()
        },

        parse: function(dateString) {
            return new Date(dateString)
        },

        startOfDay: function(date) {
            const result = new Date(date)
            result.setHours(0, 0, 0, 0)
            return result
        },

        startOfMonth: function(date) {
            const result = new Date(date)
            result.setDate(1)
            return result
        },

        startOfYear: function(date) {
            const result = new Date(date)
            result.setMonth(0, 1)
            return result
        },

        sub: function(date, duration) {
            return new Date(date - duration)
        },

        subDays: function(date, amount) {
            const result = new Date(date)
            result.setDate(result.getDate() - amount)
            return result
        },

        subHours: function(date, amount) {
            return new Date(date - amount * 60 * 60 * 1000)
        },

        subMinutes: function(date, amount) {
            return new Date(date - amount * 60 * 1000)
        },

        subMonths: function(date, amount) {
            const result = new Date(date)
            result.setMonth(result.getMonth() - amount)
            return result
        },

        subWeeks: function(date, amount) {
            return new Date(date - amount * 7 * 24 * 60 * 60 * 1000)
        },

        subYears: function(date, amount) {
            const result = new Date(date)
            result.setFullYear(result.getFullYear() - amount)
            return result
        }
    }

    // Export to global scope for browser compatibility
    if (typeof window !== 'undefined') {
        window.dateFns = dateFns
    } else if (typeof global !== 'undefined') {
        global.dateFns = dateFns
    }
})(typeof window !== 'undefined' ? window : global)
