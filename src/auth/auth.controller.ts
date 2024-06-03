import { Controller, Get, Post, Put, Delete, Render, UseGuards, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';


@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private rolesService: RolesService
    ) { }
    @Public()
    @ResponseMessage("User Login")
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response) { //gan cookie
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @ResponseMessage("Get user information")
    @Get('/account')
    async handleGetAccount(@User() user: IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any;
        user.permissions = temp.permissions;
        return { user };
    }

    @Public()
    @ResponseMessage("Get User by refresh token")
    @Get('/refresh')
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies["refresh_token"]
        return this.authService.processNewToKen(refreshToken, response);
    }

    @ResponseMessage("Logout User")
    @Get('/logout')
    handleLogout(@Res({ passthrough: true }) response: Response,
        @User() user: IUser
    ) {
        return this.authService.logout(response, user);
    }
}