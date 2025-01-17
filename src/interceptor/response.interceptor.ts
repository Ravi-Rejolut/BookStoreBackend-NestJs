import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { MESSAGES } from "@nestjs/core/constants";
import { catchError, map, Observable, of } from "rxjs";
import { PageMetaData } from "src/constants/dto";
import { MESSAGE } from "src/constants/messages";


export interface ValidResponse<T> {
    success: boolean,
    statusCode: number,
    message: string,
    data: T
}

export interface ErrorResponse {
    success: boolean,
    message: string,
    error: string,
    errorCode: number,
    url: string,
    urlMethod: string,
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ValidResponse<T> | ErrorResponse> {

    constructor() { }

    async intercept(
        context: ExecutionContext, next: CallHandler<T>
    ): Promise<Observable<ValidResponse<T> | ErrorResponse>> {

        const request = context.switchToHttp().getRequest();
         
        const {page=1,take=10}=request.query;


        return next.handle().pipe(
            map((data: any) => {
                const res = data;
                const message = data?.message;

                if (res === null || res === undefined || typeof res === undefined)
                    throw new BadRequestException(MESSAGE.ERROR.SERVER_ERROR);

                const statusCode = context.switchToHttp().getResponse().statusCode;

                let result:any=res

                if(!isNaN(res.paginationCount))
                {
                    const {paginationCount, ...data} = res;
                    const pageMetaData=new PageMetaData({page,take,itemCount:paginationCount});
                    result={
                        ...data,
                        pageMetaData
                    }

                }


                const validResponse: ValidResponse<T> = {
                    success: true,
                    statusCode: statusCode,
                    message: message || MESSAGE.SUCCESS.DEFAULT,
                    data: result
                }

                return validResponse
            }),
            catchError((error: any) => {
                if (Array.isArray(error?.response?.message)) {
                    error.response.message = error.response.message.join("\n");
                }

                context.switchToHttp().getResponse().statusCode = error.response?.statusCode ?? 500;

                console.log(error)
                if (error.message) {
                    return of({
                        success: false,
                        message: error.response?.message || error.message,
                        errorCode: error.response?.statusCode || 500,
                        error: error.response?.error,
                        url: request.url,
                        urlMethod: request.method,
                    })
                }

                const errorResponse: ErrorResponse = {
                    success: false,
                    message: error.message,
                    errorCode: 500,
                    error: MESSAGE.ERROR.SERVER_ERROR,
                    url: request.url,
                    urlMethod: request.method,
                };

                return of(errorResponse);

            })
        )

    }




}

