import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GroupService } from './group.service';
import { Group } from '../interfaces/group.model';

describe('GroupService', () => {
    let service: GroupService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GroupService],
        });
        service = TestBed.inject(GroupService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // Ensure that there are no outstanding HTTP requests
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should retrieve all groups', () => {
        const dummyGroups = [
            { _id: '1', groupName: 'Group 1' },
            // Add more dummy groups if needed
        ];

        service.getAllGroups().subscribe(groups => {
            expect(groups.length).toBe(dummyGroups.length);
            expect(groups).toEqual(dummyGroups);
        });

        const req = httpMock.expectOne(service['apiUrl']);
        expect(req.request.method).toBe('GET');
        req.flush(dummyGroups);
    });

    it('should retrieve groups by user ID', () => {
        const dummyGroups = [
            { _id: '1', groupName: 'Group 1' },
            // Add more dummy groups if needed
        ];
        const userId = 'testUserId';

        service.getGroupsByUserId(userId).subscribe(groups => {
            expect(groups.length).toBe(dummyGroups.length);
            expect(groups).toEqual(dummyGroups);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/byUser/${userId}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyGroups);
    });

    it('should return true if user role is admin', () => {
        const groupId = 'testGroupId';
        const userId = 'testUserId';
        const expectedRole = 'admin';

        service.getUserRole(groupId, userId).subscribe(role => {
            expect(role).toBeTrue();
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/userRole/${groupId}/${userId}`);
        expect(req.request.method).toBe('GET');
        req.flush(expectedRole);
    });

    it('should add a new group', () => {
        const dummyGroup: Group = { _id: '1', groupName: 'Group 1' };
        const userId = 'testUserId';
        const postData = { group: dummyGroup, userId };

        service.addGroup(dummyGroup, userId).subscribe(group => {
            expect(group).toEqual(dummyGroup);
        });

        const req = httpMock.expectOne(service['apiUrl']);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(postData);
        req.flush(dummyGroup);
    });

    it('should update an existing group', () => {
        const dummyGroup: Group = { _id: '1', groupName: 'Group 1 Updated' };

        service.updateGroup(dummyGroup).subscribe(group => {
            expect(group).toEqual(dummyGroup);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/${dummyGroup._id}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(dummyGroup);
        req.flush(dummyGroup);
    });

    it('should throw an error if trying to update a group without an ID', () => {
        const dummyGroup: Group = { _id: undefined, groupName: 'Group Without ID' };

        expect(() => service.updateGroup(dummyGroup)).toThrow(new Error("Group ID is missing"));
    });

    it('should delete a group by ID', () => {
        const groupId = '1';

        service.deleteGroup(groupId).subscribe(() => {
            expect().nothing(); // Expect no data to be returned
        }, () => {
            fail('Delete request failed'); // Fail the test if the request fails
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/${groupId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null); // Respond with no data
    });



    it('should return false if user role is not admin', () => {
        const groupId = 'testGroupId';
        const userId = 'testUserId';
        const expectedRole = 'member';

        service.getUserRole(groupId, userId).subscribe(role => {
            expect(role).toBeFalse();
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/userRole/${groupId}/${userId}`);
        expect(req.request.method).toBe('GET');
        req.flush(expectedRole);
    });

});