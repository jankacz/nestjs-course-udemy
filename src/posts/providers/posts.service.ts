import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);
    const tags = await this.tagsService.findMultipleTags(
      createPostDto.tags ?? [],
    );

    if (!author) {
      throw new Error('User not found');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      tags,
    });

    return await this.postsRepository.save(post);
  }

  public async findAll() {
    // const user = this.usersService.findOneById(userId);

    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
      },
    });

    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    // Find the Tags
    const tags: Tag[] = patchPostDto.tags
      ? await this.tagsService.findMultipleTags(patchPostDto.tags)
      : [];
    // Find the Posts

    const post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

    // Update the properties of the Post
    if (!post) {
      throw new Error('Post not found'); // Lub inny sposób obsługi błędu
    }

    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post?.content;
    post.status = patchPostDto.status ?? post?.status;
    post.postType = patchPostDto.postType ?? post?.postType;
    post.slug = patchPostDto.slug ?? post?.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post?.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post?.publishOn;

    // Assign the new tag
    post.tags = tags;

    // Save the post and return it

    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
