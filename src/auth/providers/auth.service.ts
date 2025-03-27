import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public login(email: string, password: string, id: number) {
    const user = this.usersService.findOneById(123);

    console.log(email, password, user, id);
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
