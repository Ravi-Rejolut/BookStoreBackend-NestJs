import { Injectable } from '@nestjs/common';

import { CreateCategoryDto } from './dto/book.dto';
import { BookRepository } from './book.repository';
import { MESSAGE } from 'src/constants/messages';
import { MESSAGES } from '@nestjs/core/constants';

@Injectable()
export class BookService {

  constructor(
    private readonly bookReposity:BookRepository
  ){}
  async createCategory(body:CreateCategoryDto) {
    try {
      
      const category=await this.bookReposity.getCategory({where:{name:body.name}});
      if(category){
        throw new Error(MESSAGE.ERROR.CATEGORY.CATEGORY_EXIST);
      }

      return await this.bookReposity.createCategory({data:body});

    } catch (error) {
      throw new Error(MESSAGE.ERROR.CATEGORY.CREATION_FAILED);
    }
   
  }

  async getAllCategory() {
    try {

      return await this.bookReposity.getAllCategories();
      
    } catch (error) {
      throw new Error(MESSAGE.ERROR.CATEGORY.CATEGORY_FETCH)
    }
  }




  async createAuthor(body:{name:string,description:string}) {
    try {
      const author=this.bookReposity.getAuthor({where:{name:body.name}});
      if(author){
        throw new Error(MESSAGE.ERROR.AUTHOR.ALREADY_EXISTS);
      }

      const authorCreated=this.bookReposity.createAuthor({data:body})


    }
    catch(error){
      throw new Error(MESSAGE.ERROR.AUTHOR.CREATION_FAILED);
    }

  }

}
