import { PartialType } from "@nestjs/mapped-types";
import { Reservation } from "@prisma/client";
import CreateMeetingRoomDto from "./create-meetingroom.dto";

export default class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) { };