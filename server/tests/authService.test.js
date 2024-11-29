import AuthService from '../services/authService.js';
import organizerDb from '../models/organizerModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

jest.mock('../models/organizerModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');  

describe('AuthService', () => {

  describe('createOrganizer', () => {
    it('should create an organizer with a hashed password', async () => {
      const organizerData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        email: 'johndoe@example.com',
        password: 'password123'
      };

      bcrypt.hash.mockResolvedValue('hashedpassword');
      const saveMock = jest.fn().mockResolvedValue({
        ...organizerData,
        password: 'hashedpassword'
      });
      organizerDb.mockImplementation(() => ({
        save: saveMock
      }));

      const result = await AuthService.createOrganizer(organizerData);

      expect(bcrypt.hash).toHaveBeenCalledWith(organizerData.password, 10);
      expect(saveMock).toHaveBeenCalled();
      expect(result.password).toBe('hashedpassword');
    });
  });

  describe('login', () => {
    it('should return a JWT token if credentials are correct', async () => {
      const email = 'johndoe@example.com';
      const password = 'password123';

      const mockOrganizer = {
        _id: 'organizer123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        email: email,
        password: 'hashedpassword123'
      };

      organizerDb.findOne.mockResolvedValue(mockOrganizer);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocked-jwt-token');

      const result = await AuthService.login(email, password);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockOrganizer.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockOrganizer._id, firstName: mockOrganizer.firstName, lastName: mockOrganizer.lastName, phone: mockOrganizer.phone },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      expect(result.token).toBe('mocked-jwt-token');
    });

    it('should throw an error if the organizer is not found', async () => {
      const email = 'johndoe@example.com';
      const password = 'password123';

      organizerDb.findOne.mockResolvedValue(null);

      await expect(AuthService.login(email, password)).rejects.toThrow('Authentication Failed !');
    });

    it('should throw an error if the password is incorrect', async () => {
        const email = 'johndoe@example.com';
        const password = 'password123';
      
        const mockOrganizer = {
          _id: 'organizer123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          email: email,
          password: 'hashedpassword123'
        };
      
        organizerDb.findOne.mockResolvedValue(mockOrganizer);
        bcrypt.compare.mockResolvedValue(false);
      
        await expect(AuthService.login(email, password)).rejects.toThrow('Authentication Failed !');
      });
  });
});
