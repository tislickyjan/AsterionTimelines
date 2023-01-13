class DateUtils {
    // return array with all months names and holiday label
    static getMonthsWithHolidays() {
        let months = this.months.map(m => { return m.name; });
        months.push(DateUtils.holidaysLabel);
        return months;
    }
    // if the day in year is holiday, returns true 
    static isHoliday(dayInYear) {
        return DateUtils.holidays.has(dayInYear);
    }
    ;
    // returns month in which the day takes place
    static getMonthByDay(dayInYear) {
        return DateUtils.months.find((month) => {
            return dayInYear >= month.firstDay && dayInYear <= month.lastDay;
        });
    }
    // returns year in which the day takes place
    static getYear(daysFromZero) {
        return Math.floor(daysFromZero / DateUtils.daysInYear);
    }
    // returns day in year (0-370) from count of days from day 0
    static getDayInYear(daysFromZero) {
        let dayInYear = daysFromZero % DateUtils.daysInYear;
        if (dayInYear < 0)
            dayInYear = DateUtils.daysInYear + dayInYear;
        return dayInYear;
    }
    // return name of month in which day takes place, day is represented by count og days from day 0
    static getMonth(daysFromZero) {
        let dayInYear = DateUtils.getDayInYear(daysFromZero);
        if (DateUtils.isHoliday(dayInYear))
            return DateUtils.holidaysLabel;
        return DateUtils.getMonthByDay(dayInYear).name;
    }
    // returns array with name of days in wantad month or list of all holidays
    static getDaysList(month) {
        if (month === DateUtils.holidaysLabel)
            return [...this.holidays.values()];
        return [...Array(30).keys()].map(i => { return (i + 1).toString(); });
    }
    // returns day represented as count of days in year
    // parameter daysFromZero is day represented as count od days from day 0 in year 0
    static getDay(daysFromZero) {
        let dayInYear = DateUtils.getDayInYear(daysFromZero);
        if (DateUtils.isHoliday(dayInYear))
            return DateUtils.holidays.get(dayInYear);
        return (dayInYear - DateUtils.getMonthByDay(dayInYear).firstDay + 1).toString();
    }
    // returns 
    static getDayFromZero(day, month, year) {
        let dayInYear;
        if (month === DateUtils.holidaysLabel) {
            dayInYear = [...DateUtils.holidays.entries()].find(([date, name]) => name == day)[0];
        }
        else {
            let monthData = DateUtils.months.find((m) => month == m.name);
            dayInYear = monthData.firstDay + parseInt(day) - 1;
        }
        let yearDays = year * DateUtils.daysInYear;
        return yearDays + dayInYear;
    }
    static getDateName(daysFromZero) {
        let year = DateUtils.getYear(daysFromZero);
        let dayInYear = DateUtils.getDayInYear(daysFromZero);
        if (DateUtils.isHoliday(dayInYear)) {
            let day = DateUtils.holidays.get(dayInYear);
            return day + " " + year;
        }
        else {
            let month = this.getMonthByDay(dayInYear);
            let day = dayInYear - month.firstDay + 1;
            return day + ". " + month.name + " " + year;
        }
    }
}
// count of days in Asterion's year
DateUtils.daysInYear = 370;
DateUtils.holidaysLabel = "Svátky";
// array with Month objects. Month object contains numbers of month's first day in year and month's last day in year and name of year   
DateUtils.months = [
    { firstDay: 0, lastDay: 29, name: "Chladen" },
    { firstDay: 30, lastDay: 59, name: "Kliden" },
    { firstDay: 61, lastDay: 90, name: "Novorost" },
    { firstDay: 92, lastDay: 121, name: "Rozkvet" },
    { firstDay: 122, lastDay: 151, name: "Zelenec" },
    { firstDay: 154, lastDay: 183, name: "Ploden" },
    { firstDay: 185, lastDay: 214, name: "Žluten" },
    { firstDay: 215, lastDay: 244, name: "Úmor" },
    { firstDay: 246, lastDay: 275, name: "Traven" },
    { firstDay: 277, lastDay: 306, name: "Ovocen" },
    { firstDay: 307, lastDay: 336, name: "Větrnec" },
    { firstDay: 339, lastDay: 368, name: "Dešten" }
];
// map of all Asterion's holidays with day in which the holiday takes place in year and name of holiday  
DateUtils.holidays = new Map([
    [60, "Den pústu"],
    [91, "Den očištění"],
    [152, "Sv. letních duchů 1"],
    [153, "Sv. letních duchů 2"],
    [184, "Sv. mladých srdcí"],
    [245, "Den hojnosti"],
    [276, "Den zákonů"],
    [337, "Sv. zimních duchů 1"],
    [338, "Sv. zimních duchů 2"],
    [369, "Sv. proroků"]
]);
export default DateUtils;
//# sourceMappingURL=DateUtils.js.map