import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { Countries } from './world-map-countries';
import { ICountryGraph } from '../../interfaces/country-graph.interface';

declare var jQuery: any;

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
})
export class WorldMapComponent implements OnInit, OnDestroy {
  @Input() difference: string;
  @Output() exportEmitter: EventEmitter<string> = new EventEmitter();

  countriesGraph: ICountryGraph[] = [];
  countryCodeObject: any;
  app = {
    color: {
      primary: '#2499ee',
      accent: '#6284f3',
      warn: '#907eec',
    },
  };

  private _takeUntil: Subject<null> = new Subject<null>();
  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._takeUntil.next(null);
    this._takeUntil.complete();
  }

  // intilize the world and calling this function from parent component
  initWorldMapData(_data: ICountryGraph[]) {
    // removing world map if available
    this.removeWorldMap('jvectormap-container');
    if (_data.length) {
      this.countriesGraph = _data;
      this.countryCodeObject = Countries.CountryCodes;
      this.createWorldMap('world-map');
    }
  }

  // creating world map data
  createWorldMap(_containerId): void {
    // world map
    const graphData = this.countriesGraph;
    const graphValues = {};

    // creating a property named with country code with the value of total calls
    graphData.forEach((e) => {
      graphValues[e.alphaCode] = e.total;
    });

    this.initWorldMap(_containerId, graphValues);
  }

  // creating world map
  private initWorldMap(_containerId, _graphValues) {
    let vectorMapSettings;

    // vectormap settings
    vectorMapSettings = {
      map: 'world_mill',
      backgroundColor: 'transparent',
      color: 'black',
      borderColor: '#ffffff',
      borderWidth: 0.25,
      borderOpacity: 0.25,
      regionStyle: {
        initial: {
          fill: '#cccccc',
        },
      },
      series: {
        regions: [
          {
            values: _graphValues,
            scale: ['#b3d5b08a', '#2f8b29'],
            normalizeFunction: 'polynomial',
          },
        ],
      },
      onRegionTipShow: (e, el, code) => {
        const tooltipValuesObject = this.getTooltipValue(code);
        if (tooltipValuesObject.total > 0) {
          el.html(
            el.html() +
              '<hr style="margin: 0; border-style: inset; border:1px solid; border-top: 1px solid rgba(0,0,0,.1);" />' +
              'Total            : ' +
              tooltipValuesObject.total +
              '<br>' +
              'Country Name     : ' +
              tooltipValuesObject.name +
              '<br>' +
              'Country ISO Code : ' +
              tooltipValuesObject.alphaCode +
              '<br>' +
              'Country Code     : ' +
              tooltipValuesObject.numericCode
          );
        }
      },
      onRegionClick: (event, code) => {
        const countryObject = this.getTooltipValue(code);
        this.exportEmitter.next(countryObject.name);
      },
    };

    // creating vectro map
    jQuery('#' + _containerId).vectorMap(vectorMapSettings);
  }

  // returns tooltip data when hovers on a country
  private getTooltipValue(_countryCode) {
    let indexOfCountry, countryObject;

    indexOfCountry = this.countriesGraph.findIndex(
      (e) => e.alphaCode == _countryCode
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

  // removing world map if available
  private removeWorldMap(className: string): void {
    if (document as any) {
      const elements = document.getElementsByClassName(className);
      while (elements.length > 0) {
        (elements[0] as any).parentNode.removeChild(elements[0]);
      }
    }
  }
}
