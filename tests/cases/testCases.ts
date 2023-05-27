import { wav, avi, ttf, srt, ass, png, mp4 } from "../assets";
import type { FFmpegTestCase } from "../utils/testConvert";

export const testCases: FFmpegTestCase[] = [
  {
    name: "wav to aac",
    args: ["-i", "audio.wav", "-c:a", "libfdk_aac", "audio.aac"],
    input: [{ path: "audio.wav", data: wav }],
    output: [{ path: "audio.aac", type: "audio/aac" }],
  },
  {
    name: "wav to flac",
    args: ["-i", "audio.wav", "audio.flac"],
    input: [{ path: "audio.wav", data: wav }],
    output: [{ path: "audio.flac", type: "audio/x-flac" }],
  },
  {
    name: "avi to x264 mp4 with drawtext",
    args: [
      "-i",
      "video.avi",
      "-vf",
      "drawtext=fontfile=/arial.ttf:text='Artist':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2",
      "video.mp4",
    ],
    input: [
      { path: "video.avi", data: avi },
      { path: "arial.ttf", data: ttf },
    ],
    output: [{ path: "video.mp4", type: "video/mp4" }],
  },
  {
    name: "avi to gif",
    args: ["-i", "video.avi", "-f", "gif", "video.gif"],
    input: [{ path: "video.avi", data: avi }],
    output: [{ path: "video.gif", type: "image/gif" }],
  },
  {
    name: "wav to mp3",
    args: ["-i", "audio.wav", "audio.mp3"],
    input: [{ path: "audio.wav", data: wav }],
    output: [{ path: "audio.mp3", type: "audio/mpeg" }],
  },
  {
    name: "avi to x264 mp4 with srt",
    args: [
      "-i",
      "video.avi",
      "-vf",
      'subtitles=test.srt:fontsdir=/fonts:force_style="Fontname=Arial"',
      "video.mp4",
    ],
    input: [
      { path: "video.avi", data: avi },
      { path: "/fonts/arial.ttf", data: ttf },
      { path: "test.srt", data: srt },
    ],
    output: [{ path: "video.mp4", type: "video/mp4" }],
  },
  {
    name: "avi to x264 mp4 with ass",
    args: [
      "-i",
      "video.avi",
      "-vf",
      "ass=test.ass:fontsdir=/fonts",
      "video.mp4",
    ],
    input: [
      { path: "video.avi", data: avi },
      { path: "/fonts/arial.ttf", data: ttf },
      { path: "test.ass", data: ass },
    ],
    output: [{ path: "video.mp4", type: "video/mp4" }],
  },
  {
    name: "avi to vp9 webm",
    args: ["-i", "video.avi", "-codec:v", "libvpx", "video.webm"],
    input: [{ path: "video.avi", data: avi }],
    output: [{ path: "video.webm", type: "video/webm" }],
  },
  {
    name: "avi to vp9 webm with mt",
    args: [
      "-i",
      "video.avi",
      "-row-mt",
      "1",
      "-codec:v",
      "libvpx",
      "video.webm",
    ],
    input: [{ path: "video.avi", data: avi }],
    output: [{ path: "video.webm", type: "video/webm" }],
  },
  {
    name: "png to webp",
    args: ["-i", "image.png", "image.webp"],
    input: [{ path: "image.png", data: png }],
    output: [{ path: "image.webp", type: "image/webp" }],
  },
  {
    name: "avi to mpeg1",
    args: ["-i", "video.avi", "-c:v", "mpeg1video", "video.mpeg"],
    input: [{ path: "video.avi", data: avi }],
    output: [{ path: "video.mpeg", type: "video/MP1S" }],
  },
  {
    name: "avi to mpeg2",
    args: ["-i", "video.avi", "-c:v", "mpeg2video", "video.mpg"],
    input: [{ path: "video.avi", data: avi }],
    output: [{ path: "video.mpg", type: "video/MP1S" }],
  },
  {
    name: "wav to opus",
    args: ["-i", "audio.wav", "audio.opus"],
    input: [{ path: "audio.wav", data: wav }],
    output: [{ path: "audio.opus", type: "audio/opus" }],
  },
  {
    name: "avi to ogv",
    args: ["-i", "video.avi", "-c:v", "libtheora", "video.ogv"],
    input: [{ path: "video.avi", data: avi }],
    output: [{ path: "video.ogv", type: "video/ogg" }],
  },
  {
    name: "wav to ogg",
    args: ["-i", "audio.wav", "-c:a", "libvorbis", "audio.ogg"],
    input: [{ path: "audio.wav", data: wav }],
    output: [{ path: "audio.ogg", type: "audio/ogg" }],
  },
  {
    name: "wav to wv",
    args: ["-i", "audio.wav", "audio.wv"],
    input: [{ path: "audio.wav", data: wav }],
    output: [{ path: "audio.wv", type: "audio/wavpack" }],
  },
  {
    name: "avi to x264 mp4",
    args: ["-i", "video.avi", "video.mp4"],
    input: [{ path: "video.avi", data: avi }],
    output: [{ path: "video.mp4", type: "video/mp4" }],
  },
  // It takes too much time for single thread version to
  // transcode x265, thus skip.
  {
    name: "avi to x265 10bit mp4",
    args: [
      "-i",
      "video.avi",
      "-c:v",
      "libx265",
      "-pix_fmt",
      "yuv420p10le",
      "video.mp4",
    ],
    input: [{ path: "video.avi", data: avi }],
    output: [{ path: "video.mp4", type: "video/mp4" }],
    filter: ({ thread }) => thread,
  },
  {
    name: "avi to x265 12bit mp4",
    args: [
      "-i",
      "video.avi",
      "-c:v",
      "libx265",
      "-pix_fmt",
      "yuv420p12le",
      "video.mp4",
    ],
    input: [{ path: "video.avi", data: avi }],
    output: [{ path: "video.mp4", type: "video/mp4" }],
    filter: ({ thread }) => thread,
  },
  {
    name: "mp4 scale",
    args: ["-i", "video.mp4", "-vf", "scale=128:-1", "video-scaled.mp4"],
    input: [{ path: "video.mp4", data: mp4 }],
    output: [{ path: "video-scaled.mp4", type: "video/mp4" }],
  },
  {
    name: "png to mp4",
    args: ["-i", "image.png", "video.mp4"],
    input: [{ path: "image.png", data: png }],
    output: [{ path: "video.mp4", type: "video/mp4" }],
  },
];
