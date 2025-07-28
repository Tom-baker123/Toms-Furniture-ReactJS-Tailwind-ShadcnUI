// Chuẩn hóa payload update user cho API
export default function buildUserUpdatePayload(user) {
    return {
        UserName: user.userName,
        Email: user.email,
        Gender: user.gender === "male" || user.gender === true, // true = male, false = female
        PhoneNumber: user.phoneNumber || null,
        UserAddress: user.userAddress || null,
        IsActive: !user.isActive,
        RoleId: user.roleId || (user.roleName === "Admin" ? 1 : 2),
    };
}
