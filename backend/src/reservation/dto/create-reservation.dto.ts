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
    dateStart: Date;

    @IsNotEmpty()
    @IsDateString()
    dateEnd: Date;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    description?: string;

    @IsEmail()
    arranger_email: string;

    guestEmails?: string[];
}
