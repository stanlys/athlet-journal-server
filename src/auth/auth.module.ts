import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserEntitySchema } from './schema/createUser.schema';
import { AuthMiddleware } from './middlewares/auth.middleware';
import {
  AdditionalUserInfoEntity,
  AdditionalUserInfoEntitySchema,
} from './schema/additionalUserInfo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
      {
        name: AdditionalUserInfoEntity.name,
        schema: AdditionalUserInfoEntitySchema,
      },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
