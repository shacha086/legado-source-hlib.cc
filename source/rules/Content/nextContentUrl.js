((html) => {
  const htmlParsed = org.jsoup.Jsoup.parse(html);
  const novelIdMatch = html.match(/fetch\('\/comment\/n\/(\d+)'/);
  const nextPageBtn = htmlParsed.select('#content nav .btn-group > button[onclick]:last-child');
  if (!novelIdMatch || !nextPageBtn) return '';

  const nextPageFn = String(nextPageBtn.attr('onclick'));
  if (!nextPageFn) return '';

  const novelId = novelIdMatch[1];
  const nextPageFnParams = nextPageFn.match(/rp\('([a-zA-Z-_\d]+)',\s(\d+)\);/);
  if (!novelId || !nextPageFnParams) return '';

  return `https://hlib.cc/n/${novelId}?${nextPageFnParams[1]}=${nextPageFnParams[2]},{"webView":true}`;
})(result);