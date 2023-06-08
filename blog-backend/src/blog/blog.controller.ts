import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';

@Controller('blog')
export class BlogController {
    constructor(private blogService: BlogService) {}

    //submit a post
    @Post('/post')
    async addPost() {}

    //fetch a post by id
    @Get('post/:postID')
    async getPost() {}

    //fetch all posts
    @Get('posts')
    async getPosts() {}
}
