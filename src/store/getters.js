const getters = {
  input: state => {
    return state.input;
  },
  isLogin: state => {
    return state.isLogin;
  },
  currentUser: state => {
    return state.currentUser;
  },
  userId: state => {
    return state.userId;
  }
};

export default getters;
