export enum ApiResponseMessages {
    INVITE_NEW_USER = "User Invited",
    USER_SIGNED_UP_ALREADY = "User already a member of the system",
    INVALID_TOKEN = "Token expired",
    TOKEN_VERIFIED = "Token Verified",
    USER_SIGNED_UP = "User successfully signed up",
    USER_NOT_INVITED = "User is not invited or not a member of system",
    PASSWORD_RESET_LINK_SENT= "Password reset link is sent to the email",
    USER_NOT_SIGNEDUP = "User has not signed up, Please sign up first",
    PASSWORD_RESET="Password Reset Successful",
    LOGIN_SUCCESSFUL="User login successful",
    LOGIN_UNSUCCESSFUL="Either email or password doesn't match"
}