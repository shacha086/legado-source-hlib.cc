((html) => {
  const infoDom = org.jsoup.Jsoup.parse(html).body();
  const novelIdMatch = html.match(/fetch\('\/comment\/n\/(\d+)'/);
  const seriesDom = infoDom.select('div.container div.row.flex-lg-row-reverse div.col-lg-3.mt-3 div ul li.list-group-item.text-center a');

  if (!novelIdMatch) return '';
  if (!seriesDom) return `/n/${novelIdMatch[1]}?p=1,{"webView":true}`;
  return `${seriesDom.attr('href')},{"webView":true}`;
})(result);