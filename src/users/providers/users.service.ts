/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  Inject,
  forwardRef,
  RequestTimeoutException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

/**
 * Class to connect to Users table and perfor business operations
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting usersRepository
     * Adding AuthService
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    private readonly configService: ConfigService,

    //Inject userscreatemany provider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}

  /**
   * The method to create user
   */
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null | undefined = undefined;
    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        { description: 'Error connecting to the database' },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }

    //handle exception
    let newUser = this.usersRepository.create(createUserDto);
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        { description: 'Error connecting to the database' },
      );
    }

    return newUser;
  }

  /**
   * The method to get all the users from the database
   */
  public async findAll() {
    // throw new HttpException(
    //   {
    //     status: HttpStatus.MOVED_PERMANENTLY,
    //     error: 'The API endpoint does not exist',
    //     fileName: 'users.service.ts',
    //     lineNumber: 88,
    //   },
    //   HttpStatus.MOVED_PERMANENTLY,
    //   {
    //     cause: new Error(),
    //     description: 'Occured because the API endpoint was permanently moved',
    //   },
    // );
    return await this.usersRepository.find();
  }

  /**
   * The method to get signle user from the database
   */
  public async findOneById(id: number) {
    let user: User | null | undefined = undefined;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        { description: 'Error connecting to the database' },
      );
    }

    if (!user) {
      throw new BadRequestException(
        'The user id does not exist, please check other id number.',
      );
    }
    return await this.usersRepository.findOneBy({ id });
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }
}
