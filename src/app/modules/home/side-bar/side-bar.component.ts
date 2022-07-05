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
import { ImportFileModalComponent } from '../../shared/components/import-file-modal/import-file-modal.component';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit, OnDestroy {
  @Input() difference: string;
  @Output() dateEmitter: EventEmitter<IDate> = new EventEmitter();
  @Output() exportEmitter: EventEmitter<string> = new EventEmitter();

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
  initialingAndChangingGraphData(_data: ICountryGraph[]): void {
    this.totalCalls = 0;
    let total: number[] = [];
    let countries: string[] = [];
    let height = 0;

    this.countriesGraph = _data;
    _.orderBy(_data, ['total'], ['desc']).forEach((_cg: ICountryGraph) => {
      if (_cg.total > 0) {
        total.push(_cg.total);
        this.totalCalls += _cg.total;
        // percentage.push(_cg.percentage);
        countries.push(_cg.name);
        height += 30;
      }
    });

    // setting height for chartjs main div
    this.style = `height: ${height + 30}px`;

    // setting height for chart js
    this.height = height;
    this.changeGraph(total, countries);
  }

  // open modal for creating new call records
  createCallRecordsModal() {
    this.dialog.open(ImportFileModalComponent, {
      width: '400px',
    });
  }

  // submitting graph data to chartjs options
  private changeGraph(_total: number[], _countries: string[]): void {
    // chart options
    (this.plugins = [ChartDataLabels.default]),
      (this.horizontalOptions = {
        mantainAspectRation: true,
        // showing graph on y-axis
        indexAxis: 'y',
        plugins: {
          // tooltip options
          tooltip: {
            enabled: true,
            // mode: 'single',
            displayColors: false,
            callbacks: {
              label: (context) => {
                const tooltipValuesObject = this.getTooltipValue(context.label);
                const value: string[] = [];
                value[0] = 'Total: ' + tooltipValuesObject.total;
                value[1] = 'Country Name: ' + tooltipValuesObject.name;
                value[2] = 'Country ISO Code: ' + tooltipValuesObject.alphaCode;
                value[3] = 'Country Code: ' + tooltipValuesObject.numericCode;

                return value;
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
            color: '#f99c47',
            labels: {
              title: {
                font: {
                  size: 15,
                  weight: 'bold',
                },
              },
            },
            formatter: function (value) {
              return value;
            },
          },
        },
        scales: {
          x: {
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
        onClick: (_data) => {
          this.exportEmitter.next(_data.chart.tooltip.dataPoints[0].label);
        },
      });

    // chart data
    this.basicData = {
      // labels for showing on x-axis
      labels: _countries,
      // data showing on chart
      datasets: [
        {
          backgroundColor: '#f99c47',
          data: _total,
        },
      ],
    };

    this._cd.detectChanges();
  }

  // returns tooltip data when hovers on a country
  private getTooltipValue(_countryName: string) {
    let indexOfCountry, countryObject;

    indexOfCountry = this.countriesGraph.findIndex(
      (e) => e.name == _countryName
    );

    if (indexOfCountry != -1) {
      countryObject = this.countriesGraph[indexOfCountry];
    }

    return {
      total: countryObject ? countryObject.total : '',
      name: countryObject ? countryObject.name : '',
      alphaCode: countryObject ? countryObject.alphaCode : '',
      numericCode: countryObject ? countryObject.numericCode : '',
    };
  }
}
