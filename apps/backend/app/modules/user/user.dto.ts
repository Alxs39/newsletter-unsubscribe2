export interface UserDto {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: string
  banned: boolean | null
  banReason: string | null
  banExpires: string | null
  createdAt: string
  updatedAt: string
}
