import { Module } from '@nestjs/common';
   import { JwtModule } from '@nestjs/jwt';
   import { PassportModule } from '@nestjs/passport';
   import { MongooseModule } from '@nestjs/mongoose';
   import { AuthService } from './auth.service';
   import { AuthController } from './auth.controller';
   import { JwtStrategy } from './jwt.strategy';
   import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_secret_key', // Replace with a secure secret key
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
