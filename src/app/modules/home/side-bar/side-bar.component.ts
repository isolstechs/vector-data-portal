import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ICountryGraph } from '../../interfaces/country-graph.interface';
import * as _ from 'lodash';
import { IDate } from '../../interfaces/date.interaface';
import { MatDialog } from '@angular/material/dialog';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { ImportCallRecordsFileModalComponent } from '../../shared/components/import-call-records-file-modal/import-call-records-file-modal.component';

declare var Chart: any;

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit, OnDestroy {
  @Input() difference: string;
  @Input() isLoading: boolean;
  @Output() dateEmitter: EventEmitter<IDate> = new EventEmitter();
  @Output() exportEmitter: EventEmitter<string> = new EventEmitter();

  dataFound: boolean;
  basicData: any;
  horizontalOptions: any;
  plugins: any;
  style: string;
  height: number;
  totalCalls: number;
  countriesGraph: ICountryGraph[];

  private _takeUntil: Subject<null> = new Subject<null>();

  constructor(private _cd: ChangeDetectorRef, private dialog: MatDialog) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this._takeUntil.next(null);
    this._takeUntil.complete();
  }

  // changing date range according to custom date range component
  dateRangeChanged(_dateRanges: IDate): void {
    this.dateEmitter.next({
      start: _dateRanges.start,
      end: _dateRanges.end,
    });
  }

  // initializing and changing graph data from parent component
  initializingAndChangingGraphData(
    _data: ICountryGraph[],
    _dataFound: boolean
  ): void {
    if (!_dataFound) {
      this.dataFound = false;
      return;
    }
    this.dataFound = true;
    this.totalCalls = 0;
    let dataSets: any = { cli: [], noCli: [], cc: [] };
    let countries: string[] = [];
    let height = 0;

    this.countriesGraph = _data;
    _.orderBy(_data, ['total'], ['desc']).forEach((_cg: ICountryGraph) => {
      if (_cg?.total > 0) {
        dataSets.cli.push(_cg.trmType.cli ?? 0);
        dataSets.noCli.push(_cg.trmType['no-cli'] ?? 0);
        dataSets.cc.push(_cg.trmType.cc ?? 0);
        // this.totalCalls += _cg.total;
        // percentage.push(_cg.percentage);
        countries.push(
          _cg?.name?.charAt(0).toUpperCase() + _cg?.name?.slice(1)
        );
        height += 30;
      }
    });

    // setting height for chartjs main div
    this.style = `height: ${height + 30}px`;

    // setting height for chart js
    this.height = height;
    this.changeGraph(dataSets, countries);
  }

  // open modal for creating new call records
  createCallRecordsModal() {
    this.dialog.open(ImportCallRecordsFileModalComponent, {
      width: '400px',
    });
  }

  // submitting graph data to chartjs options
  private changeGraph(_dataSet, _countries: string[]): void {
    const datasetIndexes = ['CLI', 'No-CLI', 'CC'];
    // chart options
    this.plugins = [ChartDataLabels.default];
    this.horizontalOptions = {
      mantainAspectRation: true,
      // showing graph on y-axis
      indexAxis: 'y',

      interaction: {
        mode: 'point',
        axis: 'xy',
      },
      plugins: {
        // tooltip options
        tooltip: {
          enabled: true,
          displayColors: false,
          callbacks: {
            label: (context, _second) => {
              // const tooltipValuesObject = this.getTooltipValue(context.label);
              // const value: string[] = [];
              // value[0] = 'Total: ' + tooltipValuesObject.total.toLocaleString();
              // value[1] = 'Country Code: ' + tooltipValuesObject.code;
              return [datasetIndexes[context.datasetIndex], context.raw];
            },
          },
        },
        // labels: { render: 'value' },
        legend: {
          // y-axis title options
          labels: {
            font: { size: 40 },
          },
          // not showing the graph title
          display: false,
        },
        // options for datalabels
        datalabels: {
          offset: 7,
          align: 'end',
          anchor: 'end',
          borderRadius: 4,
          // color: '',
          // color: '#f99c47',
          labels: {
            title: {
              font: {
                size: 15,
                weight: 'bold',
              },
            },
          },
          formatter: function (value, data) {
            if (data.datasetIndex != 2) {
              return '';
            }
            return (
              _dataSet.cli[data.dataIndex] +
              _dataSet.noCli[data.dataIndex] +
              _dataSet.cc[data.dataIndex]
            );
          },
        },
      },

      scales: {
        x: {
          stacked: true,
          ticks: {
            // min: 0,
            // max: 100, // Your absolute max value
            // callback: function (value) {
            //   return value + '%'; // convert it to percentage
            // },
            color: '#495057',
          },
          grid: {
            display: false,
            color: '#ebedef',
          },
          scaleLabel: {
            display: true,
            labelString: 'Percentage',
          },
        },
        y: {
          stacked: true,

          ticks: {
            font: { size: 15 },
            color: '#495057',
          },
          grid: {
            display: false,
            color: '#ebedef',
          },
        },
      },

      // click functions
      onClick: (_data, event) => {
        // getting active point
        var activePoints = _data.chart.getElementsAtEventForMode(
          _data.native,
          'point',
          event[0].element
        );
        this.exportEmitter.next(
          _data.chart.data.labels[activePoints[0].index].toLowerCase()
        );
      },
    };

    // chart data
    this.basicData = {
      // labels for showing on x-axis
      labels: _countries,
      // data showing on chart
      datasets: [
        {
          backgroundColor: '#9ad0f58a',
          // backgroundColor: 'blue',
          data: _dataSet.cli,
        },
        {
          backgroundColor: '#f7c85380',
          // backgroundColor: 'orange',
          data: _dataSet.noCli,
        },
        {
          backgroundColor: '#ffb1c194',
          // backgroundColor: 'red',
          data: _dataSet.cc,
        },
      ],
    };

    this._cd.detectChanges();
  }

  // returns tooltip data when hovers on a country
  private getTooltipValue(_countryName: string) {
    let indexOfCountry, countryObject;

    indexOfCountry = this.countriesGraph.findIndex(
      (e) => e.name == _countryName.toLowerCase()
    );

    if (indexOfCountry != -1) {
      countryObject = this.countriesGraph[indexOfCountry];
    }

    return {
      total: countryObject ? countryObject.total : '',
      name: countryObject ? countryObject.name : '',
      code: countryObject ? countryObject.code : '',
    };
  }
}
