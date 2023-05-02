import { PartialType } from "@nestjs/mapped-types";
import CreateMeetingRoomDto from "./create-meetingroom.dto";

export default class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) { };
