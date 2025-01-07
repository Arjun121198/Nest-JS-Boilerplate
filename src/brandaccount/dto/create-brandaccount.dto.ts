export class CreateBrandAccountDTO {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly phone_number?: number;
  readonly address?: string;
  readonly bio?: string;
  readonly dob?: string;
  readonly profile_image?: string;
  readonly subscription_status?: boolean;
  readonly status?: 'Active' | 'Inactive';
  readonly device_type?: string;
  readonly os?: string;
  readonly browser?: string;
  readonly ip?: string;
  readonly user_agent?: string;
}
