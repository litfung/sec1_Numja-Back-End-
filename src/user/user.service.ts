import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../model/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { hashSync } from 'bcryptjs';
// import { UserRole } from '../enum/user.enum'
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly model: ReturnModelType<typeof User>,
    ) {}

    find(): Promise<User[]> {
        return this.model.find().exec();
    }

    findById(id: string): Promise<User> {
        return this.model.findById(id).exec();
    }

    findOne(conditions: any, password?: boolean): Promise<User> {
        if (password) {
            return this.model.findOne(conditions, '+password').exec();
        }
        return this.model.findOne(conditions).exec();
    }

    exists(id: string): Promise<boolean> {
        return this.model.exists({ _id: id });
    }

    // async isAdmin(id: string): Promise<boolean> {
    //     let user = await this.model.findById(id).exec();
    //     return user.role === UserRole.Admin
    // }

    create({ password, ...userDTO }: User): Promise<User> {
        password = hashSync(password, 12);
        const user = new this.model({ ...userDTO, password });
        return user.save();
    }

    update(id: string, userDTO: Partial<User>): Promise<User> {
        return this.model.findByIdAndUpdate(id, userDTO, { new: true }).exec();
    }
}
