import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { User, loginCredentials } from '../interfaces/user.model';

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthenticationService]
        });
        service = TestBed.inject(AuthenticationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.removeItem('currentUser');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('should log in the user and set isLoggedIn to true if the credentials are valid', () => {
            const credentials = { email: 'fake@email.com', password: 'testpassword' };
            const response = { valid: true, user: { id: 1, username: 'testuser' } };

            service.login(credentials).subscribe(() => {
                expect(localStorage.getItem('currentUser')).toEqual(JSON.stringify(response.user));
                expect(service.isLoggedIn).toBeTrue();
            });

            const req = httpMock.expectOne(`${service.apiUrl}/auth/login`);
            expect(req.request.method).toBe('POST');
            req.flush(response);
        });

        it('should not log in the user and set isLoggedIn to false if the credentials are invalid', () => {
            const credentials = { email: 'fake@email.com', password: 'wrongpassword' };
            const response = { valid: false };

            service.login(credentials).subscribe(() => {
                expect(localStorage.getItem('currentUser')).toBeNull();
                expect(service.isLoggedIn).toBeFalse();
            });

            const req = httpMock.expectOne(`${service.apiUrl}/auth/login`);
            expect(req.request.method).toBe('POST');
            req.flush(response);
        });
    });

    describe('logout', () => {
        it('should remove the currentUser from localStorage', () => {
            // Arrange
            localStorage.setItem('currentUser', 'testuser');

            // Act
            service.logout();

            // Assert
            expect(localStorage.getItem('currentUser')).toBeNull();
        });

        it('should set isLoggedIn to false', () => {
            // Arrange
            service.isLoggedIn = true;

            // Act
            service.logout();

            // Assert
            expect(service.isLoggedIn).toBeFalse();
        });

        it('should log a message to the console', () => {
            // Arrange
            spyOn(console, 'log');

            // Act
            service.logout();

            // Assert
            expect(console.log).toHaveBeenCalledWith('User logged out successfully');
        });
    });
});