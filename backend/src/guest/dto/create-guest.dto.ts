import { IsBoolean, IsEmail, IsString } from "class-validator";

export class CreateGuestDto {
    @IsEmail()
    @IsString()
    guest_email: string;
}
