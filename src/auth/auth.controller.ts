import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { UserResponseType } from './type/userResponse.type';
import { LoginDTO } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExpressRequest } from './middlewares/auth.middleware';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { AdditionalUserInfoEntityDocument } from './schema/additionalUserInfo.schema';

@ApiTags('Auth endpoint')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Gets all users' })
  @Get()
  async getAll(): Promise<any> {
    return this.authService.getAll();
  }
  @ApiOperation({ summary: 'Delete user by email' })
  @Delete()
  async deleteUser(@Body() loginDto: LoginDTO): Promise<boolean> {
    return this.authService.deleteUser(loginDto);
  }
  @ApiOperation({ summary: 'Create user by email & password & userName' })
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDTO,
  ): Promise<UserResponseType> {
    const user = await this.authService.createUser(createUserDto);
    return this.authService.buildUserResponse(user);
  }

  @ApiOperation({ summary: 'Login by email & password' })
  @Post('user')
  async login(@Body() loginDto: LoginDTO): Promise<UserResponseType> {
    const user = await this.authService.loginUser(loginDto);
    return this.authService.buildUserResponse(user);
  }

  @ApiOperation({ summary: 'Get user information' })
  @Get('user')
  async currentUser(
    @Request() request: ExpressRequest,
  ): Promise<UserResponseType> {
    if (!request.user) throw new UnauthorizedException('Un Auth');
    return this.authService.buildUserResponse(request.user);
  }

  @ApiOperation({ summary: 'Get user information' })
  @Get('user/add')
  async getAllUserInfo(): Promise<AdditionalUserInfoEntityDocument> {
    return this.authService.getAllUserInfo();
  }

  @ApiOperation({ summary: 'Update user information' })
  @Put('user')
  async updateUser(
    @Request() request: ExpressRequest,
    @Body() updateUserDto: UpdateUserDTO,
  ): Promise<void> {
    console.log(request, updateUserDto);
    if (!request.user) throw new UnauthorizedException('Un Auth');
    await this.authService.updateUserInfo(request.user, updateUserDto);
  }
}
