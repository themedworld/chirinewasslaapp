import { Controller, Get, Post, Body, Patch, Param, Delete,Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UpdateCoverPhotoDto } from './dto/update-cover-photo.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @Post('signup')
  signup(@Body() dto: UserSignupDto) {
    return this.usersService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: UserSignInDto) {
    return this.usersService.signin(dto);
  }

  @Put(':id/profile-picture')
updateProfilePicture(@Param('id') id: string, @Body() dto: UpdateProfilePictureDto) {
  return this.usersService.updateProfilePicture(+id, dto);
}

@Put(':id/cover-photo')
updateCoverPhoto(@Param('id') id: string, @Body() dto: UpdateCoverPhotoDto) {
  return this.usersService.updateCoverPhoto(+id, dto);
}

@Get(':id')
getUserProfile(@Param('id') id: string) {
  return this.usersService.getUserProfile(+id);
}
}
