import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateResearcherUserDto } from './dto/create-researcher-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
export declare class UsersService {
    private userRepository;
    private roleService;
    private readonly logger;
    constructor(userRepository: typeof User, roleService: RolesService);
    createResearcherUser(dto: CreateResearcherUserDto): Promise<User>;
    createUser(dto: CreateUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
    addRole(dto: AddRoleDto): Promise<AddRoleDto>;
    getUsersByEmail(email: string): Promise<User>;
}
