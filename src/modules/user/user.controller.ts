import { Body, ClassSerializerInterceptor, Controller, Patch, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './services/user.service';
import { EditProfileDto } from './dtos/user.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ITokenPayload } from '../auth/types/token.interface';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/')
  async editProfile(@GetUser() token: ITokenPayload, @Body() body: EditProfileDto) {
    return token;

    // const user = await this.userService.editProfile(body);
    // return { user };
  }
}
