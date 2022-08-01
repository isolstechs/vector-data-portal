import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Papa } from 'ngx-papaparse';
import { Subject } from 'rxjs';
import { HomeService } from '../../../home/services/home.service';
import { ICallRecord } from '../../../interfaces/call-record.interface';
import { MessageService } from '../../../services/core/message.service';
import * as XLSX from 'xlsx/xlsx.mjs';
import { ImportCallRecordsFileModalDateHelpers } from './import-call-records-file-modal-date-helpers';

@Component({
  selector: 'app-import-call-records-file-modal',
  templateUrl: './import-call-records-file-modal.component.html',
  styleUrls: ['./import-call-records-file-modal.component.scss'],
})
export class ImportCallRecordsFileModalComponent implements OnInit {
  fileName: string = `No file uploaded yet.`;
  fileSelect: boolean = false;
  showError: boolean = false;
  headingError: string = '';
  dataFile: File;
  ext: string;

  isLoading = false;
  callRecords!: ICallRecord[];

  private _takeUntil: Subject<null> = new Subject<null>();

  constructor(
    private _dialogRef: MatDialogRef<ImportCallRecordsFileModalComponent>,
    private _messageService: MessageService,
    private _papa: Papa,
    private _homeService: HomeService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this._takeUntil.next(null);
    this._takeUntil.complete();
  }

  closeModal(): void {
    this._dialogRef.close();
  }

  // on selecting file
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
  async changeXLSXToCSV(_file: any): Promise<void> {
    // changing file into array buffer
    const data = await _file.arrayBuffer();

    // change buffer into xlsx array data
    var workbook = XLSX.read(data, { type: 'array' });

    // select firstSheet from the xlsx array data
    var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    // change sheet to csv data
    var result = XLSX.utils.sheet_to_csv(firstSheet, { header: 1 });

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
        const headersObj = {
          'destination prefix': 'prefix',
          'a party': 'aParty',
          'b party': 'bParty',
          date: 'date',
          sessiontime: 'sessionTime',
          'termination type': 'trmType',
        };

        const val = headersObj[_h?.toLowerCase()];

        return val ? val : _h;

        // if (_h == ) {
        //   _h = '';
        // } else if (_h == ) {
        //   _h = 'aParty';
        // } else if (_h == 'B Party') {
        //   _h = 'bParty';
        // } else if (_h == 'Date') {
        //   _h = 'date';
        // } else if (_h == 'SessionTime') {
        //   _h = 'sessionTime';
        // } else if (_h == 'Termination Type') {
        //   _h = 'trmType';
        // }

        // return _h;
      },
      complete: (results: any) => {
        this.checkingHeaders(results.data[0]);

        // checking header error
        if (this.headingError.length) {
          this.isLoading = false;
          return;
        }

        this.callRecords = results.data;

        // changing date to Date format
        for (let i = 0; i < this.callRecords.length; i++) {
          const _cl: ICallRecord = this.callRecords[i];

          if (_cl.date) {
            try {
              _cl.date = ImportCallRecordsFileModalDateHelpers.initDate(
                _cl.date
              );
            } catch (error) {
              console.log(error);
              this._messageService.raiseMessage(
                'error',
                'Invalid date found on row ' +
                  (i + 1) +
                  '. Provided date should be in "MM/DD/YYYY HH:mm" or "YYYY/MM/DD HH:mm" format.',
                'OK',
                20
              );
              this.isLoading = false;
              return;
            }
          }

          _cl.trmType = _cl.trmType?.toLowerCase();
        }

        console.log(this.callRecords);
        this.createCallRecords(this.callRecords);
      },
    });
  }

  private checkingHeaders(_o: ICallRecord): void {
    this.showError = true;
    this.headingError = 'Could not found header: ';

    if (!_o.hasOwnProperty('prefix')) {
      this.headingError = this.headingError + 'Destination Prefix.';
    } else if (!_o.hasOwnProperty('aParty')) {
      this.headingError = this.headingError + 'A Party.';
    } else if (!_o.hasOwnProperty('bParty')) {
      this.headingError = this.headingError + 'B Party.';
    } else if (!_o.hasOwnProperty('date')) {
      this.headingError = this.headingError + 'Date.';
    } else if (!_o.hasOwnProperty('sessionTime')) {
      this.headingError = this.headingError + 'SessionTime.';
    } else if (!_o.hasOwnProperty('trmType')) {
      this.headingError = this.headingError + 'Termination Type.';
    } else {
      this.showError = false;
      this.headingError = '';
    }
    this._cd.detectChanges();
  }

  private createCallRecords(_callRecords: ICallRecord[]) {
    this.isLoading = true;
    this._homeService.createCallRecord(_callRecords).subscribe(
      (_callRecords: ICallRecord[]) => {
        this._messageService.raiseMessage(
          'success',
          'Call Records successfully created'
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
}
