/**
 * Output:
 * {
 *   "sName": string,
 *   "sTags": string,
 *   "sDescription": string,
 *   "author": string,
 *   "charTotal": number,
 *   "novels": {
 *     "title": string,
 *     "char": number,
 *     "url": string,
 *   }[],
 *   "nextPageUrl": string,
 * }
 */
function getSeriesInfoByPage(seriesID, page) {
  const { java } = this;
  if (!seriesID || seriesID == '') return null;
  const seriesPath = `/s/${seriesID}?p=${page || 1}`;
  const seriesHTML = java.ajax(`https://hlib.cc${seriesPath}`);
  const seriesDom = org.jsoup.Jsoup.parse(seriesHTML).body();
  const result = {
    sName: seriesDom.select('div.container > h3').text(),
    sTags: seriesDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3 ul:nth-child(4) li:nth-child(2)').text().replaceAll('，', ','),
    sDescription: seriesDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3 ul:nth-child(2) li:nth-child(2)').text() || '',
    author: seriesDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3 ul:nth-child(1) li.list-group-item.text-center a').text(),
    charTotal: 0,
    novels: [],
    nextPageUrl: `/s/${seriesID}?p=${(page || 1) + 1}`,
  };

  // Parse novels info
  const novelsDom = seriesDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-9 ul > *');
  novelsDom.forEach((novelDom) => {
    const charCurrent = parseInt(novelDom.select('div:nth-child(3) > span:nth-child(2)').text().replaceAll(',', '').replace('字', ''));
    result.novels.push({
      title: novelDom.select('div:nth-child(2) > a').text(),
      char: charCurrent,
      url: `${novelDom.select('div:nth-child(2) > a').attr('href')}?p=1`
    });
    result.charTotal += charCurrent;
  });

  return result;
}
