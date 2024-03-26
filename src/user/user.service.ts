import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterInputDto } from './dto/UserInput.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  register(input: UserRegisterInputDto) {
    const user = new User();
    user.email = input.email;
    user.password = input.password;
    user.fullname = input.fullname;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
