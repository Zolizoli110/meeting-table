import { IsDateString, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export default class CreateReservationDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    resName: string;

    roomId: number;

    @IsNotEmpty()
    @IsDateString()
    dateStart: string;

    @IsNotEmpty()
    @IsDateString()
    dateEnd: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    description?: string;

    @IsEmail()
    arrangerEmail: string;

    userEmails?: string[];
}
