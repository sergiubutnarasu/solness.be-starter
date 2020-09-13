import * as moment from 'moment';

export const DEFAULT_DAY_FORMAT = 'd';
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_TIME_FORMAT = 'HH:mm:ss';

class DateHelperClass {
  private static instance: DateHelperClass;

  private constructor() {
    //
  }

  public static getInstance() {
    if (!DateHelperClass.instance) {
      DateHelperClass.instance = new DateHelperClass();
    }
    return DateHelperClass.instance;
  }

  public addDays(value: any) {
    return moment().add(value, DEFAULT_DAY_FORMAT).toDate();
  }

  public getDate(dateTime: Date) {
    return moment.utc(dateTime).format(DEFAULT_DATE_FORMAT);
  }
  public getTime(dateTime: Date) {
    return moment.utc(dateTime).format(DEFAULT_TIME_FORMAT);
  }
}

const DateHelper = DateHelperClass.getInstance();

export default DateHelper;
