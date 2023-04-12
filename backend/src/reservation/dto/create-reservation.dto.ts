import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export default class CreateReservationDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    resName: string;

    @IsNotEmpty()
    @IsEmail()
    roomId: string;

    @IsNotEmpty()
    @IsDateString()
    dateStart: string;

    @IsNotEmpty()
    @IsDateString()
    dateEnd: string;

    @IsNotEmpty()
    @IsString()
    timeZone: string;

    @IsString()
    @MinLength(5)
    @MaxLength(200)
    description?: string;

    @IsEmail()
    @IsOptional()
    arrangerEmail?: string;

    @IsArray()
    @IsOptional()
    userEmails?: string[];
}
