import { Controller, ForbiddenException, Get, HttpStatus, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./services/auth.service";
import { Response } from "src/modules/response/response.entity";
import { JwtAuthGuard } from "src/common/guards/authenticate.guard";
import { UserService } from "./services/user.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly response : Response,
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Req() req, @Res() res) {
        try {
            const { user, accessToken } =  await this.authService.login(req.user);
            if (!accessToken) {
                this.response.initResponse(false, "An error occurs. Please try again", null);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
            }

            this.response.initResponse(true, "Login successfully", { ...user, accessToken});
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "An error occurs. Please try again", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getSpsoInfo(@Req() req, @Res() res) {
        try {
            if (!req.user || !req.user.id) {
                throw new ForbiddenException("User is not allowed to access this resource");
            }

            const account = await this.userService.findOneById(req.user.id);
            this.response.initResponse(true, "Get information successfully", account);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Internal server error", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }    
}