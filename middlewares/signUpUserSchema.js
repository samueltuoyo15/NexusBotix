import joi from "joi"

const signUpValidationSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email invalid",
  }),
  password: joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),
  name: joi.string().required().messages({
    "string.empty": "Name is required.",
  }),
  role: joi.string().valid("free", "admin", "premium").optional(),
})

const validateSignUpInput = (req, res, next) => {
  const { error } = signUpValidationSchema.validate(req.body, {
    abortEarly: false,
  })
  if (error) {
    return res.status(422).json({
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    })
  }
  next()
}

export { validateSignUpInput }
