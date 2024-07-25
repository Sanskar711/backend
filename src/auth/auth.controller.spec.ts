import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'your_jwt_secret',
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const result: User = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        email: 'testuser@example.com',
      };
      jest.spyOn(userService, 'create').mockImplementation(async () => result);

      expect(await authController.register({
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com',
      })).toBe(result);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { userId: 1, username: 'testuser' };
      jest.spyOn(authService, 'validateUser').mockImplementation(async () => user);
      jest.spyOn(authService, 'login').mockImplementation(async () => ({ access_token: 'test_token' }));

      expect(await authController.login({ user })).toEqual({ access_token: 'test_token' });
    });
  });
});
