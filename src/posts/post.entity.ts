import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PostType } from './enums/postType.enum';
import { PostStatus } from './enums/postStatus.enum';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'enum', enum: PostType, nullable: false })
  postType: PostType;

  @Column({ type: 'varchar', nullable: false, unique: true })
  slug: string;

  @Column({ type: 'enum', enum: PostStatus })
  status: PostStatus;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({ type: 'varchar', nullable: true })
  featuredImageUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  publishOn?: Date;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column('json', { nullable: true })
  metaOptions?: Record<string, any>[];
}
