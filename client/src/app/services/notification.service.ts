import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _show = new BehaviorSubject<boolean>(false);
  private _message = new BehaviorSubject<string>('');

  public show = this._show.asObservable();
  public message = this._message.asObservable();

  notify(message: string, duration: number = 3000): void {
    this._message.next(message);
    this._show.next(true);

    this._show.pipe(debounceTime(duration)).subscribe(() => {
      this._show.next(false);
    });
  }

}
