import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { ICallRecord } from '../interfaces/call-record.interface';
import { ICountryGraph } from '../interfaces/country-graph.interface';
import { ICountry } from '../interfaces/country.interface';
import { IDate } from '../interfaces/date.interaface';
import { SharedService } from '../shared/services/shared.service';
import { HomeService } from './services/home.service';
import { SideBarComponent } from './side-bar/side-bar.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { WorldMapComponent } from './world-map/world-map.component';
import { MatDialog } from '@angular/material/dialog';
import { ExportFileModalComponent } from '../shared/components/export-file-modal/export-file-modal.component';
import { IOperator } from '../interfaces/operator.interface';
import { IPrefix } from '../interfaces/prefix.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(SideBarComponent) _sideBarComponent: SideBarComponent;
  @ViewChild(WorldMapComponent) _worldMapComponent: WorldMapComponent;

  isLoading: boolean = false;
  initialCall: boolean = true;
  dataFound: boolean;
  date: IDate;
  difference: string;
  countriesGraphData: ICountryGraph[];
  operators = {};
  countries = {};
  prefixes = {};
  callRecords: ICallRecord[];

  private _takeUntil: Subject<null> = new Subject<null>();
  constructor(
    private _homeService: HomeService,
    private _sharedService: SharedService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.getOperators();
    this.getPrefixes();
  }

  ngOnDestroy(): void {
    this._takeUntil.next(null);
    this._takeUntil.complete();
  }

  // changing date from sideBarComponent
  changeDate(_date: IDate): void {
    // selecting new date or not
    if (this.date == _date) {
      return;
    }

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
      setTimeout(() => {
        this.getCountriesCallRecrods();
      }, 500);
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
        .map((_d) => {
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
      .getCountries()
      .pipe(takeUntil(this._takeUntil))
      .subscribe((_countries: ICountry[]) => {
        this.countries = {};
        if (_countries.length) {
          _countries.forEach((_c: ICountry) => {
            this.countries[_c.id] = { name: _c.name, code: _c.code };
          });
        }
      });
  }

  // getting operators array
  private getOperators(): void {
    this._sharedService
      .getOperators()
      .pipe(takeUntil(this._takeUntil))
      .subscribe((_operators: IOperator[]) => {
        this.operators = {};
        if (_operators.length) {
          _operators.forEach((_o: IOperator) => {
            this.operators[_o.id] = _o.name;
          });
        }
      });
  }

  // getting prefixes array
  private getPrefixes(): void {
    this._sharedService
      .getPrefixes()
      .pipe(takeUntil(this._takeUntil))
      .subscribe((_prefixes: IPrefix[]) => {
        this.prefixes = {};
        if (_prefixes.length) {
          _prefixes.forEach((_p: IPrefix) => {
            this.prefixes[_p.id] = {
              prefix: _p.prefix,
              countryId: _p.countryId,
              operatorId: _p.operatorId,
            };
          });
        }
      });
  }

  // getting call records array according to given date
  private getCountriesCallRecrods(): void {
    this.isLoading = true;
    this._homeService
      .getCallRecords(this.date)
      .pipe(takeUntil(this._takeUntil))
      .subscribe((_callRecords: ICallRecord[]) => {
        if (!_callRecords?.length) {
          this.dataFound = false;
        } else {
          this.dataFound = true;
          _callRecords.forEach((_cr: ICallRecord) => {
            _cr.prefix = {
              id: _cr.prefixId,
              prefix: this.prefixes[_cr.prefixId].prefix,
              countryId: this.prefixes[_cr.prefixId].countryId,
              operatorId: this.prefixes[_cr.prefixId].operatorId,
            };
            _cr.prefix.country = {
              id: _cr.prefix.countryId,
              name: this.countries[_cr.prefix.countryId].name,
              code: this.countries[_cr.prefix.countryId].code,
            };
            _cr.prefix.operator = {
              id: _cr.prefix.operatorId,
              name: this.operators[_cr.prefix.operatorId],
            };
          });
        }

        this.callRecords = _.orderBy(_callRecords, 'date', 'desc');
        console.log(this.callRecords);
        this.changeCallRecordsToGraphData();
        this.isLoading = false;
      });
  }

  // changing call records to countries graph
  private changeCallRecordsToGraphData(): void {
    let tempCountriesGraph = _(this.callRecords)
      .groupBy((x) => x.prefix.countryId)
      .map((_vals: any[], _countryId) => {
        // const trmType = { cc: 0, cli: 0, 'no-cli': 0 };
        const trmType = {};
        _(_vals)
          .countBy('trmType')
          .map((y, _countryId) => {
            trmType[_countryId] = y;
          })
          .value();

        const id = parseInt(_countryId);
        return {
          id,
          name: this.countries[id].name,
          code: this.countries[id].code,
          total: _vals?.length,
          trmType,
        };
      })
      .value();

    this.countriesGraphData = tempCountriesGraph as any;

    this.changeGraphOnSideBarComponent();
    this.changeGraphOnWorlMapComponent();
  }

  // calling fucntion on sideBarComponent to change countriesGraph
  private changeGraphOnSideBarComponent(): void {
    this._sideBarComponent.initializingAndChangingGraphData(
      this.countriesGraphData,
      this.dataFound
    );
  }

  // calling fucntion on worlMapComponent to change countriesGraph
  private changeGraphOnWorlMapComponent(): void {
    this._worldMapComponent.initWorldMapData(
      this.countriesGraphData,
      this.dataFound
    );
  }

  // showing differnce between start and end date
  private calcDate(date1: Date, date2: Date) {
    // const d = new Date().setHours(0, 0, 0, 0);
    // if (d == _.cloneDeep(date1).setHours(0, 0, 0, 0)) {
    //   this.difference = 'Today';
    //   return;
    // }

    // let message: string;
    // var diff = Math.floor(date2.getTime() - date1.getTime());
    // var day = 1000 * 60 * 60 * 24;
    // debugger;
    // let days = Math.floor(diff / day) + 1;
    // let months = Math.floor(days / 30);
    // const years = Math.floor(months / 12);

    // // subtracting years from total months, months from total days
    // months =
    //   years > 0
    //     ? parseInt((months / 12).toString().split('.')[1]) * 12
    //     : months;
    // days =
    //   months > 0 ? parseInt((days / 30).toString().split('.')[1]) * 30 : days;

    // if (years == 1 && !months) {
    //   days = 0;
    // }

    // // managing string according to given years, months and days
    // message =
    //   years > 0 ? (years > 1 ? years + ' Years ' : years + ' Year ') : '';
    // message +=
    //   months > 0 ? (months > 1 ? months + ' Months ' : months + ' Month ') : '';
    // message += days > 0 ? (days > 1 ? days + ' Days' : days + ' Day') : '';

    // this.difference = message;

    this.difference = moment(date1).to(moment(date2), true);
  }
}
