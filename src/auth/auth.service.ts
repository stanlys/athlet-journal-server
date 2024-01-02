import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './schema/createUser.schema';
import { Model } from 'mongoose';
import { UserResponseType } from './type/userResponse.type';
import { LoginDTO } from './dto/login.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}

  async getAll(): Promise<any> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async deleteUser(loginDto: LoginDTO): Promise<boolean> {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new HttpException(
        ' Email is already exist ',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.userModel.deleteOne({ email: loginDto.email });
    return true;
  }

  async createUser(createUserDto: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new HttpException(
        ' Email is already exist ',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async loginUser(loginDto: LoginDTO): Promise<UserEntity> {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password');
    if (!user)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);

    const isPasswordCorrect = await compare(loginDto.password, user.password);

    if (!isPasswordCorrect)
      throw new HttpException('Error in password', HttpStatus.UNAUTHORIZED);

    return user;
  }

  buildUserResponse(userEntity: UserEntity): UserResponseType {
    return {
      userName: userEntity.userName,
      email: userEntity.email,
    };
  }
}
