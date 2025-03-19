import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

/**
 * Class to connect to Users table and perfor business operations
 */
@Injectable()
export class UsersService {
  /**
   * Adding AuthService
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

    console.log(getUsersParamDto);
    console.log(limit);
    console.log(page);
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@smith.com',
      },
    ];
  }

  /**
   * The method to get signle user from the database
   */
  public findOneById(id: string) {
    console.log(id);
    return {
      firstName: 'Alice',
      email: 'alice@smith.com',
    };
  }
}
