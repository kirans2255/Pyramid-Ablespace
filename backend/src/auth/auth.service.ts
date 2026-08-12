import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async guestLogin() {
    const randomNames = [
      'Cosmic Explorer',
      'Pixel Wanderer',
      'Starlight Pioneer',
      'Digital Voyager',
      'Neon Architect',
      'Shadow Weaver',
      'Cyber Phoenix',
      'Quantum Rover',
      'Solar Maverick',
      'Echo Vanguard',
      'Aether Nomad',
      'Lunar Craftsman',
      'Vortex Sentinel',
      'Aura Spark',
      'Astro Catalyst',
    ];

    const randomAvatars = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150',
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=150',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=150',
    ];

    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomAvatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    const randomCode = Math.random().toString(36).substring(2, 7);

    const guestEmail = `guest_${randomCode}@pyramid.app`;
    const guestUsername = randomName.toLowerCase().replace(/\s+/g, '_') + '_' + randomCode;

    let guest: any;
    try {
      guest = await this.userModel.create({
        email: guestEmail,
        name: randomName,
        avatar: randomAvatar,
        role: 'Guest Explorer',
        username: guestUsername,
        title: 'Guest Designer',
        isGuest: true,
      });
    } catch (err) {
      guest = {
        _id: `guest-${randomCode}`,
        email: guestEmail,
        name: randomName,
        avatar: randomAvatar,
        role: 'Guest Explorer',
        username: guestUsername,
        title: 'Guest Designer',
        isGuest: true,
      };
    }

    return {
      message: 'Guest login successful',
      user: guest,
      token: `guest-session-token-${guest._id}`,
    };
  }

  async googleLogin(data: { email: string; name: string; avatar?: string; googleId?: string }) {
    let user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      user = await this.userModel.create({
        email: data.email,
        name: data.name,
        avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: 'Admin',
        username: data.email.split('@')[0],
        isGuest: false,
      });
    } else {
      if (data.avatar) user.avatar = data.avatar;
      if (data.name) user.name = data.name;
      await user.save();
    }
    return {
      message: 'Google login successful',
      user,
      token: `google-session-token-${user._id}`,
    };
  }

  async getProfile(userId: string) {
    return this.userModel.findById(userId);
  }

  async updateProfile(
    userId: string,
    data: { name?: string; title?: string; username?: string; email?: string; avatar?: string },
  ) {
    let user = await this.userModel.findById(userId);
    if (!user) {
      user = await this.userModel.findOne({ email: data.email || 'dexter@pyramid.app' });
    }
    if (!user && userId) {
      user = await this.userModel.findOne({ _id: userId });
    }

    if (!user) {
      // Fallback create or return null
      return null;
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.title !== undefined) user.title = data.title;
    if (data.username !== undefined) user.username = data.username;
    if (data.avatar !== undefined) user.avatar = data.avatar;
    if (data.email !== undefined) user.email = data.email;

    await user.save();
    return user;
  }
}
