export function extractYouTubeVideoId(url: string): string | null {
  const matched =
    /^https?:\/\/(www\.)?youtube\.com\/watch\?(.*&)?v=(?<vidoeId>[^&]+)/.exec(
      url
    ) ??
    /^https?:\/\/youtu\.be\/(?<vidoeId>[^?]+)/.exec(url) ??
    /^https?:\/\/(www\.)?youtube\.com\/embed\/(?<vidoeId>[^?]+)/.exec(url);

  if (matched?.groups?.vidoeId) {
    return matched.groups.vidoeId;
  } else {
    return null;
  }
}