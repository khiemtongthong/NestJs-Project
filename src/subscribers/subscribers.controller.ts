import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }
  @Post()
  @ResponseMessage("create a subscriber")
  create(@Body() createRoleDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage("fetch list subscriber with paginate")
  findAll(
    @Query("current") currentPage: string, //const currentPage: string = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("fetch a subscriber by id")
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a subscriber")
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateSubscriberDto,
    @User() user: IUser
  ) {
    return this.subscribersService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.subscribersService.remove(id, user);
  }
}
