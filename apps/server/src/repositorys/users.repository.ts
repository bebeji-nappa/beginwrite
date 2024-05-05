import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { FileUpload } from 'graphql-upload-minimal';
import { S3Service } from 'src/applications/services/s3.service';
import { User } from 'src/models/users.model';

import type { ReadStream } from 'fs';
import type { UpdateResult, Repository } from 'typeorm';

export type CreateUserArgs = {
  name: string;
  email: string;
  hash: string;
};

export type AuthUserArgs = {
  email: string;
  password: string;
};

export type UpdateUserProfileArgs = {
  id: string;
  displayName: string;
  bio?: string;
  avatar?: string;
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepostiory: Repository<User>,
    private s3Service: S3Service,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepostiory.find();
  }

  findById(id: string): Promise<User> {
    return this.usersRepostiory.findOne({ where: { id: Number(id) } });
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepostiory.findOne({ where: { email } });
  }

  createUser(data: CreateUserArgs): Promise<User> {
    const user = new User();
    user.uuid = crypto.randomUUID();
    user.email = data.email;
    user.hash = data.hash;
    user.name = data.name;
    user.createdAt = Date.now();
    user.updatedAt = Date.now();
    return this.usersRepostiory.save(user);
  }

  async authUser(data: AuthUserArgs): Promise<User> {
    const user = await this.findByEmail(data.email);
    if (!user) throw new Error('User not found');
    const isPasswordValid = await bcrypt.compare(data.password, user.hash);
    if (!isPasswordValid) throw new Error('Invalid password');
    return user;
  }

  updateUserProfile(data: UpdateUserProfileArgs): Promise<UpdateResult> {
    return this.usersRepostiory.update(
      { id: Number(data.id) },
      {
        displayName: data.displayName,
        bio: data.bio,
        avatar: data.avatar,
        updatedAt: Date.now(),
      },
    );
  }

  updateUserAccessToken({ id, token }): Promise<UpdateResult> {
    return this.usersRepostiory.update(
      { id: Number(id) },
      {
        accessToken: token,
      },
    );
  }

  // 型定義すると file データが取れないので、any にしている
  async uploadProfileAvatar(
    file: any,
    id: number,
    uuid: string,
  ): Promise<UpdateResult> {
    const { createReadStream } = file.file;
    console.log(file.file);
    // MEMO: 拡張子は jpeg に固定
    const filename = `${uuid}.png`;
    const stream = await this.loadStream(createReadStream());
    const s3Response = await this.s3Service.uploadFile(filename, stream);
    console.log(s3Response);
    return this.usersRepostiory.update(
      { id: id },
      {
        avatar: `${process.env.AWS_ENDPOINT}/${process.env.AWS_BUCKET}/${filename}`,
        updatedAt: Date.now(),
      },
    );
  }

  private loadStream(stream: ReadStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
