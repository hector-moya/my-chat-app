import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChannelService } from './channel.service';
import { Channel } from '../interfaces/channel.model';
import { Observable } from 'rxjs';

describe('ChannelService', () => {
    let service: ChannelService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ChannelService]
        });
        service = TestBed.inject(ChannelService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve all channels', () => {
        const mockChannels: Channel[] = [
            { _id: '1', channelName: 'Channel 1' },
            { _id: '2', channelName: 'Channel 2' },
            { _id: '3', channelName: 'Channel 3' }
        ];

        service.getAllChannels().subscribe((channels: Channel[]) => {
            expect(channels.length).toBe(3);
            expect(channels).toEqual(mockChannels);
        });

        const request = httpMock.expectOne(`${service.apiUrl}`);
        expect(request.request.method).toBe('GET');
        request.flush(mockChannels);
    });

    it('should return an Observable of Channel[]', () => {
        const channels$: Observable<Channel[]> = service.getAllChannels();
        expect(channels$ instanceof Observable).toBeTruthy();
    });

    it('should retrieve channels by group ID', () => {
        const mockChannels: Channel[] = [
            { _id: '1', channelName: 'Channel 1'},
            { _id: '2', channelName: 'Channel 2'},
            { _id: '3', channelName: 'Channel 3'}
        ];
        const groupId = '1';

        service.getChannelsByGroupId(groupId).subscribe((channels: Channel[]) => {
            expect(channels.length).toBe(3);
            expect(channels).toEqual(mockChannels);
        });

        const request = httpMock.expectOne(`${service.apiUrl}/byGroup/${groupId}`);
        expect(request.request.method).toBe('GET');
        request.flush(mockChannels);
    });

    it('should retrieve a channel by ID', () => {
        const mockChannel: Channel = { _id: '1', channelName: 'Channel 1'};
        const channelId = '1';

        service.getChannelById(channelId).subscribe((channel: Channel) => {
            expect(channel).toEqual(mockChannel);
        });

        const request = httpMock.expectOne(`${service.apiUrl}/${channelId}`);
        expect(request.request.method).toBe('GET');
        request.flush(mockChannel);
    });

    it('should add a new channel', () => {
        const mockChannel: Channel = { _id: '1', channelName: 'Channel 1'};
        const groupId = '1';

        service.addChannel(mockChannel, groupId).subscribe((channel: Channel) => {
            expect(channel).toEqual(mockChannel);
        });

        const request = httpMock.expectOne(`${service.apiUrl}/${groupId}`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(mockChannel);
        request.flush(mockChannel);
    });

    it('should update an existing channel', () => {
        const mockChannel: Channel = { _id: '1', channelName: 'Channel 1'};

        service.updateChannel(mockChannel).subscribe((channel: Channel) => {
            expect(channel).toEqual(mockChannel);
        });

        const request = httpMock.expectOne(`${service.apiUrl}/${mockChannel._id}`);
        expect(request.request.method).toBe('PUT');
        expect(request.request.body).toEqual(mockChannel);
        request.flush(mockChannel);
    });

    it('should delete a channel by ID', () => {
        const channelId = '1';

        service.deleteChannel(channelId).subscribe(() => {
            expect().nothing();
        });

        const request = httpMock.expectOne(`${service.apiUrl}/${channelId}`);
        expect(request.request.method).toBe('DELETE');
        request.flush(null);
    });

});