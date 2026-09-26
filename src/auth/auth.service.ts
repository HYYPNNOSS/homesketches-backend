import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({ name: dto.name, email: dto.email, passwordHash });
    return this.issueToken(user.id, user.name, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    const passwordMatches = user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return this.issueToken(user.id, user.name, user.email);
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User no longer exists');
    return this.toPublicUser(user);
  }

  private issueToken(id: string, name: string, email: string) {
    const accessToken = this.jwtService.sign({ sub: id, email });
    return { accessToken, user: { id, name, email } };
  }

  private toPublicUser(user: { id: string; name: string; email: string }) {
    return { id: user.id, name: user.name, email: user.email };
  }
}