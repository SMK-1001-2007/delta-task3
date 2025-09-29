export const validateEmailInput = (req, res, next) => {
  const { email } = req.body;
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!email || !regex.test(email)) {
    return res.status(400).json({ message: "Invalid or missing email address" });
  }

  next();
};
