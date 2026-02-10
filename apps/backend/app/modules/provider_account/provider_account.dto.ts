export interface ProviderAccountDto {
  id: number
  email: string
  host: string
  port: number
  useSsl: boolean
  lastSyncAt: string | null
  createdAt: string
  updatedAt: string
}
