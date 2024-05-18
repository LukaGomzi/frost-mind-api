import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from "../mailer/mailer.service";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
      private mailerService: MailerService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;

    const salt = await bcrypt.genSalt();
    user.password_hash = await bcrypt.hash(createUserDto.password, salt);

    user.confirmationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await this.userRepository.save(user);

    const confirmUrl = `http://localhost:3000/users/confirm/${user.confirmationToken}`;
    await this.mailerService.sendMail(
        newUser.email,
        'Email Confirmation',
        'Please confirm your email by clicking the link below:',
        `<a href="${confirmUrl}">Confirm Email</a>`
    );

    return newUser;
  }

  async confirmUser(token: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { confirmationToken: token } });
    if (!user) {
      throw new Error('Invalid confirmation token');
    }
    user.isConfirmed = true;
    user.confirmationToken = null;
    return this.userRepository.save(user);
  }

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  viewUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found.`);
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      user.password_hash = await bcrypt.hash(updateUserDto.password, salt);
    }
    return this.userRepository.save(user);
  }

  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }

  async saveRefreshToken(id: number, refreshToken: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  }
}
