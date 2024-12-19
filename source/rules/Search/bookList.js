/**
 * Inputs:
 * {
 *   "id": string,
 *   "title": string,
 *   "tags": string[],
 *   "description": string,
 *   "author": string,
 *   "aName": string,
 *   "char": number,
 *   "like": number,
 *   "view": number,
 *   "ifLike": boolean,
 *   "series": string,
 *   "sTitle": string,
 * }[]
 */
((html) => {
  const jsonRaw = org.jsoup.Jsoup.parse(html).body().text();
  const json = JSON.parse(jsonRaw);
  const result = [];
  json.novels.forEach((novel) => {

    novel.tags = novel.tags.join(',');
    novel.url = `/n/${novel.id}?p=1,{"webView":true}`;

    result.push(novel);
  });
  return result;
})(result);