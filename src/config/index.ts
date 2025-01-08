import { ConfigService } from "@nestjs/config"
import { Expose, plainToInstance } from "class-transformer";
import { IsNotEmpty, IsString, validateSync } from "class-validator";



export const configData = (configService: ConfigService) => ({
    PORT:configService.get <string>("PORT"),
    DATABASES_URL:configService.get <string>("DATABASES_URL"),
    JWT_SECRET:configService.get <string>("JWT_SECRET")
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