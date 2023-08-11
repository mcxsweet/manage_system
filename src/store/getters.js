const getters = {
  id: state => state.user.id,
  username: state => state.user.name,
  isadmin: state => state.user.isAdmin,
  teacherName: state => state.user.teacherName,
  department: state => state.user.department,
}
export default getters