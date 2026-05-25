import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { IdParamDto } from '@/common/dtos/id-param.dto';
import { CreateAdminDto } from './dtos/create-admin.dto';

//Tipar tudo com os DTOs

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) { }

    @Get()
    listAdmins() {
        return this.adminsService.listAdmins();
    }

    @Get(':id')
    getAdmin(@Param('id') data: IdParamDto) {
        return this.adminsService.getAdmin(data);
    }

    @Post()
    createAdmin(@Body() data: CreateAdminDto) {
        return this.adminsService.createAdmin(data);
    }

    @Put(':id')
    updateAdmin(@Param('id') id: IdParamDto, @Body() data: UpdateAdminDto) {
        return this.adminsService.updateAdmin(id, data);
    }

    @Delete(':id')
    deleteAdmin(@Param('id') id: IdParamDto) {
        return this.adminsService.deleteAdmin(id);
    }
}
