// import { TestBed } from '@angular/core/testing';
// import { PermissionService } from './permission.service';
// import { takeLast } from 'rxjs/operators';

// describe('PermissionService', () => {
//     let service: PermissionService;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [PermissionService]
//         });
//         service = TestBed.inject(PermissionService);
//     });
//     it('should update canEditGroup correctly', (done) => {
//         let groupId = 'testGroupId';
//         let canEdit = true;

//         service.updateCanEditGroup(groupId, canEdit);

//         service.canEditGroup$.pipe(takeLast(1)).subscribe(value => {
//             expect(value[groupId]).toBe(canEdit);
//             done();
//         });
//     });

//     it('should update canEditChannel correctly', (done) => {
//         let channelId = 'testChannelId';
//         let canEdit = false;

//         service.updateCanEditChannel(channelId, canEdit);

//         service.canEditChannel$.pipe(takeLast(1)).subscribe(value => {
//             expect(value[channelId]).toBe(canEdit);
//             done();
//         });
//     });
// });