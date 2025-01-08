import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { createBookDto, CreateCategoryDto } from './dto/book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGaurd } from 'src/gaurd/roles.gaurd';


@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard("jwt"),new RoleGaurd(["ADMIN","MANAGER"]))
  @Post("category")
  async createCategory(@Body() body: CreateCategoryDto) {
    return await this.bookService.createCategory(body);
  }

  @Get("category")
  async findAll() {
    return await this.bookService.getAllCategory();
  }


  @UseGuards(AuthGuard("jwt"),new RoleGaurd(["ADMIN","MANAGER"]))
  @Post("book")
  async addBook(@Body() body: createBookDto) {
    return await this.bookService.createCategory(body);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bookService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
  //   return this.bookService.update(+id, updateBookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bookService.remove(+id);
  // }
}
