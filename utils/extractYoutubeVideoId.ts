export function extractYouTubeVideoId(url: string): string | null {
  
  //const url2 = "put sample url for test";
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  
  //const exp = (match && match[7].length == 11) ? match[7] : null
  //console.log(exp);
  return (match && match[7].length == 11) ? match[7] : null;
  
  // const matched =
  //   /^https?:\/\/(www\.)?youtube\.com\/watch\?(.*&)?v=(?<videoId>[^&]+)/.exec(
  //     url
  //   ) ??
  //   /^https?:\/\/youtu\.be\/(?<videoId>[^?]+)/.exec(url) ??
  //   /^https?:\/\/(www\.)?youtube\.com\/embed\/(?<videoId>[^?]+)/.exec(url);

  // if (matched?.groups?.videoId) {
  //   return matched.groups.videoId;
  // } else {
  //   return null;
  // }
}
