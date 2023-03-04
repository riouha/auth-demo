import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'argon2';
import { SignupUserDto, EditProfileDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(dto: SignupUserDto) {
    const duplicate = await this.userRepo.findOne({ where: { mobile: dto.mobile }, select: { id: true } });
    if (duplicate) throw new ConflictException('mobile is duplicate');

    const user = new User();
    user.mobile = dto.mobile;
    user.name = dto.name;
    user.password = await hash(dto.password);
    return this.userRepo.save(user);
  }

  async editProfile(id: number, dto: EditProfileDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`user ${id} not found`);

    if (dto.name) user.name = dto.name;
    return this.userRepo.save(user);
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`user ${id} not found`);
    return user;
  }

  async getUserByMobile(mobile: string) {
    const user = await this.userRepo.findOne({ where: { mobile } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  // async manageUser(id: number, dto: { isActive?: boolean; isVerified?: boolean }) {
  //   const user = await this.userRepo.findOne({ where: { id } });
  //   if (!user) throw new NotFoundException('user not found');
  //   return user;
  // }

  async verifyUser(user: User, isVerified: boolean) {
    user.isVerified = isVerified;
    return this.userRepo.save(user);
  }
}
