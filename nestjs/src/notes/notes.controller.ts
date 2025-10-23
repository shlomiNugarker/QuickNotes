import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body(ValidationPipe) createNoteDto: CreateNoteDto,
  ) {
    return this.notesService.create(req.user.id, createNoteDto);
  }

  @Get()
  async findAll(@Request() req: RequestWithUser, @Query('tags') tags?: string) {
    return this.notesService.findAll(req.user.id, tags);
  }

  @Get(':id')
  async findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.notesService.findOne(req.user.id, id);
  }

  @Put(':id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body(ValidationPipe) updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(req.user.id, id, updateNoteDto);
  }

  @Delete(':id')
  async remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.notesService.remove(req.user.id, id);
  }
}
