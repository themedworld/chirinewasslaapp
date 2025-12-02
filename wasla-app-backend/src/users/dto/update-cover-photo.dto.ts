// dto/update-cover-photo.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateCoverPhotoDto {
  @IsOptional()
  @IsString({ message: "L'URL de la photo de couverture doit être une chaîne de caractères" })
  coverPhoto?: string;
}
