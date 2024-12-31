import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string({
      required_error: "Current password is required",
    })
    .min(6, {
      message: "Current password must be at least 6 characters",
    }),
  newPassword: z
    .string({
      required_error: "New password is required",
    })
    .min(6, {
      message: "New password must be at least 6 characters",
    })
    .refine((val, ctx) => {
      if (val === ctx.parent.oldPassword) {
        return false;
      }
      return true;
    }, {
      message: "New password must be different from the old password",
    }),
});