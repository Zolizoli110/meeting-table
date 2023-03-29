import { HttpStatus } from "@nestjs/common/enums"
import { HttpException } from "@nestjs/common/exceptions"
import { Prisma } from "@prisma/client";

export enum PrismaErrors {
    UNIQUE_CONTRAINT_FAILED = "P2002",
    INVALID_FIELD_TYPE = "P2005",
    RECORD_DOESNT_EXIST = "P2025",
    RELATION_VIOLATION = "P2014"
}

const PrismaErrorHandler = (error) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case PrismaErrors.RECORD_DOESNT_EXIST:
                return new HttpException('specified record doesn\'t exist', HttpStatus.NOT_FOUND);
            case PrismaErrors.INVALID_FIELD_TYPE:
                return new HttpException('one or more fields are of invalid type', HttpStatus.BAD_REQUEST);
            case PrismaErrors.UNIQUE_CONTRAINT_FAILED:
                return new HttpException('given data is in conflict with existing data', HttpStatus.CONFLICT);
            case PrismaErrors.RELATION_VIOLATION:
                console.log(error)
                return new HttpException('data already exists for specified record', HttpStatus.BAD_REQUEST)
            default:
                return new HttpException('an unknown error occured, please try again later', HttpStatus.I_AM_A_TEAPOT)
        }
    }
    return new HttpException(error, HttpStatus.I_AM_A_TEAPOT)
}
export default PrismaErrorHandler;