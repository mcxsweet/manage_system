const getters = {
  id: state => state.user.user.id,
  username: state => state.user.user.name,
  isadmin: state => state.user.user.isAdmin,
  teacherName: state => state.user.user.teacherName,
}
export default getters