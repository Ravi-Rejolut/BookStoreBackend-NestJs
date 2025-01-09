import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configData } from 'src/config';
import { MESSAGE } from 'src/constants/messages';

import {v4 as uuidv4} from 'uuid'

@Injectable()
export class FileUploadService {

    
   

    constructor(private readonly configService:ConfigService){
    }

    config:any=configData(this.configService)
    private bucket:string=this.config.AWS_BUCKET;
    private readonly  s3Client=new S3Client({
        region:this.config.AWS_REGION,
        credentials:{
            accessKeyId:this.config.AWS_ACCESS_KEY_ID,
            secretAccessKey:this.config.AWS_SECRET_ACCESS_KEY,
        }
    })


    async UploadMutipleFiles(files: Express.Multer.File[]) {
        try {
            
            if (files.length == 0) {
                throw new Error(MESSAGE.ERROR.FILE.UPLOAD_FAILED);
            }

            // copy file to local folder
           const fileUploads=files.map((file)=>{
               return this.uploadFile(file.mimetype, file.originalname, file.buffer)
           })

           const imageUrls=await Promise.all(fileUploads);
           return imageUrls;

        } catch (error) {
            throw new Error(MESSAGE.ERROR.FILE.UPLOAD_FAILED);
        }
    }

    async uploadFile(mimeType: string, keyName: string, file: Buffer) {
        try {
          const awsKey=`${uuidv4()}-${keyName}`
          await this.s3Client.send(
            new PutObjectCommand({
              Bucket: this.bucket,
              Key: `${awsKey}`,
              Body: file,
              ContentType: mimeType,
              ACL: "public-read",
            })
          );
          const imageUrl = `https://${this.bucket}.s3.amazonaws.com/${awsKey}`;
          return { url: imageUrl };
        } catch (error) {
          throw error;
        }
      }

}
