let getServerURL = (serverInfo, protocol) => {
  let { host, domain, port } = serverInfo;

  if (domain) {
    return `${
      protocol ? `${protocol}:` : ''
    }//${host}.${domain}.zohocorpin.com:${port}`;
  }
  return `${protocol ? `${protocol}:` : ''}//${host}:${port}`;
};

export default getServerURL;
