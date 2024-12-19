/**
 * Output:
 * {
 *   "title": string,
 *   "description": string,
 *   "isSeriesName": boolean,
 *   "char": number,
 *   "url": string,
 * }[]
 */
function getSeriesInfoByPage(java, seriesID, page) {
  if (!seriesID || seriesID == '') return [];
  const seriesPath = `/s/${seriesID}?p=${parseInt(page || 1)}`;
  const seriesHTML = java.ajax(`https://hlib.cc${seriesPath},{"webView":true}`);
  const seriesDom = org.jsoup.Jsoup.parse(seriesHTML).body();
  const seriesName = seriesDom.select('div.container > h3').text();
  const novels = [];

  // Parse novels info
  const novelsDom = seriesDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-9 ul > *');
  if (!novelsDom || novelsDom.length <= 0) return novels;

  novelsDom.forEach((novelDom) => {
    const titleCurrent = novelDom.select('div:nth-child(2) > a').text();
    const charCurrent = parseInt(novelDom.select('div:nth-child(3) > span:nth-child(2)').text().replaceAll(',', '').replace('字', ''));
    novels.push({
      title: titleCurrent,
      description: novelDom.select('div:nth-child(5) span').text(),
      isSeriesName: titleCurrent == seriesName,
      char: charCurrent,
      url: `${novelDom.select('div:nth-child(2) > a').attr('href')}?p=1,{"webView":true}`
    });
  });
  return novels;
}

function getFakeSeries(java, novelId) {
  if (!novelId || novelId == '') return [];
  const novelPath = `/n/${novelId}?p=1`;
  const novelHTML = java.ajax(`https://hlib.cc${novelPath},{"webView":true}`);
  const novelDom = org.jsoup.Jsoup.parse(novelHTML).body();

  return [{
    title: novelDom.select('div.container h3').text(),
    description: novelDom.select('#description').text(),
    isSeriesName: true,
    char: null,
    url: `/n/${novelId}?p=1,{"webView":true}`
  }];
}

function getSeries(type, id) {
  const { java } = this;
  if (type == 'novel') return getFakeSeries(java, id);

  const result = [];
  let currentPage = 1;
  let isFinished = false;
  while (!isFinished) { // TODO: Infinite loop bug
    const seriesResult = getSeriesInfoByPage(java, id, currentPage);
    if (seriesResult.length < 30) isFinished = true;

    seriesResult.forEach((novel) => result.push(novel));
    currentPage++;
  };

  return result;
}
