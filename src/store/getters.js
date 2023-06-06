const getters = {
    id:state=>state.user.user.id,
    username:state=>state.user.user.name,
    isadmin:state=>state.user.user.isAdmin,
  }
  export default getters