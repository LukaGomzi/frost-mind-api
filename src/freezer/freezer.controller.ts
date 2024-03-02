import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { FreezerService } from './freezer.service';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateFreezerDto } from "./dto/create-freezer.dto";
import { UpdateFreezerDto } from "./dto/update-freezer.dto";


@Controller('freezers')
export class FreezerController {
    constructor(private readonly freezerService: FreezerService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createFreezerDto: CreateFreezerDto, @Request() req) {
        return this.freezerService.createFreezer(createFreezerDto.name, this.getUserIdFromReq(req));
    }

    @UseGuards(JwtAuthGuard)
    @Post(':freezerId/users/:username')
    assignFreezerToUser(@Param('freezerId') freezerId: number, @Param('username') username: string, @Request() req) {
        return this.freezerService.assignFreezerToUser(freezerId, this.getUserIdFromReq(req), username);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findFreezers(@Request() req) {
        return this.freezerService.findFreezersByUser(this.getUserIdFromReq(req));
    }

    @UseGuards(JwtAuthGuard)
    @Put(':freezerId')
    updateFreezer(@Param('freezerId') freezerId: number, @Body() updateFreezerDto: UpdateFreezerDto, @Request() req) {
        return this.freezerService.updateFreezer(freezerId, this.getUserIdFromReq(req), updateFreezerDto.name);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':freezerId')
    removeFreezer(@Param('freezerId') freezerId: number, @Request() req) {
        return this.freezerService.removeFreezer(freezerId, this.getUserIdFromReq(req));
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':freezerId/users/:username')
    unassignFreezerFromUser(@Param('freezerId') freezerId: number, @Param('username') username: string, @Request() req) {
        return this.freezerService.unassignFreezerFromUser(freezerId, this.getUserIdFromReq(req), username);
    }

    private getUserIdFromReq(req): number {
        return req.user.userId;
    }
}
