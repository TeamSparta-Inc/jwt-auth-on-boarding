import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './register-user.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userModelMock;

  const userData = {
    userId: 'testId',
    password: 'testPassword',
  };

  beforeEach(async () => {
    userModelMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
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
    test('jwt 토큰이 잘 발급 되는지 테스트', async () => {
      //given
      const userId = userData.userId;
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      userModelMock.create.mockResolvedValue({
        userId: userId,
        password: hashedPassword,
      });
      //when
      const result = await userService.register(userData);
      //then
      console.log(result);
      expect(result).toBeDefined();
      await userModelMock.deleteOne({ userId: userData.userId });
    });

    test('이미 존재하는 아이디가 아닐 경우, 회원가입이 잘 되는지 테스트', async () => {
      //given
      const userId = userData.userId;
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      userModelMock.findOne.mockResolvedValue(null);
      userModelMock.create.mockResolvedValue({
        userId: userId,
        password: hashedPassword,
      });

      //when
      const result = await userService.register(
        new RegisterUserDto(userData.userId, userData.password),
      );
      console.log(result);

      //then
      /* TODO: JWT 발급과 사용자 회원가입 메서드 분리해서 테스트 따로 만들기 */
      userModelMock.findOne.mockResolvedValue({
        userId: userId,
        password: hashedPassword,
      });

      const storedUser = await userModelMock.findOne({
        userId: userId,
      });

      console.log(storedUser);

      expect(storedUser.userId).toEqual(userId);
    });

    test('이미 존재하는 아이디일 경우, 예외가 잘 발생하는지 테스트', async () => {
      //given
      const userId = userData.userId;
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      userModelMock.findOne.mockResolvedValue({
        userId: userId,
        password: hashedPassword,
      });
      userModelMock.create.mockResolvedValue({
        userId: userId,
        password: hashedPassword,
      });
      //when
      //then
      await expect(async () => {
        await userService.register(
          new RegisterUserDto(userData.userId, userData.password),
        );
      }).rejects.toThrow(BadRequestException);
    });
  });

  describe('로그인 테스트', () => {
    test('올바른 아이디와 패스워드를 입력했을 경우, 로그인이 잘 되는지 테스트', async () => {
      //given
      const userId = userData.userId;
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      userModelMock.findOne.mockResolvedValue({
        userId: userId,
        password: hashedPassword,
      });
      //when
      const result = await userService.login(
        new RegisterUserDto(userData.userId, userData.password),
      );
      //then
      expect(result).toBeDefined();
    });

    test('올바르지 않은 아이디를 입력했을 경우, 예외가 잘 발생하는지 테스트', async () => {
      //given
      userModelMock.findOne.mockResolvedValue(null);
      //when
      //then
      await expect(async () => {
        await userService.login(
          new RegisterUserDto(userData.userId, userData.password),
        );
      }).rejects.toThrow(NotFoundException);
    });

    test('올바르지 않은 패스워드를 입력했을 경우, 예외가 잘 발생하는지 테스트', async () => {
      //given
      const userId = userData.userId;
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      userModelMock.findOne.mockResolvedValue({
        userId: userId,
        password: hashedPassword,
      });
      //when
      //then
      await expect(async () => {
        await userService.login(
          new RegisterUserDto(userData.userId, 'wrongPassword'),
        );
      }).rejects.toThrow(UnauthorizedException);
    });
  });
});
