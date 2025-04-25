import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    //Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      //Create Query Runner to datasource
      await queryRunner.connect();
      //Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException('Could not connect to the database');
    }

    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      //If successful commit
      await queryRunner.commitTransaction();
    } catch (error) {
      //If unsuccessful rollback

      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        //Release connection
        await queryRunner.release();
      } catch (error) {
        // eslint-disable-next-line no-unsafe-finally
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }

    return newUsers;
  }
}
