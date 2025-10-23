import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    @Inject('REDIS_CLIENT')
    private redisClient: Redis,
  ) {}

  async create(userId: string, createNoteDto: CreateNoteDto) {
    const note = this.noteRepository.create({
      ...createNoteDto,
      userId,
      tags: createNoteDto.tags || [],
    });

    const savedNote = await this.noteRepository.save(note);

    // Invalidate cache for this user
    await this.invalidateUserCache(userId);

    return savedNote;
  }

  async findAll(userId: string, tags?: string): Promise<Note[]> {
    const cacheKey = `notes:${userId}:${tags || 'all'}`;

    // Try to get from cache
    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as Note[];
    }

    // Build query
    const queryBuilder = this.noteRepository
      .createQueryBuilder('note')
      .where('note.userId = :userId', { userId })
      .orderBy('note.updatedAt', 'DESC');

    // Filter by tags if provided
    if (tags) {
      const tagArray = tags.split(',').map((tag) => tag.trim());
      tagArray.forEach((tag, index) => {
        queryBuilder.andWhere(`note.tags LIKE :tag${index}`, {
          [`tag${index}`]: `%${tag}%`,
        });
      });
    }

    const notes = await queryBuilder.getMany();

    // Cache the result for 5 minutes
    await this.redisClient.setex(cacheKey, 300, JSON.stringify(notes));

    return notes;
  }

  async findOne(userId: string, id: string) {
    const note = await this.noteRepository.findOne({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(userId: string, id: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.findOne(userId, id);

    Object.assign(note, updateNoteDto);

    const updatedNote = await this.noteRepository.save(note);

    // Invalidate cache for this user
    await this.invalidateUserCache(userId);

    return updatedNote;
  }

  async remove(userId: string, id: string) {
    const note = await this.findOne(userId, id);

    await this.noteRepository.remove(note);

    // Invalidate cache for this user
    await this.invalidateUserCache(userId);

    return { message: 'Note deleted successfully' };
  }

  private async invalidateUserCache(userId: string) {
    const keys = await this.redisClient.keys(`notes:${userId}:*`);
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }
}
