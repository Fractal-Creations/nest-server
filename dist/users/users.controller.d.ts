import { AddRoleDto } from './dto/add-role.dto';
import { CreateResearcherUserDto } from './dto/create-researcher-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    create(userDto: CreateResearcherUserDto): Promise<User>;
    getAll(): Promise<User[]>;
    addRole(dto: AddRoleDto): Promise<AddRoleDto>;
}
