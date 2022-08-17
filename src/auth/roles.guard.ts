
import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";
import { User } from "src/users/users.model";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {
    }

    private readonly logger = new Logger(RolesGuard.name)

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        this.logger.debug('Start check JWT-token')
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            if (!requiredRoles) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                this.logger.debug('Token are not valid')
                throw new UnauthorizedException({message: 'Unauthorized user'})
            }

            const user = this.jwtService.verify(token) as User;
            req.user = user;
            const isAccessGranted = user.roles.some(role => requiredRoles.includes(role.value));
            if (!isAccessGranted){
                this.logger.debug(`Access Denied! This user are not ${requiredRoles}`)
                throw new HttpException( 'Access Denied', HttpStatus.FORBIDDEN)
            }
            return user.roles.some(role => requiredRoles.includes(role.value));
        } catch (e) {
            console.log(e)
            throw new HttpException( 'Access Denied', HttpStatus.FORBIDDEN)
        }
    }

}