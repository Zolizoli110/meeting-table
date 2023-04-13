import { IsIP, IsNumber } from "class-validator";

export class subscribeDto {
    @IsNumber()
    room_id: number;

    @IsIP()
    callbackIp: string;
}