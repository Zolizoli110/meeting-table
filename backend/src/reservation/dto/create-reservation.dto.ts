import { Guest, MeetingRoom, Prisma } from "@prisma/client";
import { IsDate, IsNotEmpty, isString, IsString, MaxLength, MinLength } from "class-validator";

export default class CreateReservationDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    resName: string;

    @IsNotEmpty()
    @IsString()
    roomName: string;

    @IsNotEmpty()
    @IsDate()
    dateStart: Date;

    @IsNotEmpty()
    @IsDate()
    dateEnd: Date;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    description?: string;
}
