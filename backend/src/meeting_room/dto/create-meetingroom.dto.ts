import { IsNotEmpty, IsString } from "class-validator";

export default class CreateMeetingRoomDto {
    @IsNotEmpty()
    @IsString()
    room_id: string;
}
