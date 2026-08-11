import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  async guestLogin() {
    return this.authService.guestLogin();
  }

  @Post('google')
  async googleLogin(@Body() body: { email: string; name: string; avatar?: string; googleId?: string }) {
    return this.authService.googleLogin(body);
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }

  @Patch('profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(id, updateProfileDto);
  }
}
