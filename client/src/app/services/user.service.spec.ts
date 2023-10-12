import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.model';
import { Role } from '../interfaces/user.model';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService]
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // Ensure that there are no outstanding requests
    });

    it('should retrieve all users', () => {
        const dummyUsers: User[] = [
            { _id: '1', email: 'fake@email.com', userName: 'fake', password: 'fake', status: 'user' },
            { _id: '2', email: 'fakes@email.com', userName: 'fake', password: 'fake', status: 'user' },
            // Add more dummy users if needed
        ];

        service.getAllUsers().subscribe(users => {
            expect(users.length).toBe(dummyUsers.length);
            expect(users).toEqual(dummyUsers);
        });

        const req = httpMock.expectOne(service.apiUrl);
        expect(req.request.method).toBe('GET');
        req.flush(dummyUsers); // Respond with dummy users
    });
    it('should retrieve a user by ID', () => {
        const dummyUser: User = { _id: '2', email: 'fakes@email.com', userName: 'fake', password: 'fake', status: 'user' };
        const id = 'testId';

        service.getUserById(id).subscribe(user => {
            expect(user).toEqual(dummyUser);
        });

        const req = httpMock.expectOne(`${service.apiUrl}/${id}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyUser); // Respond with dummy user
    });

    it('should create a user', () => {
        const dummyUser: User = { _id: '2', email: 'fakes@email.com', userName: 'fake', password: 'fake', status: 'user' };

        service.createUser(dummyUser).subscribe(user => {
            expect(user).toEqual(dummyUser);
        });

        const req = httpMock.expectOne(service.apiUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dummyUser);
        req.flush(dummyUser);
    });

    it('should delete a user', () => {
        const id = 'testId';

        service.deleteUser(id).subscribe(res => {
            expect(res).toEqual({});
        });

        const req = httpMock.expectOne(`${service.apiUrl}/${id}`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('should update a user\'s role', () => {
        const id = 'testId';
        const status = 'user';

        service.updateUserRole(id, status).subscribe(res => {
            expect(res).toEqual({});
        });

        const req = httpMock.expectOne(`${service.apiUrl}/updateRole/${id}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ status });
        req.flush({});
    });

    it('should retrieve users by group ID', () => {
        const dummyUsers: User[] = [
            { _id: '1', email: 'fake@email.com', userName: 'fake', password: 'fake', status: 'user' },
            // Add more dummy users if needed
        ];
        const groupId = 'testGroupId';

        service.getUsersByGroupId(groupId).subscribe(users => {
            expect(users.length).toBe(dummyUsers.length);
            expect(users).toEqual(dummyUsers);
        });

        const req = httpMock.expectOne(`${service.apiUrl}/byGroup/${groupId}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyUsers);
    });

    it('should retrieve a user by email', () => {
        const dummyUser: User = { _id: '2', email: 'fakes@email.com', userName: 'fake', password: 'fake', status: 'user' };
        const email = 'fakes@email.com';

        service.getUserByEmail(email).subscribe(user => {
            expect(user).toEqual(dummyUser);
        });

        const req = httpMock.expectOne(`${service.apiUrl}/byEmail/${email}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyUser);
    });

    it('should add a user to a group', () => {
        const email = 'fake@email.com';
        const groupId = 'testGroupId';
        const postData = { email, groupId };

        service.addUserToGroup(email, groupId).subscribe(data => {
            expect(data).toEqual(postData);
        });

        const req = httpMock.expectOne(`${service.apiUrl}/addToGroup`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(postData);
        req.flush(postData);
    });

    it('should retrieve users by channel ID', () => {
        const dummyUsers: User[] = [
            { _id: '1', email: 'fake@email.com', userName: 'fake', password: 'fake', status: 'user' },
            // Add more dummy users if needed
        ];
        const channelId = 'testChannelId';

        service.getUsersByChannelId(channelId).subscribe(users => {
            expect(users.length).toBe(dummyUsers.length);
            expect(users).toEqual(dummyUsers);
        });

        const req = httpMock.expectOne(`${service.apiUrl}/byChannel/${channelId}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyUsers);
    });

    it('should add a user to a channel', () => {
        const userId = '1';
        const channelId = 'testChannelId';
        const postData = { userId, channelId };

        service.addUserToChannel(userId, channelId).subscribe(data => {
            expect(data).toEqual(postData);
        });

        const req = httpMock.expectOne(`${service.apiUrl}/addToChannel`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(postData);
        req.flush(postData);
    });

    it('should remove a user from a channel', () => {
        const userId = '1';
        const channelId = 'testChannelId';

        service.removeUserFromChannel(userId, channelId).subscribe(data => {
            expect(data).toEqual({ userId, channelId }); // Adjust based on actual response structure
        });

        const req = httpMock.expectOne(`${service.apiUrl}/removeFromChannel/${userId}/${channelId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush({ userId, channelId }); // Respond with data (adjust based on actual response structure)
    });

    it('should remove a user from a group', () => {
        const userId = 'testUserId';
        const groupId = 'testGroupId';
      
        service.removeUserFromGroup(userId, groupId).subscribe(res => {
          expect(res).toEqual({});
        });
      
        const req = httpMock.expectOne(`${service.apiUrl}/removeFromGroup/${userId}/${groupId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
      });
      
      it('should get a user\'s role in a group', () => {
        const userId = 'testUserId';
        const groupId = 'testGroupId';
        const dummyRole: Role = { _id: '1', roleName: 'testRoleName'};
      
        service.getUserRole(groupId, userId).subscribe(role => {
          expect(role).toEqual(dummyRole);
        });
      
        const req = httpMock.expectOne(`${service.apiUrl}/getRoleInGroup/${groupId}/${userId}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyRole);
      });
      
      it('should update a user\'s role in a group', () => {
        const userId = 'testUserId';
        const groupId = 'testGroupId';
        const roleName = 'testRoleName';
      
        service.updateUserRoleInGroup(userId, groupId, roleName).subscribe(res => {
          expect(res).toEqual({});
        });
      
        const req = httpMock.expectOne(`${service.apiUrl}/updateRoleInGroup`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ userId, groupId, roleName });
        req.flush({});
      });
      
});
