export const getOnlyGroupId = (jid: string): string => {
  const splitted = jid.split('-');
  if (splitted.length <= 1) {
    return jid;
  }
  return splitted[1];
};
