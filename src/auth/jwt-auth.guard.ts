import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { stringify } from "querystring";
import { Observable, retry } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){

    }

    private readonly logger = new Logger(JwtAuthGuard.name)

     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>  {
        this.logger.debug('Start check auth role')
        const req = context.switchToHttp().getRequest()
        try{
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            if (bearer != 'Bearer' || !token){
                this.logger.debug('Token are not valid')
                throw new UnauthorizedException({message: 'Unauthorized user'});
            }

            const user =  this.jwtService.verify(token);
            req.user = user;
            this.logger.debug('Token are fine, come in ;)')
            return true;
        } catch (e){
            this.logger.debug(e)
            throw new UnauthorizedException({message: 'Unauthorized user'});
        }
    }
}