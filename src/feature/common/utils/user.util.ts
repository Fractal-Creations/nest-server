import { UserDto } from "src/feature/users/dto/user.dto";
import { User } from "src/feature/users/users.model";

export class  UserUtils {
  static getFio(user: User | UserDto): string {
    return `${user.surname} ${user.name} ${user.patronymic ?? ''}`
  }
}