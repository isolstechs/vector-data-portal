import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private _snackBar: MatSnackBar) {}

  public raiseMessage(
    _severity: 'error' | 'warn' | 'success',
    _messageContent: string,
    _buttonText: string = 'OK',
    _durationSeconds: number = 5
  ): void {
    // this._snackBar.dismiss();
    this._snackBar.open(_messageContent, _buttonText, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: _severity + '-snackbar',
      duration: _durationSeconds * 1000,
    });
  }

  public raiseGenericErrorMessage(): void {
    // this._snackBar.dismiss();
    this.raiseMessage(
      'error',
      'Error! Please check your internet, refresh page and try again.',
      'OK',
      15
    );
  }
}
