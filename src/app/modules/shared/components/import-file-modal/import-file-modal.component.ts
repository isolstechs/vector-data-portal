import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Papa } from 'ngx-papaparse';
import { Subject } from 'rxjs';
import { HomeService } from '../../../home/services/home.service';
import { ICallRecord } from '../../../interfaces/call-record.interface';
import { MessageService } from '../../../services/core/message.service';
import * as XLSX from 'xlsx/xlsx.mjs';

@Component({
  selector: 'app-import-file-modal',
  templateUrl: './import-file-modal.component.html',
  styleUrls: ['./import-file-modal.component.scss'],
})
export class ImportFileModalComponent implements OnInit {
  fileName: string = `No file uploaded yet.`;
  customError: string = '';
  fileSelect: boolean = false;
  showError: boolean = false;
  headingError: string = '';
  dataFile: File;
  ext: string;

  isLoading = false;
  callRecords!: ICallRecord[];

  private _takeUntil: Subject<null> = new Subject<null>();

  constructor(
    private _dialogRef: MatDialogRef<ImportFileModalComponent>,
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
        this.customError = 'Please choose CSV or XLSX file.';
        this.showError = true;
        return;
      } else {
        this.customError = '';
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
        if (_h == 'Destination Prefix') {
          _h = 'prefix';
        } else if (_h == 'A Party') {
          _h = 'aParty';
        } else if (_h == 'B Party') {
          _h = 'bParty';
        } else if (_h == 'Date') {
          _h = 'date';
        } else if (_h == 'SessionTime') {
          _h = 'sessionTime';
        }

        return _h;
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
        this.callRecords.map((_cl: ICallRecord) => {
          _cl.date = _cl.date.replace('  ', ' ');
          // checking two digits for month available or not
          if (_cl.date.slice(1, 2) == '/') {
            _cl.date = '0' + _cl.date;
          }

          // checking two digits for day available or not
          if (_cl.date.slice(4, 5) == '/') {
            _cl.date = _cl.date.slice(0, 3) + '0' + _cl.date.slice(3);
          }

          // checking four digits for year available or not
          if (_cl.date.slice(8, 9) == ' ') {
            _cl.date = _cl.date.slice(0, 6) + '20' + _cl.date.slice(6);
          }

          // checking two digits for hour available or not
          if (_cl.date.slice(13, 14) != ':') {
            _cl.date = _cl.date.slice(0, 11) + '0' + _cl.date.slice(11);
          }

          _cl.date =
            _cl.date.slice(6, 10) +
            '-' +
            _cl.date.slice(0, 2) +
            '-' +
            _cl.date.slice(3, 5) +
            'T' +
            _cl.date.slice(11, _cl.date.length) +
            ':00.000Z';

          // _cl.date = new Date(_cl.date) as any;
        });

        console.log(this.callRecords);
        this.createCallRecords(this.callRecords);
      },
    });
  }

  private checkingHeaders(_o: ICallRecord): void {
    let i = 0;
    this.headingError = 'Could not found:';

    _o.hasOwnProperty('prefix')
      ? i++
      : (this.headingError = this.headingError + `Destination Prefix.`);
    _o.hasOwnProperty('aParty')
      ? i++
      : (this.headingError = this.headingError + 'A Party.');
    _o.hasOwnProperty('bParty')
      ? i++
      : (this.headingError = this.headingError + 'B Party.');
    _o.hasOwnProperty('date')
      ? i++
      : (this.headingError = this.headingError + 'Date.');
    _o.hasOwnProperty('sessionTime')
      ? i++
      : (this.headingError = this.headingError + 'SessionTime.');

    if (i < 5) {
      this.customError = 'Please give the appropriate Headers!';
      this.showError = true;
    } else {
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
        this._messageService.raiseMessage('error', _err);
        this.isLoading = false;
      }
    );
  }
}
