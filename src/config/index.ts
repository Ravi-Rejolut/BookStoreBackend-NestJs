import { ConfigService } from "@nestjs/config"
import { Expose, plainToInstance } from "class-transformer";
import { IsNotEmpty, IsString, validateSync } from "class-validator";



export const configData = (configService: ConfigService) => ({
    PORT:configService.get <string>("PORT"),
    DATABASES_URL:configService.get <string>("DATABASES_URL"),
    JWT_SECRET:configService.get <string>("JWT_SECRET"),
    AWS_BUCKET:configService.get <string>("AWS_BUCKET"),
    AWS_REGION:configService.get <string>("AWS_REGION"),
    AWS_ACCESS_KEY_ID:configService.get <string>("AWS_ACCESS_KEY_ID"),
    AWS_SECRET_ACCESS_KEY:configService.get <string>("AWS_SECRET_ACCESS_KEY"),
    FIREBASE_PRIVATE_KEY:configService.get <string>("FIREBASE_PRIVATE_KEY"),
    FIREBASE_CLIENT_EMAIL:configService.get <string>("FIREBASE_CLIENT_EMAIL"),
    FIREBASE_PROJECT_ID:configService.get <string>("FIREBASE_PROJECT_ID"),
    
})

class RequiredVariable{
   
    @Expose()
    @IsString()
    @IsNotEmpty()
    PORT: string;


    @Expose()
    @IsString()
    @IsNotEmpty()
    DATABASE_URL: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    JWT_SECRET: string


    @Expose()
    @IsString()
    @IsNotEmpty()
    AWS_REGION: string


    @Expose()
    @IsString()
    @IsNotEmpty()
    AWS_BUCKET: string
    
    @Expose()
    @IsString()
    @IsNotEmpty()
    AWS_ACCESS_KEY_ID: string


    @Expose()
    @IsString()
    @IsNotEmpty()
    AWS_SECRET_ACCESS_KEY: string


    @Expose()
    @IsString()
    @IsNotEmpty()
    FIREBASE_PRIVATE_KEY: string

    @Expose()
    @IsString()
    @IsNotEmpty()
    FIREBASE_CLIENT_EMAIL: string

    @Expose()
    @IsString()
    @IsNotEmpty()
    FIREBASE_PROJECT_ID: string
}


export function validate(config:Record<string,unknown>){

    const updatedConfig=config;

    const validateConfig=plainToInstance(RequiredVariable,updatedConfig,{
        enableImplicitConversion:true,
        excludeExtraneousValues:true
    })

    const errors=validateSync(validateConfig,{
        skipMissingProperties:false,

    })

    if(errors.length>0)
    {
        const issues:String[]=errors.map((error)=>{
            const keys=Object.keys(error.constraints)
            return error.constraints[keys[0]]
        })

        issues.push("Invalid .env config");

        throw issues.join("\n");
    }

    return validateConfig



}