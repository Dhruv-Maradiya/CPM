import bcrypt from "bcrypt";

const saltRounds = 10;

const hash = async (plainPass: string) => {
  const hashPass = await bcrypt.hash(plainPass, saltRounds);
  return hashPass;
};

const verify = async (plainPass: string, hashPass: string) => {
  return await bcrypt.compare(plainPass, hashPass);
};

export { hash, verify };
