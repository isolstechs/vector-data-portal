import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ICallRecord } from '../interfaces/call-record.interface';
import { ICountryGraph } from '../interfaces/country-graph.interface';
import { ICountry } from '../interfaces/country.interface';
import { IDate } from '../interfaces/date.interaface';
import { SharedService } from '../shared/services/shared.service';
import { HomeService } from './services/home.service';
import { SideBarComponent } from './side-bar/side-bar.component';
import * as _ from 'lodash';
import { WorldMapComponent } from './world-map/world-map.component';
import { MatDialog } from '@angular/material/dialog';
import { ExportFileModalComponent } from '../shared/components/export-file-modal/export-file-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(SideBarComponent) _sideBarComponent: SideBarComponent;
  @ViewChild(WorldMapComponent) _worldMapComponent: WorldMapComponent;

  date: IDate;
  difference: string;
  countriesGraph: ICountryGraph[];
  countries: ICountry[];
  callRecords: ICallRecord[];

  private _takeUntil: Subject<null> = new Subject<null>();
  constructor(
    private _homeService: HomeService,
    private _sharedService: SharedService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCountries();
    setTimeout(() => {
      this.initialDate();
    }, 1000);
  }

  ngOnDestroy(): void {
    this._takeUntil.next(null);
    this._takeUntil.complete();
  }

  // changing date from sideBarComponent
  changeDate(_date: IDate): void {
    if (_date.start == 'all') {
      this.date = _date;

      this.difference = 'All Records';
      // calling this function to change call records according to given date
      this.getCountriesCallRecrods();
    } else {
      this.date = _date;

      const start = new Date(_date.start);
      const end = new Date(_date.end);

      // calculating difference between start and end date with year, months and days
      this.calcDate(start, end);

      // calling this function to change call records according to given date
      this.getCountriesCallRecrods();
    }
  }

  // open export file modal for fileName
  openExportFileModal(_countryName: string): void {
    const modalRef = this._dialog.open(ExportFileModalComponent, {
      width: '400px',
    });

    modalRef.afterClosed().subscribe((_fileName: string) => {
      if (_fileName) {
        this.exportCSVFile(_countryName, _fileName);
      }
    });
  }

  // export according to countryName
  exportCSVFile(_countryName: string, _fileName: string): void {
    // download array in .csv format
    const csvString = [
      ['Destination Name', 'A Party', 'B Party', 'Date', 'Session Time'],
      ...this.callRecords
        .filter((_cr: ICallRecord) => _cr.prefix?.country?.name == _countryName)
        .map((_d: ICallRecord) => {
          const tempDate = new Date(_d.date) as any;
          tempDate.setSeconds(0, 0) as any;
          _d.date = tempDate
            .toISOString()
            .replace(/T/, ' ')
            .replace(/:00.000Z/, '');

          return [
            _d.prefix?.country?.name + ' ' + _d.prefix?.operator?.name,
            _d.aParty,
            _d.bParty,
            _d.date,
            _d.sessionTime,
          ];
        }),
    ]
      .map((e) => e.join(','))
      .join('\n');

    let link: any = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + escape(csvString);
    link.setAttribute('download', _fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // getting countries array
  private getCountries(): void {
    this._sharedService
      .getCountreis()
      .pipe(takeUntil(this._takeUntil))
      .subscribe((_countries: ICountry[]) => {
        if (_countries.length) {
          this.countries = _countries;
        }
      });
  }

  // initializing date for call records
  private initialDate(): void {
    const d = new Date();
    this.date = {
      end: d as any,
      start: new Date(d.setDate(d.getDate() - d.getDay() - 5)) as any,
    };

    // calling function to get call records
    this.getCountriesCallRecrods();
  }

  // getting call records array according to given date
  private getCountriesCallRecrods(): void {
    this._homeService
      .getCallRecords(this.date)
      .pipe(takeUntil(this._takeUntil))
      .subscribe((_callRecords: ICallRecord[]) => {
        if (_callRecords.length) {
          this.callRecords = _callRecords;
          this.changeCallRecordsToGraphData();
        }
      });
  }

  // changing call records to countries graph
  private changeCallRecordsToGraphData(): void {
    const tempCountriesGraph = _(this.callRecords)
      .countBy((x) => x.prefix.countryId)
      .map((count, name) => {
        let id = parseInt(name);
        let _tempCountry = this.countries.find((_cr: ICountry) => _cr.id == id);
        return {
          id,
          name: _tempCountry?.name,
          numericCode: _tempCountry?.numericCode,
          alphaCode: _tempCountry?.alphaCode,
          total: count,
          // percentage: (100 * count) / this.callRecords.length,
        };
      })
      .value();

    this.countriesGraph = tempCountriesGraph as any;

    this.changeGraphOnSideBarComponent();
    this.changeGraphOnWorlMapComponent();
  }

  // calling fucntion on sideBarComponent to change countriesGraph
  private changeGraphOnSideBarComponent(): void {
    this._sideBarComponent.initialingAndChangingGraphData(this.countriesGraph);
  }

  // calling fucntion on worlMapComponent to change countriesGraph
  private changeGraphOnWorlMapComponent(): void {
    this._worldMapComponent.initWorldMapData(this.countriesGraph);
  }

  // showing differnce between start and end date
  private calcDate(date1: Date, date2: Date) {
    let message: string;
    var diff = Math.floor(date2.getTime() - date1.getTime());
    var day = 1000 * 60 * 60 * 24;

    let days = Math.floor(diff / day) + 1;
    let months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    // subtracting years from total months, months from total days
    months =
      years > 0
        ? parseInt((months / 12).toString().split('.')[1]) * 12
        : months;
    days =
      months > 0 ? parseInt((days / 30).toString().split('.')[1]) * 30 : days;

    if (years == 1 && !months) {
      days = 0;
    }

    // managing string according to given years, months and days
    message =
      years > 0 ? (years > 1 ? years + ' Years ' : years + ' Year ') : '';
    message +=
      months > 0 ? (months > 1 ? months + ' Months ' : months + ' Month ') : '';
    message += days > 0 ? (days > 1 ? days + ' Days' : days + ' Day') : '';

    this.difference = message;
  }
}
