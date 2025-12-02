import { IsNotEmpty, IsEmail, IsString, IsOptional, IsIn, IsDateString, Length } from 'class-validator';
import { UserSignInDto } from './user-signin.dto';

export class UserSignupDto extends UserSignInDto {



  @IsNotEmpty({ message: "Le nom est requis" })
  @IsString({ message: "Le nom doit être une chaîne de caractères" })
  name: string;

  @IsOptional()
  @IsString({ message: "Le numéro de téléphone doit être une chaîne de caractères" })
  numtel?: string;

  @IsOptional()
  @IsString({ message: "L'URL de la photo de profil doit être une chaîne de caractères" })
  profilePicture?: string;

  @IsOptional()
  @IsDateString({}, { message: "La date de naissance doit être une date valide (YYYY-MM-DD)" })
  birthdate?: string;

  @IsOptional()
  @IsIn(['male', 'female'], { message: "Le genre doit être 'male' ou 'female'" })
  genre?: 'male' | 'female'; 
}

