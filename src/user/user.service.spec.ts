import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let userModelMock;

  const userData = {
    id: 'testId',
    password: 'testPassword',
  };

  beforeEach(async () => {
    userModelMock = {
      create: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'), // Use the actual name of your User model
          useValue: userModelMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('회원 가입 테스트', () => {
    it('jwt 토큰이 잘 발급 되는지 테스트', async () => {
      // given
      userModelMock.create.mockResolvedValue(userData);
      // when
      const result = await userService.registerUser(userData);
      // then
      console.log(result);
      expect(result).not.toBeNull();
    });

    it('회원가입한 사용자 정보가 잘 저장되는지 테스트', async () => {
      // given
      const id = userData.id;
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      userModelMock.create.mockResolvedValue({
        id,
        password: hashedPassword,
      });

      userModelMock.findOne.mockResolvedValue({
        id,
        password: hashedPassword,
      });

      // when
      const result = await userService.registerUser(userData);
      console.log(result);

      // then
      const storedUser = await userModelMock.findOne({ id: userData.id });

      expect(storedUser.id).toEqual(userData.id);
    });
  });
});
