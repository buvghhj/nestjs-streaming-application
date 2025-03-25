import { DeviceInfo, LocationInfo, SessionMetadata } from "@/src/shared/types/session-metadata.types";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
class LocationModel implements LocationInfo {

    @Field(() => String)
    country: string

    @Field(() => String)
    city: string

    @Field(() => Number)
    latidute: number

    @Field(() => Number)
    longtitude: number

}

@ObjectType()
class DeviceModel implements DeviceInfo {

    @Field(() => String)
    public browser: string;

    @Field(() => String)
    public os: string;

    @Field(() => String)
    public type: string;

}

@ObjectType()
class SessionMetadataModel implements SessionMetadata {

    @Field(() => LocationModel)
    public location: LocationModel

    @Field(() => DeviceModel)
    public device: DeviceModel

    @Field(() => String)
    public ip: string

}

@ObjectType()
export class SessionModel {

    @Field(() => ID)
    public id: string

    @Field(() => String)
    public userId: string

    @Field(() => SessionMetadataModel)
    public metadata: SessionMetadataModel

    @Field(() => String)
    public createdAt: string
}