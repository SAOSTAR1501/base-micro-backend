import { Controller } from "@nestjs/common";
import { FollowService } from "./follow.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { IGetFollowers } from "./follow.interface";

@Controller()
export class FollowController {
    constructor(
        private readonly followService: FollowService
    ) { }

    @MessagePattern('get_followers')
    async getFollowers(@Payload() { body, lang }: { body: IGetFollowers; lang: string }) {
        return this.followService.getFollowers(body, lang);
    }

    @MessagePattern('get_following')
    async getFollowing(@Payload() { body, lang }: { body: IGetFollowers; lang: string }) {
        return this.followService.getFollowing(body, lang);
    }

    @MessagePattern('follow')
    async addFollower(@Payload() { body, lang }: { body: { userId: string; followerId: string }; lang: string }) {
        const { userId, followerId } = body;
        return this.followService.follow(userId, followerId, lang);
    }

    @MessagePattern('unfollow')
    async removeFollower(@Payload() { body, lang }: { body: { userId: string; followerId: string }; lang: string }) {
        const { userId, followerId } = body;
        return this.followService.unfollow(userId, followerId, lang);
    }
}
