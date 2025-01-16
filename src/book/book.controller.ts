import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BookService } from './book.service';
import { BookFetchDto, CreateAuthorDto, CreateBookDto, CreateCategoryDto, UpdateBookDto } from './dto/book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGaurd } from 'src/gaurd/roles.gaurd';
import { FilesInterceptor } from '@nestjs/platform-express';


@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @UseGuards(AuthGuard("jwt"), new RoleGaurd(["ADMIN", "MANAGER"]))
  @Post("category")
  async createCategory(@Body() body: CreateCategoryDto) {
    return await this.bookService.createCategory(body);
  }

  @Get("category")
  async findAll() {
    return await this.bookService.getAllCategory();
  }

  @Patch("category/:id")
  async updateCategory(@Param("id") id: string, @Body() body: CreateCategoryDto) {
    return await this.bookService.updateCategory(id, body);
  }


  @UseGuards(AuthGuard("jwt"), new RoleGaurd(["ADMIN", "MANAGER"]))
  @Post("author")
  async createAuthor(@Body() body: CreateAuthorDto) {
    return await this.bookService.createAuthor(body);
  }


  @Get("author")
  async getAuthors() {
    return await this.bookService.getAllAuthors();
  }


  @UseGuards(AuthGuard("jwt"), new RoleGaurd(["ADMIN", "MANAGER"]))
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createBook(@UploadedFiles() images: Express.Multer.File[], @Body() body: CreateBookDto) {
    return await this.bookService.createBook(body, images);
  }


  @UseGuards(AuthGuard("jwt"), new RoleGaurd(["ADMIN", "MANAGER"]))
  @Patch(":id")
  async updateBook(@Param("id") id: string, @Body() body: UpdateBookDto) {
    return await this.bookService.updateBook(id, body);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGaurd(["ADMIN", "MANAGER"]))
  @Delete("image/:id")
  async deleteImage(@Param("id") id: string) {
    return await this.bookService.deleteBookImage(id);
  }

  
  @UseGuards(AuthGuard("jwt"), new RoleGaurd(["ADMIN", "MANAGER"]))
  @Post(":id/image")
  @UseInterceptors(FilesInterceptor('images'))
  async addBookImage(@Param("id") id: string, @UploadedFiles() images: Express.Multer.File[],) {
    return await this.bookService.addImages(id, images);
  }




  @Get('all')
  async getAllBooks(@Query() query: BookFetchDto) {

    return await this.bookService.getAllBooks(query);
  }



  @Get(':id')
  async getBookById(@Param('id') id: string) {
    return await this.bookService.getBookId(id);
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
  //   return this.bookService.update(+id, updateBookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bookService.remove(+id);
  // }
}
