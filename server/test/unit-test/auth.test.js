const request = require('supertest');
const express = require('express');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const app = express();
const authRouter = require('../../API/auth');
const User = require('../../models/User');

app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /login', () => {
    it('should return user data and valid true if credentials are correct', async () => {
      const userStub = {
        email: 'test@example.com',
        password: 'password123',
        status: 'active',
        toObject: () => this
      };

      sinon.stub(User, 'findOne').resolves(userStub);

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
      sinon.stub(User, 'findOne').resolves(null);
      const userSaveStub = sinon.stub(User.prototype, 'save').resolves();
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('valid', true);
      expect(response.body).to.have.property('user');
    });

  });
});
