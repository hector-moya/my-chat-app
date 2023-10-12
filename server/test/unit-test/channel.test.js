const request = require('supertest');
const express = require('express');
const sinon = require('sinon');
const chai = require('chai');
const mongoose = require('mongoose');

const expect = chai.expect;

const app = express();
const channelRouter = require('../../API/channel');
const Channel = require('../../models/Channel');
const UserChannel = require('../../models/UserChannel');

app.use(express.json());
app.use('/api/channel', channelRouter);

describe('Channel Routes', () => {
    // GET all channels route
    describe('GET /', () => {
        it('should return all channels', (done) => {
            sinon.stub(Channel, 'find');
            Channel.find.returns(Promise.resolve([{ _id: new mongoose.Types.ObjectId(), channelName: 'Channel 1' }]));

            request(app)
                .get('/api/channel')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.have.property('channelName', 'Channel 1');
                    Channel.find.restore();
                    done(err);
                });
        });

        it('should return 404 if no channels found', (done) => {
            sinon.stub(Channel, 'find');
            Channel.find.returns(Promise.resolve([]));

            request(app)
                .get('/api/channel')
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.have.property('message', 'No channels found');
                    Channel.find.restore();
                    done(err);
                });
        });
    });

    describe('GET /:id', () => {
        afterEach(() => {
            // Restore the default sandbox here
            sinon.restore();
        });
    
        it('should return a channel if found', (done) => {
            const mockChannel = {
                _id: new mongoose.Types.ObjectId(),
                channelName: 'Test Channel',
                // ...other properties
            };
            sinon.stub(Channel, 'findById').resolves(mockChannel);
    
            request(app)
                .get(`/api/channel/${mockChannel._id}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('channelName', mockChannel.channelName);
                    done(err);
                });
        });
    
        it('should return 404 if channel not found', (done) => {
            sinon.stub(Channel, 'findById').resolves(null);
    
            request(app)
                .get(`/api/channel/${new mongoose.Types.ObjectId()}`)
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.have.property('message', 'Channel not found');
                    done(err);
                });
        });
    
        it('should return 500 if there is a server error', (done) => {
            sinon.stub(Channel, 'findById').rejects(new Error('Internal Server Error'));
    
            request(app)
                .get(`/api/channel/${new mongoose.Types.ObjectId()}`)
                .expect(500)
                .end((err, res) => {
                    expect(res.body).to.have.property('message', 'Internal Server Error');
                    done(err);
                });
        });
    });

    describe('GET /byGroup/:id', () => {
        afterEach(() => {
            // Restore the default sandbox here
            sinon.restore();
        });
    
        it('should return 404 if no channels found for the group', (done) => {
            const groupId = new mongoose.Types.ObjectId();
            sinon.stub(Channel, 'find').resolves([]);
    
            request(app)
                .get(`/api/channel/byGroup/${groupId}`)
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.have.property('message', 'No channels found');
                    done(err);
                });
        });
    
        it('should return 500 if there is a server error', (done) => {
            const groupId = new mongoose.Types.ObjectId();
            sinon.stub(Channel, 'find').rejects(new Error('Internal Server Error'));
    
            request(app)
                .get(`/api/channel/byGroup/${groupId}`)
                .expect(500)
                .end((err, res) => {
                    expect(res.body).to.have.property('message', 'Internal Server Error');
                    done(err);
                });
        });
    });
    describe('GET /byUser/:groupId/:userId', () => {
        afterEach(() => {
            // Restore the default sandbox here
            sinon.restore();
        });
    
        it('should return 404 if no channels found for the user in the specified group', (done) => {
            const groupId = new mongoose.Types.ObjectId();
            const userId = new mongoose.Types.ObjectId();
            
            sinon.stub(UserChannel, 'find').resolves([]);
            sinon.stub(Channel, 'find').resolves([]);
    
            request(app)
                .get(`/api/channel/byUser/${groupId}/${userId}`)
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.have.property('message', 'No channels found for this user');
                    done(err);
                });
        });
    
        it('should return 500 if there is a server error', (done) => {
            const groupId = new mongoose.Types.ObjectId();
            const userId = new mongoose.Types.ObjectId();
            
            sinon.stub(UserChannel, 'find').rejects(new Error('Internal Server Error'));
    
            request(app)
                .get(`/api/channel/byUser/${groupId}/${userId}`)
                .expect(500)
                .end((err, res) => {
                    expect(res.body).to.have.property('message', 'Internal Server Error');
                    done(err);
                });
        });
    });

    describe('POST /:groupId', () => {
        afterEach(() => {
            // Restore the default sandbox here
            sinon.restore();
        });
    
        it('should return 500 if there is a server error', (done) => {
            const groupId = new mongoose.Types.ObjectId();
            const newChannelData = { channelName: 'Test Channel' };
    
            sinon.stub(Channel, 'create').rejects(new Error('Internal Server Error'));
    
            request(app)
                .post(`/api/channel/${groupId}`)
                .send(newChannelData)
                .expect(500)
                .end((err, res) => {
                    expect(res.body).to.have.property('message', 'Failed to add channel.');
                    done(err);
                });
        });
    });

    describe('PUT /:id', () => {
        afterEach(() => {
          sinon.restore();
        });
      
        it('should update a channel and return it', (done) => {
          const channelId = new mongoose.Types.ObjectId();
          const updateData = { channelName: 'Updated Channel Name' };
          const mockUpdatedChannel = {
            ...updateData,
            _id: channelId,
          };
      
          sinon.stub(Channel, 'findByIdAndUpdate').resolves(mockUpdatedChannel);
      
          request(app)
            .put(`/api/channel/${channelId}`)
            .send(updateData)
            .expect(200)
            .end((err, res) => {
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('channelName', updateData.channelName);
              done(err);
            });
        });
      
        it('should return 404 if channel is not found', (done) => {
          const channelId = new mongoose.Types.ObjectId();
          const updateData = { channelName: 'Updated Channel Name' };
      
          sinon.stub(Channel, 'findByIdAndUpdate').resolves(null);
      
          request(app)
            .put(`/api/channel/${channelId}`)
            .send(updateData)
            .expect(404)
            .end((err, res) => {
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message', 'Channel not found');
              done(err);
            });
        });
      });
      describe('DELETE /:id', () => {
        afterEach(() => {
          sinon.restore();
        });
      
        it('should delete a channel and return a success message', (done) => {
          const channelId = new mongoose.Types.ObjectId();
          const mockDeletedChannel = { _id: channelId };
      
          sinon.stub(Channel, 'findByIdAndRemove').resolves(mockDeletedChannel);
      
          request(app)
            .delete(`/api/channel/${channelId}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message', 'Channel deleted successfully.');
              done(err);
            });
        });
      
        it('should return 404 if channel is not found', (done) => {
          const channelId = new mongoose.Types.ObjectId();
      
          sinon.stub(Channel, 'findByIdAndRemove').resolves(null);
      
          request(app)
            .delete(`/api/channel/${channelId}`)
            .expect(404)
            .end((err, res) => {
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message', 'Channel not found');
              done(err);
            });
        });
      });   
    
});