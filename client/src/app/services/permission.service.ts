import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public canEditGroup: { [groupId: string]: boolean } = {};
  public canEditChannel: { [channelId: string]: boolean } = {};

  // BehaviorSubject to track changes
  private canEditGroupSubject: BehaviorSubject<{ [groupId: string]: boolean }> = new BehaviorSubject(this.canEditGroup);
  private canEditChannelSubject: BehaviorSubject<{ [channelId: string]: boolean }> = new BehaviorSubject(this.canEditChannel);

  // Observable to be consumed by components
  canEditGroup$: Observable<{ [groupId: string]: boolean }> = this.canEditGroupSubject.asObservable();
  canEditChannel$: Observable<{ [channelId: string]: boolean }> = this.canEditChannelSubject.asObservable();

  updateCanEditGroup(groupId: string, canEdit: boolean) {
    this.canEditGroup[groupId] = canEdit;
    this.canEditGroupSubject.next(this.canEditGroup);
  }

  updateCanEditChannel(channelId: string, canEdit: boolean) {
    this.canEditChannel[channelId] = canEdit;
    this.canEditChannelSubject.next(this.canEditChannel);
  }
}
