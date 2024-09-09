export const getMarkdownImgUrl = (md: string) => {
  const reg = /!\[.*\]\((.*)\)/;
  const result = reg.exec(md);
  return result ? result[1] : "";
};

export const toMarkdownImgUrl = (url: string) => {
  return `![img](${url})`;
};
