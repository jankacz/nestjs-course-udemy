import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  Body,
  Headers,
  Ip,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  public getAllUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return `Returning all users with limit: ${limit}`;
  }

  @Get('/:id{/:optional}')
  public getUsers(
    @Param() params: any,
    @Query() query: any,
    @Param('id', ParseIntPipe) id?: number,
    @Param('optional') optional?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    console.log('params: ', params);
    console.log('params: ', query);
    if (optional) {
      return `ID is ${id} and limit  is ${limit}`;
    } else {
      return `ID is ${id} and no optional parameter`;
    }
  }

  @Post()
  public createUsers(
    @Body() request: any,
    @Headers() headers: any,
    @Ip() ip: any,
  ) {
    console.log(request);
    console.log(headers);
    console.log(ip);
    return 'You sent a post request to users endpoint';
  }
}
