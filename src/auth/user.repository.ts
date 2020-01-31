import { Repository, EntityRepository } from "typeorm";
import { ConflictException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authCredentialsDto: AuthCredentialsDto) : Promise<void> {
        const { username, password } = authCredentialsDto;

        const user = new User();
        const salt = await bcrypt.genSalt();

        user.username = username;
        user.password = await this.hashPassword(password, salt);
        user.salt = salt;

        try{
            await user.save();
        } catch(error){
            if(error.code === '23505'){ //duplicate username
                throw new ConflictException('Username already exists');
            } else{
                throw error;
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({username});
        if(user && await user.validatePassword(password)){
            return user.username;
        } else{
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt)
    }
}