import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AdminsService } from './admins.service';

//Tipar tudo com os DTOs

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) { }

    @Get()
    listAdmins() {
        return this.adminsService.listAdmins();
    }

    @Get(':id')
    getAdmin(@Param('id') id: string) {
        return this.adminsService.getAdmin(id);
    }

    @Post()
    createAdmin(@Body() data: any) {
        return this.adminsService.createAdmin(data);
    }

    @Put(':id')
    updateAdmin(@Param('id') id: string, @Body() data: any) {
        return this.adminsService.updateAdmin(id, data);
    }

    @Delete(':id')
    deleteAdmin(@Param('id') id: string) {
        return this.adminsService.deleteAdmin(id);
    }
}
