import { Injectable, ConflictException, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UpdateCoverPhotoDto } from './dto/update-cover-photo.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis, // <-- injection Redis
  ) {}

  async signup(dto: UserSignupDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    return { message: 'Compte créé avec succès' };
  }

 async updateProfilePicture(userId: number, dto: UpdateProfilePictureDto) {
  await this.userRepository.update(userId, {
    profilePicture: dto.profilePicture
  });
  const updatedUser = await this.userRepository.findOne({ where: { id: userId } });
  return updatedUser;
}

async updateCoverPhoto(userId: number, dto: UpdateCoverPhotoDto) {
  await this.userRepository.update(userId, {
    coverPhoto: dto.coverPhoto
  });
  const updatedUser = await this.userRepository.findOne({ where: { id: userId } });
  return updatedUser;
}


  async getUserProfile(userId: number) {
    // Vérifier si le profil est en cache
    const cached = await this.redis.get(`user:${userId}`);
    if (cached) return JSON.parse(cached);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException("Utilisateur non trouvé");

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      coverPhoto: user.coverPhoto,
      genre: user.genre,
      birthdate: user.birthdate,
      numtel: user.numtel
    };

    // Stocker en cache pendant 10 minutes
    await this.redis.set(`user:${userId}`, JSON.stringify(profile), 'EX', 600);

    return profile;
  }

  async signin(dto: UserSignInDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException("Email ou mot de passe incorrect");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email ou mot de passe incorrect");
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    // Optionnel : stocker le token pour blacklist futur si nécessaire
    // await this.redis.set(`jwt_blacklist:${token}`, '1', 'EX', 604800); // 7 jours

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        genre: user.genre,
      }
    };
  }
}
