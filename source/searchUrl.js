(() => {
  const params = {
    id: '',
    token: '',
    query: key,
    p: page,
  };
  const searchPath = `/search/?query=${java.encodeURI(params.query)}&p=${params.p}`;
  const searchHTML = java.ajax(`https://hlib.cc${searchPath}`);

  params.id = String(searchHTML).match(/id:\s'([a-zA-Z-_\d]+)',/)[1];
  params.token = java.md5Encode(`${params.id}search${searchPath}`);

  return `https://hlib.cc/api/search/,${JSON.stringify({
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
    webView: true,
  })}`;
})();