let getServerURL = (protocol, serverInfo) => {
  let { host, domain, port } = serverInfo;

  if (domain) {
    return `${protocol}://${host}.${domain}.zohocorpin.com:${port}`;
  } else if (process.env.npm_config_server_domain) {
    return `${protocol}://${host}.${process.env.npm_config_server_domain}.zohocorpin.com:${port}`;
  }
  return `${protocol}://${host}:${port}`;

};

export default getServerURL;
