import { Injectable } from '@nestjs/common';

import { BookFetchDto, CreateAuthorDto, CreateBookDto, CreateCategoryDto, UpdateBookDto } from './dto/book.dto';
import { BookRepository } from './book.repository';
import { MESSAGE } from 'src/constants/messages';
import { MESSAGES } from '@nestjs/core/constants';
import { Prisma } from '@prisma/client';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class BookService {

  constructor(
    private readonly bookReposity: BookRepository,
    private readonly fileUploadService: FileUploadService
  ) { }
  async createCategory(body: CreateCategoryDto) {
    try {

      const category = await this.bookReposity.getCategory({ where: { name: body.name } });
      if (category) {
        throw new Error(MESSAGE.ERROR.CATEGORY.CATEGORY_EXIST);
      }

      return await this.bookReposity.createCategory({ data: body });

    } catch (error) {
      throw new Error(MESSAGE.ERROR.CATEGORY.CREATION_FAILED);
    }

  }

  async updateCategory(id: string, body: CreateCategoryDto) {
    try {
      const category = await this.bookReposity.getCategory({ where: { id } });
      if (!category) {
        throw new Error(MESSAGE.ERROR.CATEGORY.CATEGORY_NOT_EXIST)
      }
      return await this.bookReposity.updateCategory({ where: { id }, data: body });

    } catch (error) {
      throw new Error(MESSAGE.ERROR.CATEGORY.UPDATE_FAILED);
    }
  }

  async getAllCategory() {
    try {

      return await this.bookReposity.getAllCategories();

    } catch (error) {
      throw new Error(MESSAGE.ERROR.CATEGORY.CATEGORY_FETCH)
    }
  }
  async createAuthor(body: CreateAuthorDto) {
    try {
      const author = await this.bookReposity.getAuthor({ where: { name: body.name } });

      console.log(author)
      if (author) {
        throw new Error(MESSAGE.ERROR.AUTHOR.ALREADY_EXISTS);
      }

      const authorCreated = await this.bookReposity.createAuthor({ data: body })
      return { msg: MESSAGE.SUCCESS.AUTHOR.CREATED };

    }
    catch (error) {

      console.log(error)
      throw new Error(MESSAGE.ERROR.AUTHOR.CREATION_FAILED);
    }

  }
  async getAllAuthors(){
    try {
      
      return await this.bookReposity.getAllAuthors();
    } catch (error) {
      throw new Error(MESSAGE.ERROR.AUTHOR.FETCH_FAILED)
    }
  }
  async createBook(body: CreateBookDto, images: Express.Multer.File[]) {

    try {

      const book = await this.bookReposity.getBook({ where: { name: body.name, Author: { id: body.authorId }, Category: { id: body.categoryId } } });

      if (book) {
        throw new Error(MESSAGE.ERROR.BOOK.ALREADY_EXISTS);
      }


      let data = {
        ...body,
        rating: Number(body.rating),
        price: Number(body.price),
        available: Boolean(body.available),
        quantity: Number(body.quantity),
        Author: { connect: { id: body.authorId } },
        Category: { connect: { id: body.categoryId } }

      }

      delete data.authorId;
      delete data.categoryId;

      const addedBook = await this.bookReposity.createBook({ data });


      await this.addImages(addedBook.id, images);


      return { msg: MESSAGE.SUCCESS.BOOK.CREATED };


    } catch (error) {
      console.log(error)
      throw new Error(MESSAGE.ERROR.BOOK.CREATION_FAILED);
    }



  }

  async updateBook(id: string, body: UpdateBookDto) {

    try {
      const book = await this.bookReposity.getBook({ where: { id } });

      if (!book) {
        throw new Error(MESSAGE.ERROR.BOOK.NOT_FOUND)
      }

      const data = await this.prepareUpdateUser(body);

      return await this.bookReposity.updateBook({ where: { id }, data });
    } catch (error) {
      throw new Error(MESSAGE.ERROR.BOOK.FAILED_UPDATE)
    }

  }

  private async prepareUpdateUser(body: UpdateBookDto): Promise<Prisma.BookUpdateInput> {

    let data: Prisma.BookUpdateInput = {}

    const { name, rating, price, available, quantity, authorId, categoryId, description, } = body

    if (name) data.name = name
    if (rating) data.rating = Number(rating)
    if (price) data.price = Number(price)
    if (available) data.available = Boolean(available)
    if (quantity) data.quantity = Number(quantity)
    if (description) data.description = description
    if (authorId) data.Author = { connect: { id: authorId } }
    if (categoryId) data.Category = { connect: { id: categoryId } }



    return data;
  }


  async deleteBookImage(id: string) {
    try {
      const img = await this.bookReposity.getBookImage({ where: { id } })

      if (!img) {
        throw new Error(MESSAGE.ERROR.BOOK.IMAGE_NOT_FOUND)
      }

      return await this.bookReposity.deleteBookImage({ where: { id } });

    } catch (error) {
      throw new Error(MESSAGE.ERROR.BOOK.FAILED_IMAGE_DELETE);
    }
  }

  async addImages(id: string, images: Express.Multer.File[]) {
    let imageUrls = []
    if (images && images.length > 1) {

      imageUrls = await this.fileUploadService.UploadMutipleFiles(images);
    }
    else if (images && images.length == 1) {
      let imageUrl = await this.fileUploadService.uploadFile(images[0].mimetype, images[0].originalname, images[0].buffer);

      imageUrls.push(imageUrl)
    }


    let uploadData: Prisma.BookPhotosCreateInput[] = [];
    imageUrls.forEach((imageUrl) => {
      uploadData.push({
        url: imageUrl.url,
        Book: { connect: { id: id } },
      })
    }
    )
    await Promise.all(uploadData.map(data => {
      return this.bookReposity.addBookImageUrl({ data })
    }))
  }


  async getAllBooks(query: BookFetchDto) {
    try {

      let where: Prisma.BookWhereInput = {}

      if (query.author) {
        where.Author = { name: { contains: query.author, mode: "insensitive" } }
      }

      if (query.category) {
        where.Category = { name: { contains: query.category, mode: "insensitive" } }
      }

      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: "insensitive" } },
          { Author: { name: { contains: query.search, mode: "insensitive" } } },
          { Category: { name: { contains: query.search, mode: "insensitive" } } }

        ]
      }

      if (query.rating) {
        where.rating = {
          gte: query.rating
        }
      }
      if (query.price) {
        where.price = {
          lte: Number(query.price)
        }
      }

      if (query.available) {
        where.available = {
          equals: query.available
        }
      }

      return await this.bookReposity.getAllBooks({ where });
    }
    catch (error) {
      console.log(error)
      throw new Error(MESSAGE.ERROR.BOOK.FETCH_FAILED)

    }

  }
  async getBookId(id: string) {

    try {
      return this.bookReposity.getBook({ where: { id }, include: { Author: true, Category: true, bookPhoto: true } });

    } catch (error) {
      throw new Error(MESSAGE.ERROR.BOOK.FETCH_FAILED)
    }
  }
}
