import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterInputDto } from './dto/UserInput.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { onHashPassword } from 'src/common/utils/onHashPassword';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private catModel: Model<User>) {}

  async register(input: UserRegisterInputDto) {
    try {
      const user = new User();

      user.email = input.email;
      user.fullname = input.fullname;
      user.password = await onHashPassword(input.password);

      const createdCat = new this.catModel(user);
      return createdCat.save();
    } catch (error) {}
  }

  findAll() {
    return `This action returns all user`;
  }

  findByEmail(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
