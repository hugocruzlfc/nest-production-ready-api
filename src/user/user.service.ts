import { Injectable, NotFoundException } from '@nestjs/common';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
  ];

  findUsers(name: string = ''): User[] {
    return this.users.filter((user) =>
      user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
    );
  }

  findUserById(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  createUser(userData: Omit<User, 'id'>) {
    const newUser = {
      id: this.users.length + 1,
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  deleteUser(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users = this.users.filter((user) => user.id !== id);

    return user;
  }
}
