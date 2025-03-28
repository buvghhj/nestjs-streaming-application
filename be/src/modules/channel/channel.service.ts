import { Injectable } from '@nestjs/common';
import { ChannelAbstract } from './channel-abstract';

@Injectable()
export class ChannelService {

    public constructor(private readonly channelAbstract: ChannelAbstract) { }

    //Hiển thị các kênh có lượt đăng ký cao
    public async findRecommendedChannels() {

        return await this.channelAbstract.findRecommendedChannels()

    }

    //Tìm kiếm kênh theo tên
    public async findByUsername(username: string) {

        return await this.channelAbstract.findByUsername(username)

    }

    //Hiển thị số lượng người đăng ký kênh
    public async findFollowersCountByChannel(channelId: string) {

        return await this.channelAbstract.findFollowersCountByChannel(channelId)

    }

    //Hiển thị các gói thành viên đã đăng ký của kênh
    public async findSponsorByChannel(channelId: string) {

        return await this.channelAbstract.findSponsorByChannel(channelId)

    }

}
