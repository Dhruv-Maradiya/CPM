type Module = "PROJECT" | "GROUP" | "TASK";

type User = "FACULTY" | "STUDENT";

type Role = "MEMBER" | "LEADER" | "GUIDE" | "HOD";

type RoleIndex = {
  role: Role;
  index: number;
};

const roles: readonly RoleIndex[] = [
  {
    role: "HOD",
    index: 1,
  },
  {
    role: "GUIDE",
    index: 2,
  },
  {
    role: "LEADER",
    index: 3,
  },
  {
    role: "MEMBER",
    index: 4,
  },
];

type Args = {
  roleRequired: Role;
  module?: Module;
  moduleId?: number;
  userId: number;
  userType: User;
};

const verifyRole = (args: Args): boolean => {
  return true;
};

export default verifyRole;
