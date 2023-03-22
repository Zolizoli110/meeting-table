import { IsBoolean, IsEmail, IsString } from "class-validator";

export class CreateGuestDto {
    @IsEmail()
    @IsString()
    user_email: string;

    @IsString()
    role_name: string;
}
