const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;

const app = express();
const authRouter = require('../../API/auth');
const User = require('../../models/User');

app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes Integration Tests', () => {
    before(async () => {
        // Connect to a test database before running any tests.
        await mongoose.connect('mongodb://localhost:27017/test-db', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        // Close database connection after all tests.
        await mongoose.connection.close();
    });

    describe('POST /login', () => {
        it('should return user data and valid true if credentials are correct', async () => {
            // Create a user in the database
            const user = new User({ email: 'test@example.com', password: 'password123', status: 'user' });
            await user.save();

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('valid', true);
            expect(response.body).to.have.property('user');
        });
    });

    describe('POST /register', () => {
        it('should create a new user and return user data if email is not already registered', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'Hectors',
                    email: 'nokures@gmail.com',
                    password: 'password'
                });

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('valid', true);
            expect(response.body).to.have.property('user');
        });
    });
});
