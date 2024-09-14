import z from "zod";

export const UserLoginSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(6, "Password should atleast more than 6 characters."),
});

export const UserSignupSchema = z
	.object({
		username: z.string().min(2, "Required"),
		firstName: z.string().min(2, "Required"),
		lastName: z.string().min(2, "Required"),
		email: z.string().email(),
		password: z
			.string()
			.min(6, "Password should atleast more than 6 characters."),
		repassword: z
			.string()
			.min(6, "Password should atleast more than 6 characters."),
	})
	.refine((data) => data.password === data.repassword, {
		message: "Password doesn't match!",
		path: ["repassword"],
	});

export type TUserLogin = z.infer<typeof UserLoginSchema>;
export type TUserSignup = z.infer<typeof UserSignupSchema>;
