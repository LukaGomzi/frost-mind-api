import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findAllUser(): Promise<User[]>;
    viewUser(id: number): Promise<User>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    removeUser(id: number): Promise<{
        affected?: number;
    }>;
}
