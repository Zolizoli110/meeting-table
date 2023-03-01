import { Reservation } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export default class CreateMeetingRoomDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}