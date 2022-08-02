import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Papa } from 'ngx-papaparse';
import { Subject } from 'rxjs';
import { HomeService } from '../../../home/services/home.service';
import { IPrefixList } from '../../../interfaces/prefix-list.interface';
import { MessageService } from '../../../services/core/message.service';
import * as XLSX from 'xlsx/xlsx.mjs';
import * as _ from 'lodash';
import { CountryListModalComponent } from '../country-list-modal/country-list-modal.component';

@Component({
  selector: 'app-import-prefix-file-modal',
  templateUrl: './import-prefix-file-modal.component.html',
  styleUrls: ['./import-prefix-file-modal.component.scss'],
})
export class ImportPrefixFileModalComponent implements OnInit {
  fileName: string = `No file uploaded yet.`;
  customError: string = '';
  fileSelect: boolean = false;
  showError: boolean = false;
  headingError: string = '';
  dataFile: File;
  ext: string;

  isLoading = false;
  prefixes!: IPrefixList[];

  private _takeUntil: Subject<null> = new Subject<null>();

  constructor(
    private _dialogRef: MatDialogRef<ImportPrefixFileModalComponent>,
    private _messageService: MessageService,
    private _papa: Papa,
    private _homeService: HomeService,
    private _cd: ChangeDetectorRef,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.loadImportCSVForm();
  }

  ngOnDestroy() {
    this._takeUntil.next(null);
    this._takeUntil.complete();
  }

  closeModal(): void {
    this._dialogRef.close();
  }

  onFileSelected(event: any) {
    this.headingError = '';
    this.dataFile = event.target.files[0];

    if (this.dataFile) {
      // saving file name for showing on input
      this.fileName = this.dataFile.name;
      this.fileSelect = true;

      // checking file is csv, xlsx or not
      this.ext = this.fileName.split('.')[1].toLowerCase();
      if (this.ext != 'csv' && this.ext != 'xlsx') {
        this.headingError = 'Please choose CSV or XLSX file.';
        this.showError = true;
        return;
      } else {
        this.headingError = '';
        this.showError = false;
      }

      // checking file name is lengthy or not
      if (this.fileName.length > 25) {
        this.fileName = this.fileName.slice(0, 25) + '...';
      }
    }
  }

  // on uploading file
  async upload() {
    if (
      !this.fileSelect ||
      this.showError ||
      (this.ext != 'csv' && this.ext != 'xlsx')
    ) {
      return;
    }
    this.isLoading = true;

    // if selected file in csv format
    if (this.ext == 'csv') {
      this.changeCSVFileToData(this.dataFile);
    } else if (this.ext == 'xlsx') {
      // if selected file in xlsx format
      await this.changeXLSXToCSV(this.dataFile);
    }
  }

  // changing xlsx file into csv data array
  async changeXLSXToCSV(_file: any): Promise<any> {
    // changing file into array buffer
    const data = await _file.arrayBuffer();

    // change buffer into xlsx array data
    const workbook = XLSX.read(data, { type: 'array' });

    // select firstSheet from the xlsx array data
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    // change sheet to csv data
    const result = XLSX.utils.sheet_to_csv(firstSheet, { header: 1 });

    // changing csv data to array
    this.changeCSVDataToArray(result);
  }

  // changing csv file into csv data array
  private changeCSVFileToData(_csvFile: any): void {
    const reader = new FileReader();
    reader.readAsText(_csvFile);

    reader.onload = (event: any) => {
      const csv = event.target.result; // Content of CSV file
      // changing csv data to array
      this.changeCSVDataToArray(csv);
    };
  }

  private changeCSVDataToArray(_data: any): void {
    this._papa.parse(_data, {
      skipEmptyLines: true,
      header: true,

      transformHeader: (_h) => {
        return _h.toLowerCase();
      },
      complete: (results: any) => {
        this.checkingHeaders(results.data[0]);

        // checking header error
        if (this.headingError.length) {
          this.isLoading = false;
          return;
        }

        // _.remove(results.data, (p: IPrefixList) => {
        //   return p.country.toLowerCase() == p.operator.toLowerCase();
        // });

        results.data = _.uniqBy(results.data, 'prefix');
        this.prefixes = results.data;

        this.createPrefixes(this.prefixes);
      },
    });
  }

  private checkingHeaders(_p: IPrefixList): void {
    this.showError = true;
    this.headingError = 'Could not found header: ';

    if (!_p.hasOwnProperty('country')) {
      this.headingError = this.headingError + `Country.`;
    } else if (!_p.hasOwnProperty('operator')) {
      this.headingError = this.headingError + 'Operator.';
    } else if (!_p.hasOwnProperty('prefix')) {
      this.headingError = this.headingError + 'Prefix.';
    } else {
      this.showError = false;
      this.headingError = '';
    }

    this._cd.detectChanges();
  }

  private createPrefixes(_prefixes: IPrefixList[]) {
    this._homeService.createPrefixes(_prefixes).subscribe(
      (_prefixes: IPrefixList[]) => {
        this._messageService.raiseMessage(
          'success',
          'Prefixes successfully created'
        );

        this.isLoading = false;
        this._dialogRef.close(true);
      },
      (_err) => {
        this._messageService.raiseMessage('error', _err, 'OK', 20);
        this.isLoading = false;
      }
    );
  }

  // open modal for creating new call records
  createCountryListModal() {
    this._dialog.open(CountryListModalComponent, {
      width: '400px',
    });
  }
}
