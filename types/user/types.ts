export interface User {
  reforms: any;
  name: React.ReactNode;
    updated_at: string | number | Date;
	created_at: string | number | Date;
	accent_color: string;
	avatar: string;
	banner: string;
	banner_color: string;
	discriminator: string;
	email: string;
	flags: number;
	id: string;
	isAdmin: boolean;
	isModerator: boolean;
	locale: string;
	discord_id: string;
	mfa_enabled: boolean;
	premium_type: number;
	public_flags: number;
	token: string;
	username: string;
	verified: boolean;
	discordavatar: string;

 
} 

export interface UserData {
    user: any;
    email: string;
	id: string;
	name: string;
	discriminator: string;
	avatar: string;
	banner?: string;
	developer: boolean;
	moderator: boolean;
	botModerator: boolean;
	mfa_enabled: boolean;
	honorable: boolean;
	discordavatar: string;
}

export interface PageProps {
	user?: User;
}
