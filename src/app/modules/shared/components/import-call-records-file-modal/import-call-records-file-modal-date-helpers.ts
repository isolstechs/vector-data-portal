export class ImportCallRecordsFileModalDateHelpers {
  static initDate(_dateComing: string): string {
    _dateComing = _dateComing.trim().replace(/\//g, '-').replace('  ', ' ');

    // we are going to provide support for only MM/DD/YYYY and YYYY/MM/DD formats. DD/MM/YYYY is not supported.

    // if YYYYY is in start, we have to consider it a YYYY/MM/DD format
    if (_dateComing[4] == '-') {
      _dateComing =
        ImportCallRecordsFileModalDateHelpers.initYYYYMMMDD(_dateComing);
    } else {
      // if we have a day in start, we will generate error message
      if (parseInt(_dateComing.split('-')[0]) > 12) {
        throw new Error();
      }
      _dateComing =
        ImportCallRecordsFileModalDateHelpers.initMMDDYYYY(_dateComing);
    }

    // checking two digits for hour available or not
    if (_dateComing[12] == ':') {
      _dateComing = _dateComing.slice(0, 11) + '0' + _dateComing.slice(11);
    }

    // _dateComing =
    //   _dateComing.slice(6, 10) +
    //   '-' +
    //   _dateComing.slice(0, 2) +
    //   '-' +
    //   _dateComing.slice(3, 5) +
    //   'T' +
    //   _dateComing.slice(11, _dateComing.length) +
    //   ':00.000Z';

    return _dateComing;
  }

  private static initYYYYMMMDD(_comingDate: string): string {
    // if date is not like 2022/07/05 and like 2022/7/5, we will make it like 2022/07/05
    if (_comingDate[7] != '-' || _comingDate[10] != ' ') {
      // if month is wrong
      if (_comingDate[7] != '-') {
        _comingDate = _comingDate.slice(0, 5) + '0' + _comingDate.slice(5);
      }

      // if day is wrong
      if (_comingDate[10] != ' ') {
        _comingDate = _comingDate.slice(0, 8) + '0' + _comingDate.slice(8);
      }
    }

    // if day is provided in place of month, we will generate an error
    if (parseInt(_comingDate.split('-')[1]) > 12) {
      throw Error();
    }
    return _comingDate;
  }

  private static initMMDDYYYY(_comingDate: string): string {
    if (
      _comingDate[1] == '-' ||
      _comingDate[4] == '-' ||
      _comingDate[8] == ' '
    ) {
      // checking two digits for month available or not
      if (_comingDate[1] == '-') {
        _comingDate = '0' + _comingDate;
      }

      // checking two digits for day available or not
      if (_comingDate[4] == '-') {
        _comingDate = _comingDate.slice(0, 3) + '0' + _comingDate.slice(3);
      }

      // checking four digits for year available or not
      if (_comingDate[8] == ' ') {
        _comingDate = _comingDate.slice(0, 6) + '20' + _comingDate.slice(6);
      }
    }

    return _comingDate;
  }
}
