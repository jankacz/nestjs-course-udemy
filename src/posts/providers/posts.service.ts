import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  public async createPost(createPostDto: CreatePostDto) {
    let newPost = this.postsRepository.create(createPostDto);
    newPost = await this.postsRepository.save(newPost);

    return newPost;
  }

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    console.log(userId);
    return [
      {
        user,
        title: 'Test Title',
        content: 'Test Content',
      },
      {
        user,
        title: 'Test Title 2',
        content: 'Test Content 2',
      },
    ];
  }
}
