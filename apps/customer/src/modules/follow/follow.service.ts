import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Follower, Customer } from "@app/common";
import { Model } from "mongoose";
import { RpcException } from "@nestjs/microservices";
import { I18nService } from "nestjs-i18n";
import { IGetFollowers } from "./follow.interface";

@Injectable()
export class FollowService {
    constructor(
        @InjectModel(Follower.name) private followerModel: Model<Follower>,
        @InjectModel(Customer.name) private customerModel: Model<Customer>,
        private readonly i18n: I18nService,
    ) { }

    async getFollowers(data: IGetFollowers, lang: string) {
        const { userId, limit, page } = data;
        const skip = (page - 1) * limit;

        // Tìm bản ghi của userId và lấy danh sách `followers`
        const followerData = await this.followerModel.findOne({ userId }).select("followers");

        if (!followerData || !followerData.followers.length) {
            return {
                result: {
                    followers: [],
                    hasMore: false
                },
                message: this.i18n.t('error.followersNotFound', { lang }),
            };
        }

        // Cắt mảng `followers` theo `skip` và `limit`
        const paginatedFollowers = followerData.followers.slice(skip, skip + limit);

        // Lấy thông tin chi tiết của các user trong `followers`
        const followersInfo = await this.customerModel.find({
            _id: { $in: paginatedFollowers },
        }).select('_id username avatar.url fullName');

        // Kiểm tra xem còn bản ghi nào chưa lấy không
        const hasMore = (skip + limit) < followerData.followers.length;

        return {
            result: {
                followers: followersInfo,
                hasMore
            },
            message: this.i18n.t('follow.followersRetrieved', { lang }),
        };
    }

    async getFollowing(data: IGetFollowers, lang: string) {
        const { userId, limit, page } = data;
        const skip = (page - 1) * limit;

        // Tìm bản ghi của userId và lấy danh sách `following`
        const followingData = await this.followerModel.findOne({ userId }).select("following");

        if (!followingData || !followingData.following.length) {
            return {
                result: { followings: [], hasMore: false },
                message: this.i18n.t('error.followingNotFound', { lang }),
            };
        }

        // Cắt mảng `following` theo `skip` và `limit`
        const paginatedFollowing = followingData.following.slice(skip, skip + limit);

        // Lấy thông tin chi tiết của các user trong `following`
        const followingInfo = await this.customerModel.find({
            _id: { $in: paginatedFollowing },
        }).select('_id username avatar.url fullName');

        // Kiểm tra xem còn bản ghi nào chưa lấy không
        const hasMore = (skip + limit) < followingData.following.length;

        return {
            result: {
                followings: followingInfo,
                hasMore,
            },
            message: this.i18n.t('follow.followingRetrieved', { lang }),
        };
    }


    async follow(userId: string, followerId: string, lang: string) {
        if (userId === followerId) {
            throw new RpcException(
                {
                    statusCode: 400,
                    message: this.i18n.t('error.cannotFollowYourself', { lang })
                });
        }
        const followingData = await this.followerModel.findOneAndUpdate(
            { userId },
            { $addToSet: { following: followerId } },
            { new: true, upsert: true },
        ).populate('following');

        await this.followerModel.findOneAndUpdate(
            { userId: followerId },
            { $addToSet: { followers: userId } },
            { new: true, upsert: true },
        )

        return {
            success: true,
            result: followingData.following,
            message: this.i18n.t('follow.followerAdded', { lang }),
        };
    }

    async unfollow(userId: string, followerId: string, lang: string) {
        if (userId === followerId) {
            throw new RpcException(
                {
                    statusCode: 400,
                    message: this.i18n.t('error.cannotUnfollowYourself', { lang })
                });
        }
        const followingData = await this.followerModel.findOneAndUpdate(
            { userId },
            { $pull: { following: followerId } },
            { new: true },
        );

        await this.followerModel.findOneAndUpdate(
            { userId: followerId },
            { $pull: { followers: userId } },
            { new: true },
        )

        if (!followingData) {
            throw new RpcException(this.i18n.t('error.followersNotFound', { lang }));
        }

        return {
            success: true,
            result: followingData.following,
            message: this.i18n.t('follow.followerRemoved', { lang }),
        };
    }
}
