const getValidCodyName = (codyName: string) => {
  return codyName.replace(/[^\w\sㄱ-ㅎ가-힣]/g, '').substring(0, 20);
};

export { getValidCodyName };
