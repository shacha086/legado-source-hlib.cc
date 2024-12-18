((res) => {
  const json = JSON.parse(res);
  const result = [];
  json.novels.forEach((novel) => {

    novel.tags = novel.tags.join(',');
    novel.url = `https://hlib.cc/n/${novel.id}?p=1`;

    result.push(novel);
  });
  return result;
})(result);