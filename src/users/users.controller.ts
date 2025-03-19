import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  Body,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('{/:id}')
  @ApiOperation({
    summary: 'Fetches a list of registered users of the application',
  })
  @ApiResponse({
    status: 200,
    description: 'users fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'The position of the page nbumber you want the API ot return',
    example: 1,
  })
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
  ) {
    console.log(typeof getUsersParamDto);
    console.log(getUsersParamDto);
    console.log(typeof limit);
    console.log(typeof page);
    console.log(limit);
    console.log(page);

    return this.usersService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto instanceof CreateUserDto);
    console.log(typeof createUserDto);

    return 'You sent a post request to users endpoint';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);

    return 'correct answer';
  }
}
