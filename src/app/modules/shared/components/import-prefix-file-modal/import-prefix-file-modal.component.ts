import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Papa } from 'ngx-papaparse';
import { Subject } from 'rxjs';
import { HomeService } from '../../../home/services/home.service';
import { IPrefixList } from '../../../interfaces/prefix-list.interface';
import { MessageService } from '../../../services/core/message.service';

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

  isLoading = false;
  prefixes!: IPrefixList[];

  private _takeUntil: Subject<null> = new Subject<null>();

  constructor(
    private _dialogRef: MatDialogRef<ImportPrefixFileModalComponent>,
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
    if (!this.fileSelect || this.showError || !this.prefixes) {
      return;
    }

    this.isLoading = true;
    this.createPrefixes(this.prefixes);
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
          return _h.toLowerCase();
        },
        complete: (results: any) => {
          this.checkingHeaders(results.data[0]);
          this.prefixes = results.data;

          console.log(this.prefixes);
        },
      });
    };
  }

  private checkingHeaders(_p: IPrefixList): void {
    let i = 0;
    this.headingError = 'Could not found:';

    _p.hasOwnProperty('country')
      ? i++
      : (this.headingError = this.headingError + `Country.`);
    _p.hasOwnProperty('operator')
      ? i++
      : (this.headingError = this.headingError + 'Operator.');
    _p.hasOwnProperty('prefix')
      ? i++
      : (this.headingError = this.headingError + 'Prefix.');

    if (i < 3) {
      this.customError = 'Please give the appropriate Headers!';
      this.showError = true;
    } else {
      this.headingError = '';
    }
    this._cd.detectChanges();
  }

  private createPrefixes(_prefixes: IPrefixList[]) {
    this.isLoading = true;
    this._homeService.createPrefixes(_prefixes).subscribe(
      (_prefixes: IPrefixList[]) => {
        this._messageService.raiseMessage(
          'success',
          'Prefix successfully created'
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
