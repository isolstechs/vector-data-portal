import { Injectable } from "@angular/core";
// import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: "root",
})
export class MyMessageService {
  constructor() // private _messageService: MessageService
  {}

  public raiseMessage(
    _severity: "error" | "warn" | "success",
    _messageContent: string
  ): void {
    this.clearMessages();
    // this._messageService.add({key: 'top-center', severity: _severity, summary: _messageContent, closable: false});
  }

  public raiseGenericErrorMessage(): void {
    this.clearMessages();
    this.raiseMessage(
      "error",
      "Error! Please check your internet, refresh page and try again."
    );
  }

  private clearMessages(): void {
    // this._messageService.clear();
  }
}
