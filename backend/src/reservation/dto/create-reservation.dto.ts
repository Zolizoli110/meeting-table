import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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

    @IsString()
    @IsOptional()
    RRULE_frequency?: string;

    @IsDateString()
    @IsOptional()
    RRULE_until?: string;

    @IsNumber()
    @IsOptional()
    RRULE_count?: number;

    @IsNumber()
    @IsOptional()
    RRULE_interval?: number;

    @IsArray()
    @IsOptional()
    RRULE_byDay?: string[];

    @IsArray()
    @IsOptional()
    RRULE_byMonth?: number[];

    @IsArray()
    @IsOptional()
    RRULE_byMonthDay?: number[];

    EXRULE_frequency?: string;

    @IsNumber()
    @IsOptional()
    EXRULE_count?: number;

    @IsDateString()
    @IsOptional()
    EXRULE_until?: string;

    @IsNumber()
    @IsOptional()
    EXRULE_interval?: number;

    @IsArray()
    @IsOptional()
    EXRULE_byDay?: string[];

    @IsArray()
    @IsOptional()
    EXRULE_byMonth?: number[];

    @IsArray()
    @IsOptional()
    EXRULE_byMonthDay?: number[];

    @IsArray()
    @IsOptional()
    RDATE_date?: string[];

    @IsArray()
    @IsOptional()
    EXDATE_date?: string[];
}
