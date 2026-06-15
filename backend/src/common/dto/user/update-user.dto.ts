import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/** Payload for updating an existing user record. */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
