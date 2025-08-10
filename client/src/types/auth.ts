// client/src/types/auth.ts
export type Role = 'CUSTOMER' | 'FACTORY' | 'LOGISTIC'

export interface User {
  id: number
  email: string
  role: Role
  name?: string | null
  location?: string | null
  countryId?: number
  regionId?: number | null
}
