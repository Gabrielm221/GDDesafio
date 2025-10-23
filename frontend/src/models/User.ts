export interface User {
  id?: number;
  userType: string; 
  name: string; 
  email: string;
  password: string; 
  status?: boolean;
  createdAt?: Date;
  profilePictureUrl?: string;
  updatedAt?: Date;
}
