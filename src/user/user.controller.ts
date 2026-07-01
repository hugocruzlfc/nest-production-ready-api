import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

// @Get('all')    // GET /user/all
// @Get(':id')    // GET /user/:id. ------dynamic segment
// @Post()        // POST /user
// @Put(':id')    // PUT /user/:id
// @Delete(':id')    // Delete /user/:id

// rutas staticas primero q las dinamicas

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  // @Query:
  // localhost:3000/user?name=Hugo
  @Get()
  getUsers(@Query('name') name: string): unknown {
    return this.userService.findUsers(name);
    // const users = [
    //   { id: 1, name: 'John Doe' },
    //   { id: 2, name: 'Hugo' },
    // ];

    // if (name) {
    //   return users.filter((user) =>
    //     user.name.toLowerCase().includes(name.toLocaleLowerCase()),
    //   );
    // }

    // return users;
  }

  // @Param:
  // localhost:3000/user/123

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return { id, name: 'John Doe' };
  }

  // @Body:
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return { data: createUserDto, message: 'User created successfully' };
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return {
      data: {
        id,
        ...updateUserDto,
      },
      message: 'User updated successfully',
    };
  }
}
