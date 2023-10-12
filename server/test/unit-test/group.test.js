const request = require('supertest');
const express = require('express');
const sinon = require('sinon');
const chai = require('chai');
const mongoose = require('mongoose');

const expect = chai.expect;

const app = express();
const groupRouter = require('../../API/group');
const Group = require('../../models/Group');
const UserGroup = require('../../models/UserGroup');
const Role = require('../../models/Role');
const UserChannel = require('../../models/UserChannel');
const Channel = require('../../models/Channel');

app.use(express.json());
app.use('/api/group', groupRouter);

describe('Group Routes', () => {

    describe('GET /', () => {
        it('should return all groups', (done) => {
            const mockGroups = [
                { name: 'Group 1' },
                { name: 'Group 2' },
            ];
            sinon.stub(Group, 'find').resolves(mockGroups);

            request(app)
                .get('/api/group')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(2);
                    Group.find.restore();
                    done(err);
                });
        });

        it('should return 404 if no groups found', (done) => {
            sinon.stub(Group, 'find').resolves([]);

            request(app)
                .get('/api/group')
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'No groups found');
                    Group.find.restore();
                    done(err);
                });
        });
    });
    describe('GET /byUser/:userId', () => {
        it('should return all groups for a user', (done) => {
            const userId = new mongoose.Types.ObjectId();
            const mockUserGroups = [{ groupId: new mongoose.Types.ObjectId() }];
            const mockGroups = [{ name: 'Group 1' }];

            sinon.stub(UserGroup, 'find').resolves(mockUserGroups);
            sinon.stub(Group, 'find').resolves(mockGroups);

            request(app)
                .get(`/api/group/byUser/${userId}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(1);
                    UserGroup.find.restore();
                    Group.find.restore();
                    done(err);
                });
        });

        it('should return 404 if no groups found for the user', (done) => {
            const userId = new mongoose.Types.ObjectId();

            sinon.stub(UserGroup, 'find').resolves([]);
            request(app)
                .get(`/api/group/byUser/${userId}`)
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'No groups found for this user');
                    UserGroup.find.restore();
                    done(err);
                });
        });
    });

    describe('GET /userRole/:groupId/:userId', () => {
        it('should return the role name for a valid group and user ID', (done) => {
            const mockUserGroup = {
                groupId: new mongoose.Types.ObjectId(),
                userId: new mongoose.Types.ObjectId(),
                roleId: new mongoose.Types.ObjectId()
            };
            const mockRole = { _id: mockUserGroup.roleId, roleName: 'user' };
    
            sinon.stub(UserGroup, 'findOne').resolves(mockUserGroup);
            sinon.stub(Role, 'findById').resolves(mockRole);
    
            request(app)
                .get(`/api/group/userRole/${mockUserGroup.groupId}/${mockUserGroup.userId}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.equal('user');
                    UserGroup.findOne.restore();
                    Role.findById.restore();
                    done(err);
                });
        });
    });

    describe('POST /', () => {
        it('should create a new group and return it', (done) => {
            const newGroupData = { groupName: 'Test Group' };
            const userId = new mongoose.Types.ObjectId();
            const mockRole = { _id: new mongoose.Types.ObjectId(), roleName: 'admin' };
    
            sinon.stub(Group.prototype, 'save').resolves(newGroupData);
            sinon.stub(Role, 'findOne').resolves(mockRole);
            sinon.stub(UserGroup.prototype, 'save').resolves();
    
            request(app)
                .post('/api/group/')
                .send({ group: newGroupData, userId })
                .expect(201)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('groupName', newGroupData.groupName);
                    Group.prototype.save.restore();
                    Role.findOne.restore();
                    UserGroup.prototype.save.restore();
                    done(err);
                });
        });
    
        it('should return 500 on server error', (done) => {
            const newGroupData = { groupName: 'Test Group' };
            const userId = new mongoose.Types.ObjectId();
    
            sinon.stub(Group.prototype, 'save').rejects(new Error('Test Error'));
    
            request(app)
                .post('/api/group/')
                .send({ group: newGroupData, userId })
                .expect(500)
                .end((err, res) => {
                    expect(res.body).to.have.property('message', 'Failed to add group.');
                    Group.prototype.save.restore();
                    done(err);
                });
        });
    });
    describe('PUT /:id', () => {
        it('should update a group and return it', (done) => {
            const groupId = new mongoose.Types.ObjectId();
            const updatedData = { groupName: 'Updated Group Name' };
    
            const mockUpdatedGroup = { ...updatedData, _id: groupId };
    
            sinon.stub(Group, 'findByIdAndUpdate').resolves(mockUpdatedGroup);
    
            request(app)
                .put(`/api/group/${groupId}`)
                .send(updatedData)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('groupName', updatedData.groupName);
                    Group.findByIdAndUpdate.restore();
                    done(err);
                });
        });
    
        it('should return 404 for non-existent group id', (done) => {
            const groupId = new mongoose.Types.ObjectId();
            const updatedData = { groupName: 'Updated Group Name' };
    
            sinon.stub(Group, 'findByIdAndUpdate').resolves(null);
    
            request(app)
                .put(`/api/group/${groupId}`)
                .send(updatedData)
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Group not found');
                    Group.findByIdAndUpdate.restore();
                    done(err);
                });
        });
    });
    describe('DELETE /:id', () => {
        it('should delete a group and return success message', (done) => {
            const groupId = new mongoose.Types.ObjectId();
    
            sinon.stub(Group, 'findByIdAndDelete').resolves({ _id: groupId });
            sinon.stub(UserGroup, 'deleteMany').resolves({ n: 2 });
            sinon.stub(UserChannel, 'deleteMany').resolves({ n: 2 });
            sinon.stub(Channel, 'deleteMany').resolves({ n: 2 });
    
            request(app)
                .delete(`/api/group/${groupId}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Group and related data deleted successfully.');
                    Group.findByIdAndDelete.restore();
                    UserGroup.deleteMany.restore();
                    UserChannel.deleteMany.restore();
                    Channel.deleteMany.restore();
                    done(err);
                });
        });
    
        it('should return 404 for non-existent group id', (done) => {
            const groupId = new mongoose.Types.ObjectId();
    
            sinon.stub(Group, 'findByIdAndDelete').resolves(null);
    
            request(app)
                .delete(`/api/group/${groupId}`)
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Group not found');
                    Group.findByIdAndDelete.restore();
                    done(err);
                });
        });
    });
    
    
    
    
});