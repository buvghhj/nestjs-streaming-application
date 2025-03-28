export abstract class ChannelAbstract {

    abstract findRecommendedChannels(): Promise<any>

    abstract findByUsername(username: string): Promise<any>

    abstract findFollowersCountByChannel(channelId: string): Promise<number>

    abstract findSponsorByChannel(channelId: string): Promise<any>

}