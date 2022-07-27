import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { countryList } from './country-list';

interface ICountryList {
  name: string;
  code: string;
}

@Component({
  selector: 'app-country-list-modal',
  templateUrl: './country-list-modal.component.html',
  styleUrls: ['./country-list-modal.component.scss'],
})
export class CountryListModalComponent implements OnInit {
  constructor(private _dialogRef: MatDialogRef<CountryListModalComponent>) {}
  countriesList: ICountryList[] = countryList;
  ngOnInit(): void {}

  closeModal(): void {
    this._dialogRef.close();
  }
}
