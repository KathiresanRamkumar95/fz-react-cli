let getServerURL = (protocol, serverInfo) => {
  let { host, locale, port } = serverInfo;

  if (locale) {
    return `${protocol}://${host}.${locale}.zohocorpin.com:${port}`;
  }else if(process.env.npm_config_server_locale){
    return `${protocol}://${host}.${process.env.npm_config_server_locale}.zohocorpin.com:${port}`;
  }
  return `${protocol}://${host}:${port}`;

};

export default getServerURL;
