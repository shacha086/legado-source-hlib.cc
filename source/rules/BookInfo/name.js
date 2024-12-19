((html) => {
  const detailDom = org.jsoup.Jsoup.parse(html).body();
  const chapterTitle = detailDom.select('div.container h3').text();
  const seriesTitle = detailDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3.mt-3 div ul li.list-group-item.text-center a').text();

  if (seriesTitle != '') return seriesTitle;
  return chapterTitle;
})(result);