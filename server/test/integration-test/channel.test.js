const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;

const app = express();
const channelRouter = require('../../API/channel');  // Adjust the path to your channel router file
const Channel = require('../../models/Channel');  // Adjust the path to your Channel model file

app.use(express.json());
app.use('/api/channel', channelRouter);

describe('Channel Routes Integration Tests', () => {
    before(async () => {
        // Connect to a test database before running any tests.
        await mongoose.connect('mongodb://localhost:27017/test-db', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        // Close database connection after all tests.
        await mongoose.connection.close();
    });

    describe('GET /', () => {
        it('should return all channels', async () => {
            // Create a few channels in the database
            const channel1 = new Channel({ channelName: 'Channel 1' });
            const channel2 = new Channel({ channelName: 'Channel 2' });
            await channel1.save();
            await channel2.save();

            const response = await request(app)
                .get('/api/channel');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(11);
        });
    });

    describe('GET /:id', () => {
        it('should return a channel by ID', async () => {
            // Create a channel in the database
            const channel = new Channel({ channelName: 'Test Channel' });
            await channel.save();

            const response = await request(app)
                .get(`/api/channel/${channel._id}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('channelName', 'Test Channel');
        });
    });
});
