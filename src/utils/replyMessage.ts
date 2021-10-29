export const rootMessage = (participantId: string): string => {
  return `Halo, @${participantId.split('@')[0]}`;
};

export const wrongCommands = (): string => {
  return `Maaf, command salah`;
};
