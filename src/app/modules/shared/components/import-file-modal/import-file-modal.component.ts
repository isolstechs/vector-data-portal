import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Papa } from 'ngx-papaparse';
import { Subject } from 'rxjs';
import { HomeService } from '../../../home/services/home.service';
import { ICallRecord } from '../../../interfaces/call-record.interface';
import { MessageService } from '../../../services/core/message.service';

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
    const file: File = event.target.files[0];

    if (file) {
      // saving file name for showing on input
      this.fileName = file.name;
      this.fileSelect = true;

      // checking file is csv or not
      this.requiredFileType('csv');
      if (this.showError) {
        return;
      }

      // checking file name is lengthy or not
      if (this.fileName.length > 25) {
        this.fileName = this.fileName.slice(0, 25) + '...';
      }

      // changing csv file into array
      this.changeCSVFileToArray(file);
    }
  }

  async save() {
    if (!this.fileSelect || this.showError || !this.callRecords) {
      return;
    }

    this.isLoading = true;
    this.createCallRecords(this.callRecords);
  }

  private requiredFileType(_type: string): void {
    const extension = this.fileName.split('.')[1].toLowerCase();
    if (_type.toLowerCase() !== extension.toLowerCase()) {
      this.customError = 'Please choose CSV file.';
      this.showError = true;
    } else {
      this.customError = '';
      this.showError = false;
    }
  }

  private changeCSVFileToArray(_csvFile: any): void {
    const reader = new FileReader();
    reader.readAsText(_csvFile);
    reader.onload = (event: any) => {
      const csv = event.target.result; // Content of CSV file
      this._papa.parse(csv, {
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
          this.callRecords = results.data;

          // changing date to Date format
          this.callRecords.map((_cl: ICallRecord) => {
            // checking two digits for date available or not
            if (_cl.date.slice(1, 2) == '/') {
              _cl.date = '0' + _cl.date;
            }

            // checking two digits for months available or not
            if (_cl.date.slice(4, 5) == '/') {
              _cl.date = _cl.date.slice(0, 3) + '0' + _cl.date.slice(3);
            }

            // checking two digits for hour available or not
            if (_cl.date.slice(13, 14) != ':') {
              _cl.date = _cl.date.slice(0, 11) + '0' + _cl.date.slice(11);
            }

            _cl.date =
              _cl.date.slice(6, 10) +
              '-' +
              _cl.date.slice(3, 5) +
              '-' +
              _cl.date.slice(0, 2) +
              'T' +
              _cl.date.slice(11, _cl.date.length) +
              ':00Z';
            // _cl.date = new Date(_cl.date) as any;
          });

          console.log(this.callRecords);
        },
      });
    };
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
          'Account successfully created'
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
