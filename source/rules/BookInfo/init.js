((html) => {
  const detailDom = org.jsoup.Jsoup.parse(html).body();
  const seriesTitleDom = detailDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3.mt-3 div ul li.list-group-item.text-center a');

  // Return detail info if not a series
  if (seriesTitleDom.text() == '') return {
    name: detailDom.select('div.container > h3').text(),
    author: detailDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3.mt-3 ul:nth-child(1) li.list-group-item.text-center a span').text(),
    tags: detailDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3.mt-3 ul:nth-child(3) li:nth-child(2)').text().replaceAll('，', ','),
    lastChapter: detailDom.select('div.container > h3').text(),
    description: detailDom.select('#description').text(),
  };
  return getSeriesInfo(java, seriesTitleDom.attr('href').match(/\/s\/(\d+)/)[1]);
})(result);