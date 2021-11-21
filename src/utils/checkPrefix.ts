export default (chatText: String): Boolean => {
  return Boolean(chatText.match(/^ *\/pe */));
};
