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
  const novels = [];

  // Parse novels info
  const novelsDom = seriesDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-9 ul > *');
  if (!novelsDom || novelsDom.length <= 0) return novels;

  novelsDom.forEach((novelDom) => {
    const charCurrent = parseInt(novelDom.select('div:nth-child(3) > span:nth-child(2)').text().replaceAll(',', '').replace('字', ''));
    novels.push({
      title: novelDom.select('div:nth-child(2) > a').text().match(/#(\d+)\s(.+)/)[2],
      description: novelDom.select('div:nth-child(5) span').text(),
      isSeriesName: false,
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

function getSeries(java, type, id) {
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

/**
 * Output:
 * {
 *   "name": string,
 *   "author": string,
 *   "tags": string
 *   "lastChapter": string,
 *   "description": string,
 * }
 */
function getSeriesInfo(java, seriesID) {
  const seriesPath = `/s/${seriesID}?p=1}`;
  const seriesHTML = java.ajax(`https://hlib.cc${seriesPath},{"webView":true}`);
  const seriesDom = org.jsoup.Jsoup.parse(seriesHTML).body();
  const seriesChapters = getSeries(java, 'series', seriesID);

  return {
    name: seriesDom.select('div.container h3').text(),
    author: seriesDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3 ul:nth-child(1) li.list-group-item.text-center a').text(),
    tags: seriesDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3 ul:nth-child(4) li:nth-child(2)').text().replaceAll('，', ','),
    lastChapter: seriesChapters[seriesChapters.length - 1].title,
    description: seriesDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3 ul:nth-child(2) li:nth-child(2)').text(),
  }
}
