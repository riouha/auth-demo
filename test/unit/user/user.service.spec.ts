import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/modules/user/services/user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/modules/user/entities/user.entity';
import { createMockRepository, MockRepository } from '../../utils/create-mock-repository';
import { ConfigService } from '@nestjs/config';
//===============================================================================================

describe('User Service', () => {
  let service: UserService;
  let userRepo: MockRepository<User>;
  const fakeConfigService = {
    get: jest.fn().mockReturnValue('env-value'),
  };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: createMockRepository<User>() },
        { provide: ConfigService, useValue: fakeConfigService },
      ],
    }).compile();

    service = app.get<UserService>(UserService);
    userRepo = app.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user', () => {
    it('should have createUser method', () => {
      expect(typeof service.createUser).toBe('function');
    });
    it('should throw 409 error if mobile is duplicate', () => {
      userRepo.findOne.mockResolvedValueOnce(new User());
      expect(service.createUser({ mobile: '' })).rejects.toThrow(ConflictException);
    });
    it('should create user and hash user password if password is provided', async () => {
      userRepo.save.mockImplementationOnce((user: User) => {
        user.id = 1;
        return user;
      });
      const user = await service.createUser({ mobile: '', password: 'test123' });
      expect(user.password).not.toEqual('test123');
      expect(user.id).toBeDefined();
    });
  });

  describe('edit user', () => {
    it('should have editProfile method', () => {
      expect(typeof service.editProfile).toBe('function');
    });
    it('should throw 404 error if user with given id does not exist', () => {
      userRepo.findOne.mockResolvedValueOnce(undefined);
      expect(service.editProfile(1, {})).rejects.toThrow(NotFoundException);
    });
    it('should edit user', async () => {
      const fakeUser = new User();
      fakeUser.id = 1;
      fakeUser.name = 'ali';
      userRepo.findOne.mockResolvedValueOnce(fakeUser);
      userRepo.save.mockImplementationOnce((user: User) => {
        return user;
      });
      const user = await service.editProfile(1, { name: 'karim' });
      expect(user.name).toBe('karim');
    });
  });
});
