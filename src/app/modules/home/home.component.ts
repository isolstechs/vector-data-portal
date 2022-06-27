import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ImportFileModalComponent } from './components/import-file-modal/import-file-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  name = 'Vector Data Portal';
  test: any = [];

  private _takeUntil: Subject<null> = new Subject<null>();
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    undefined;
  }

  ngOnDestroy(): void {
    this._takeUntil.next(null);
    this._takeUntil.complete();
  }

  // open modal for creating new call records
  CreateCallRecordsModal() {
    const dialogRef = this.dialog.open(ImportFileModalComponent, {
      // height: '400px',
      width: '400px',
    });
  }
}
