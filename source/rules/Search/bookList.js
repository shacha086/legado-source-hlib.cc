((html) => {
  const jsonRaw = org.jsoup.Jsoup.parse(html).body().text();
  const json = JSON.parse(jsonRaw);
  const result = [];
  json.novels.forEach((novel) => {

    novel.tags = novel.tags.join(',');
    novel.url = `https://hlib.cc/n/${novel.id}?p=1,{"webView":true}`;

    result.push(novel);
  });
  return result;
})(result);