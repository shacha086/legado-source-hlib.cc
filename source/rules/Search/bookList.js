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
 *   "sTitle"?: string,
 * }[]
 */
((html) => {
  const jsonRaw = org.jsoup.Jsoup.parse(html).body().text();
  const json = JSON.parse(jsonRaw);
  const result = [];
  json.novels.forEach((novel) => {
    // TODO: Make this faster
    // if (!novel.series) {
    //   novel.info = {
    //     name: novel.title,
    //     author: novel.aName,
    //     tags: novel.tags.join(','),
    //     lastChapter: novel.title,
    //     description: novel.description,
    //   };
    // } else {
    //   novel.info = getSeriesInfo(java, novel.series);
    // }
    const newNovel = {
      name: novel.sTitle ? novel.sTitle : novel.title,
      author: novel.aName,
      tags: novel.tags.join(','),
      lastChapter: novel.title, // TODO: Get last chapter
      description: novel.description, // TODO: Get book description
      url: `/n/${novel.id}?p=1,{"webView":true}`,
    };
    result.push(newNovel);
  });
  return result;
})(result);