import { UserResponseDto } from '../../common/dto/user/user-response.dto';
import { User } from './user.entity';

/**
 * Maps a User entity to an API response DTO.
 */
export function mapUserToResponse(user: User): UserResponseDto {
  return {
    id: user.id,
    firebaseUid: user.firebaseUid,
    email: user.email,
    createdAt: user.createdAt,
  };
}
