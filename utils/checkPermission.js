const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") {
    return
  }
  if (requestUser.uid === resourceUserId) {
    return
  }
  throw new Error("You are not authorized to access this route")
}

export { checkPermission }
