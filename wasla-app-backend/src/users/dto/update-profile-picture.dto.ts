// dto/update-profile-picture.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfilePictureDto {
  @IsOptional()
  @IsString({ message: "L'URL de la photo de profil doit être une chaîne de caractères" })
  profilePicture?: string;
}
