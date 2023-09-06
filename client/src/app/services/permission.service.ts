import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public canEditGroup: { [groupId: number]: boolean } = {};
  public canEditChannel: { [channelId: number]: boolean } = {};

  // BehaviorSubject to track changes
  private canEditGroupSubject: BehaviorSubject<{ [groupId: number]: boolean }> = new BehaviorSubject(this.canEditGroup);
  private canEditChannelSubject: BehaviorSubject<{ [channelId: number]: boolean }> = new BehaviorSubject(this.canEditChannel);

  // Observable to be consumed by components
  canEditGroup$: Observable<{ [groupId: number]: boolean }> = this.canEditGroupSubject.asObservable();
  canEditChannel$: Observable<{ [channelId: number]: boolean }> = this.canEditChannelSubject.asObservable();

  updateCanEditGroup(groupId: number, canEdit: boolean) {
    this.canEditGroup[groupId] = canEdit;
    this.canEditGroupSubject.next(this.canEditGroup);
  }

  updateCanEditChannel(channelId: number, canEdit: boolean) {
    this.canEditChannel[channelId] = canEdit;
    this.canEditChannelSubject.next(this.canEditChannel);
  }
}
