const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const request = require('supertest');
const express = require('express');
const Message = require('../../models/Message');
const io = require('socket.io');
const messageRouter = require('../../API/message')(io);

const expect = chai.expect;
const app = express();

app.use(express.json());
app.use('/api/message', messageRouter);

describe('Message API', () => {
    describe('POST /', () => {
        it('should create a new message and return success message', (done) => {
            const newMessageData = {
                message: 'Test message',
                userId: new mongoose.Types.ObjectId(),
                channelId: new mongoose.Types.ObjectId(),
            };
            
            sinon.stub(Message.prototype, 'save').resolves();

            request(app)
                .post('/api/message')
                .send(newMessageData)
                .expect(201)
                .end((err, res) => {
                    expect(res.body).to.equal('Successfully posted');
                    Message.prototype.save.restore();
                    done(err);
                });
        });

        it('should return 500 if there is an error saving the message', (done) => {
            const newMessageData = {
                message: 'Test message',
                userId: new mongoose.Types.ObjectId(),
                channelId: new mongoose.Types.ObjectId(),
            };
            
            sinon.stub(Message.prototype, 'save').rejects(new Error('Database error'));

            request(app)
                .post('/api/message')
                .send(newMessageData)
                .expect(500)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Failed to post message.');
                    Message.prototype.save.restore();
                    done(err);
                });
        });
    });
    describe('GET /byChannel/:channelId', () => {
    
        it('should return 500 if there is an error fetching messages', (done) => {
            const channelId = new mongoose.Types.ObjectId();
    
            sinon.stub(Message, 'find').rejects(new Error('Database error'));
    
            request(app)
                .get(`/api/message/byChannel/${channelId}`)
                .expect(500)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Failed to get messages.');
                    Message.find.restore();
                    done(err);
                });
        });
    });
    describe('GET /byChannel/:channelId', () => {
    
        it('should return 500 if there is an error fetching messages', (done) => {
            const channelId = new mongoose.Types.ObjectId();
    
            sinon.stub(Message, 'find').rejects(new Error('Database error'));
    
            request(app)
                .get(`/api/message/byChannel/${channelId}`)
                .expect(500)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Failed to get messages.');
                    Message.find.restore();
                    done(err);
                });
        });
    });
    

});
