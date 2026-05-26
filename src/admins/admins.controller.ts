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

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) { }

    @Get()
    listAdmins() {
        return this.adminsService.listAdmins();
    }

    @Get(':id')
    getAdmin(@Param() params: IdParamDto) {
        return this.adminsService.getAdmin(params);
    }

    @Post()
    createAdmin(@Body() data: CreateAdminDto) {
        return this.adminsService.createAdmin(data);
    }

    @Put(':id')
    updateAdmin(
        @Param() params: IdParamDto,
        @Body() data: UpdateAdminDto
    ) {
        return this.adminsService.updateAdmin(params, data);
    }

    @Delete(':id')
    deleteAdmin(@Param() params: IdParamDto) {
        return this.adminsService.deleteAdmin(params);
    }
}
