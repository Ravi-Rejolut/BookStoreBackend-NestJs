import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Observable } from "rxjs";
import { MESSAGE } from "src/constants/messages";

export class RoleGaurd implements CanActivate{

    constructor(private readonly role?:Role[]){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const req=context.switchToHttp().getRequest();
        const user=req.user;
        if(user && this.role.includes(user.role)){
            return true;
        }
        else {
            throw new UnauthorizedException(MESSAGE.ERROR.UNAUTHORIZED_ACTION);
          }

    }

}