export let getQuery = function() {
  let query = {};
  try {
    let matches = [];
    let url = window.location.href;
    url = url.replace("?sign=", "&sign=");
    url = url.replace("%3Fsign%3D", "&sign=");
    url = url.replace("%3fsign%3d", "&sign=");
    url = url.replaceAll(/\?/g, "&");
    url = url.replaceAll(/#/g, "&");
    url += "&";
    matches = url.match(/([^&]*=[^&]*)/g);
    if (matches) {
      for (let param of matches) {
        let [key, val] = param.split("=");
        query[key] = val;
      }
    }
    return query;
  } catch (err) {
    throw err;
  }
};
