import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './schema/createUser.schema';
import { Model } from 'mongoose';
import { UserResponseType } from './type/userResponse.type';
import { LoginDTO } from './dto/login.dto';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { TOKEN_KEY } from './jwt.token';
import { AdditionalUserInfoEntity } from './schema/additionalUserInfo.schema';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    @InjectModel(AdditionalUserInfoEntity.name)
    private additionalUserInfoModel: Model<AdditionalUserInfoEntity>,
  ) {}

  async getAll(): Promise<any> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async deleteUser(loginDto: LoginDTO): Promise<boolean> {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password');
    if (!user) {
      throw new HttpException(
        ' User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordCorrect = await compare(loginDto.password, user.password);
    if (isPasswordCorrect) {
      await this.userModel.deleteOne({ email: loginDto.email });
      return true;
    } else
      throw new HttpException('Password Uncorrect', HttpStatus.UNAUTHORIZED);
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

  async getAllUserInfo(): Promise<any> {
    return this.additionalUserInfoModel.find().exec();
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
      token: this.generateToken(userEntity),
    };
  }

  generateToken(userEntity: UserEntity): string {
    const token = sign(
      { email: userEntity.email, userName: userEntity.userName },
      TOKEN_KEY,
      { expiresIn: '12h' },
    );
    return token;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = this.userModel.findOne({ email: email });
    return user;
  }

  async updateUserInfo(
    user: UserEntity,
    updateUserDto: UpdateUserDTO,
  ): Promise<AdditionalUserInfoEntity> {
    const _user = await this.additionalUserInfoModel.findOne({ user: user });
    console.warn(_user);
    if (_user) {
      const a = await this.additionalUserInfoModel.updateOne(
        { user: user },
        {
          $set: {
            user: user,
            city: updateUserDto.city,
            icon: updateUserDto.icon,
            login: updateUserDto.login,
            surname: updateUserDto.surname,
            role: updateUserDto.role,
          },
        },
      );
      console.log('----->', a);
    } else {
      const createdUser = new this.additionalUserInfoModel({
        user: user,
        ...updateUserDto,
      });
      return createdUser.save();
    }
  }
}
