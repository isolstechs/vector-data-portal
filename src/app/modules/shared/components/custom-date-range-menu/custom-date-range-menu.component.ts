import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

import * as moment from 'moment';

@Component({
  selector: 'app-custom-date-range-menu',
  templateUrl: './custom-date-range-menu.component.html',
  styleUrls: ['./custom-date-range-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomDateRangeMenuComponent implements OnInit {
  @ViewChild('menu', { read: MatMenu }) menu: MatMenu;
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  @Input() hideTodayYesterday: boolean;
  @Input() showDropdownButtonOrText: 'button' | 'text';
  @Output() dateRangeEmitter: EventEmitter<any> = new EventEmitter();

  showPresetRanges = false;

  startDate;
  endDate;

  selectedDateRangeType: number | 'custom' = -7;
  constructor() {}

  get dateRangeText(): string | undefined {
    switch (this.selectedDateRangeType) {
      case 0:
        return 'Today';
      case -1:
        return 'Yesterday';
      case -7:
        return 'Last 7 days';
      case -14:
        return 'Last 14 days';
      case -30:
        return 'Last 30 days';
      case -90:
        return 'Last 90 days';
      case -180:
        return 'Last 180 days';
      case -365:
        return 'Last Calendar Year';
      case -500:
        return 'All';
    }
  }
  ngOnInit(): void {
    this.changeDateRange(0);
  }

  togglePresetRanges(val: boolean): void {
    this.showPresetRanges = val;
  }

  matMenuClosed(): void {
    // wait for completing the animation of closing mat menu
    setTimeout(() => {
      // will not hide preset if selected a hidden preset value
      if (
        this.selectedDateRangeType != -14 &&
        this.selectedDateRangeType != -90 &&
        this.selectedDateRangeType != -180 &&
        this.selectedDateRangeType != -365 &&
        this.selectedDateRangeType != -500
      ) {
        this.showPresetRanges = false;
      }
    }, 500);
  }

  changeDateRange(_range: number): void {
    let tempEndDate;
    const setDateObj = {
      hour: 23,
      minute: 59,
      second: 59,
    };
    const tempStartDate = moment()
      .subtract(_range == 0 || _range == 1 ? _range : _range - 1, 'days')
      .set({ hour: 0, minute: 0, second: 0 });
    // yesterday

    if (_range == 1) {
      tempEndDate = moment().subtract(1, 'days').set(setDateObj);
    } else if (_range == 500) {
      this.selectedDateRangeType = -_range;
      this.dateRangeEmitter.emit({
        start: 'all',
        end: '',
        selectedRangeType: this.selectedDateRangeType,
      });
      return;
    } else {
      tempEndDate = moment().set(setDateObj);
    }
    this.selectedDateRangeType = -_range;
    this.emitDateRanges(tempStartDate.toISOString(), tempEndDate.toISOString());
    // setTimeout is important so the dates will changed in front of user after closing the menu
    setTimeout(() => {
      this.startDate = moment(tempStartDate).format('YYYY-MM-DD');
      this.endDate = moment(tempEndDate).format('YYYY-MM-DD');
    }, 500);
  }

  dateRangeCalendarChanged(_range: {
    startDate: string;
    endDate: string;
  }): void {
    this.startDate = _range.startDate; // startDate, endDate format: 'YYYY-MM-DD'
    this.endDate = _range.endDate;
    this.selectedDateRangeType = 'custom';

    const startDateToBeEmitter = moment(this.startDate)
      .set({ hour: 0, minute: 0, second: 0 })
      .toISOString();
    const endDateToBeEmitter = moment(this.endDate)
      .set({ hours: 23, minutes: 59, seconds: 59 })
      .toISOString();
    this.emitDateRanges(startDateToBeEmitter, endDateToBeEmitter);
  }

  private emitDateRanges(_startDate: string, _endDate: string): void {
    this.dateRangeEmitter.emit({
      start: _startDate,
      end: _endDate,
      selectedRangeType: this.selectedDateRangeType,
    });
  }
}
