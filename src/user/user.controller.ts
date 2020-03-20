import { Controller, UseGuards, Get, Post, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { UserId } from '../decorators/user-id.decorator';
import { User } from '../model/user.model';
import { UserRole } from '../enum/user.enum';
import { Roles } from '../decorators/roles.decorator';
import { EvidenceDTO } from 'src/model/evidence.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { StatusGuard } from '../guards/status.guard';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Roles(UserRole.Admin)
    @Get()
    find(): Promise<User[]> {
        return this.service.find();
    }

    @Roles(UserRole.Admin, UserRole.Tutor, UserRole.Student)
    @Get('me')
    me(@UserId() id: string): Promise<User> {
        return this.service.findById(id);
    }

    @Roles(UserRole.Admin, UserRole.Tutor, UserRole.Student)
    @Get('id/:id')
    findById(@Param('id') id: string): Promise<User> {
        return this.service.findById(id);
    }

    @Roles(UserRole.Tutor)
    @Post('updateEvidence')
    updateEvidence(@UserId() id: string, @Body() evidenceDTO: EvidenceDTO) {
        return this.service.update(id, evidenceDTO);
    }
}
