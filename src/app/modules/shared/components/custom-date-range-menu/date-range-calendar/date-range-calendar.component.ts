import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { DateRangeCalendarHeaderComponent } from './date-range-calendar-header/date-range-calendar-header.component';

@Component({
  selector: 'app-date-range-calendar',
  templateUrl: './date-range-calendar.component.html',
  styleUrls: ['./date-range-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DateRangeCalendarComponent implements OnInit {
  @ViewChild(MatDateRangePicker) dateRangePicker: MatDateRangePicker<any>;

  @Output() dateRangeCalendarEmitter: EventEmitter<any> = new EventEmitter();

  dateRangeCalendarHeaderComponent = DateRangeCalendarHeaderComponent;

  rangeForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadRangeForm();
  }

  openRangePicker(): void {
    this.dateRangePicker.open();
  }

  applyDateRange(): void {
    const tStartDate = this.rangeForm.value.end?.format('YYYY-MM-DD');
    const tEndDate = this.rangeForm.value.start?.format('YYYY-MM-DD');
    this.dateRangeCalendarEmitter.emit({
      startDate: tStartDate ? tStartDate : null,
      endDate: tEndDate ? tEndDate : null,
    });
  }

  private loadRangeForm(): void {
    this.rangeForm = this._fb.group({
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
    });
  }
}
