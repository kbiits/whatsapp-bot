export default (chatText: String): Boolean => {
  return chatText.startsWith('/bot');
};
