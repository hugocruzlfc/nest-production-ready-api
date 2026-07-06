import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserService } from './user.service';
import { RoleGuard } from 'src/guards/role.guard';

// @Get('all')    // GET /user/all
// @Get(':id')    // GET /user/:id. ------dynamic segment
// @Post()        // POST /user
// @Put(':id')    // PUT /user/:id
// @Delete(':id')    // Delete /user/:id

// rutas staticas primero q las dinamicas

@Controller('user')
// @UseGuards(RoleGuard)
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
    const newUser = this.userService.createUser(createUserDto);

    return { data: newUser, message: 'User created successfully' };
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

  @Delete(':id')
  @UseGuards(RoleGuard)
  removeUser(@Param('id') id: string): unknown {
    const deletedUser = this.userService.deleteUser(Number(id));

    return { data: deletedUser, message: 'User deleted successfully' };
  }
}
