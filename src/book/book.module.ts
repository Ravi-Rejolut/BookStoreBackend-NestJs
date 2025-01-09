import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookRepository } from './book.repository';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { AuthRepository } from 'src/auth/auth.repository';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Module({
  controllers: [BookController],
  providers: [BookService,BookRepository,PrismaService,AuthRepository,JwtStrategy,FileUploadService],
})
export class BookModule {}
