import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  BookFetchDto,
  CreateAuthorDto,
  CreateBookDto,
  CreateCategoryDto,
  UpdateBookDto,
} from './dto/book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGaurd } from 'src/gaurd/roles.gaurd';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Book') // API grouping tag
@Controller('book')
@ApiBearerAuth() // Adds a BearerAuth field in Swagger
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard('jwt'), new RoleGaurd(['ADMIN', 'MANAGER']))
  @Post('category')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createCategory(@Body() body: CreateCategoryDto) {
    return this.bookService.createCategory(body);
  }

  @Get('category')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Returns all categories' })
  findAll() {
    return this.bookService.getAllCategory();
  }

  @Patch('category/:id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  updateCategory(@Param('id') id: string, @Body() body: CreateCategoryDto) {
    return this.bookService.updateCategory(id, body);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGaurd(['ADMIN', 'MANAGER']))
  @Post('author')
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ status: 201, description: 'Author created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createAuthor(@Body() body: CreateAuthorDto) {
    return this.bookService.createAuthor(body);
  }

  @Get('author')
  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({ status: 200, description: 'Returns all authors' })
  getAuthors() {
    return this.bookService.getAllAuthors();
  }

  @UseGuards(AuthGuard('jwt'), new RoleGaurd(['ADMIN', 'MANAGER']))
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Create a new book with images' })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateBookDto })
  createBook(@UploadedFiles() images: Express.Multer.File[], @Body() body: CreateBookDto) {
    return this.bookService.createBook(body, images);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGaurd(['ADMIN', 'MANAGER']))
  @Patch(':id')
  @ApiOperation({ summary: 'Update book details by ID' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  updateBook(@Param('id') id: string, @Body() body: UpdateBookDto) {
    return this.bookService.updateBook(id, body);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGaurd(['ADMIN', 'MANAGER']))
  @Delete('image/:id')
  @ApiOperation({ summary: 'Delete an image by ID' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  deleteImage(@Param('id') id: string) {
    return this.bookService.deleteBookImage(id);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGaurd(['ADMIN', 'MANAGER']))
  @Post(':id/image')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Add images to a book' })
  @ApiResponse({ status: 201, description: 'Images added successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  addBookImage(@Param('id') id: string, @UploadedFiles() images: Express.Multer.File[]) {
    return this.bookService.addImages(id, images);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all books with optional filters' })
  @ApiResponse({ status: 200, description: 'Returns a list of books' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of books per page' })
  @ApiQuery({ name: 'author', required: false, description: 'Filter by author' })
  getAllBooks(@Query() query: BookFetchDto) {
    return this.bookService.getAllBooks(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book details by ID' })
  @ApiResponse({ status: 200, description: 'Returns book details' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  getBookById(@Param('id') id: string) {
    return this.bookService.getBookId(id);
  }
}
