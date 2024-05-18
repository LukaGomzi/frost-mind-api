import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from "../mailer/mailer.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly mailerService: MailerService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * we have used get decorator to get all the user's list
   * so the API URL will be
   * GET http://localhost:3000/user
   */
  @Get()
  findAll() {
    return this.userService.findAllUser();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.viewUser(+id);
  }

  /**
   * we have used patch decorator with id param to get id from request
   * so the API URL will be
   * PATCH http://localhost:3000/user/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  /**
   * we have used Delete decorator with id param to get id from request
   * so the API URL will be
   * DELETE http://localhost:3000/user/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.createUser(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User successfully registered. Please check your email to confirm your registration.',
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          created_at: newUser.created_at,
        },
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'There was a problem registering the user.',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    try {
      await this.userService.confirmUser(token);
      return {
        statusCode: HttpStatus.OK,
        message: 'Email successfully confirmed.',
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid or expired confirmation token.',
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
