import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ICallRecord } from '../../../interfaces/call-record.interface';

@Component({
  selector: 'app-export-file-modal',
  templateUrl: './export-file-modal.component.html',
  styleUrls: ['./export-file-modal.component.scss'],
})
export class ExportFileModalComponent implements OnInit {
  exportFileNameForm: FormGroup;
  callRecords!: ICallRecord[];

  private _takeUntil: Subject<null> = new Subject<null>();

  constructor(
    private _dialogRef: MatDialogRef<ExportFileModalComponent>,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initExportFileNameForm();
  }

  ngOnDestroy() {
    this._takeUntil.next(null);
    this._takeUntil.complete();
  }

  closeModal(): void {
    this._dialogRef.close();
  }

  save() {
    if (this.exportFileNameForm.invalid) {
      return;
    }
    this._dialogRef.close(this.exportFileNameForm.value.fileName);
  }

  private initExportFileNameForm(): void {
    this.exportFileNameForm = this._fb.group({
      fileName: ['', Validators.required],
    });
  }
}
