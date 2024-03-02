import { PartialType } from "@nestjs/mapped-types";
import { CreateFreezerDto } from "./create-freezer.dto";

export class UpdateFreezerDto extends PartialType(CreateFreezerDto) {}