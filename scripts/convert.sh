#!/usr/bin/env bash
# Convert any format to HLS, forcing H.264/AAC stereo (web player compatibility)
set -euo pipefail

if [ $# -lt 2 ]; then
  >&2 echo "Movie and output location required."
  exit 1
fi

if [ ! -f "$1" ]; then
  >&2 echo "Movie not found."
  exit 2
fi

mkdir -p "$2"

probe() {
  ffprobe -v error -select_streams "$1" -show_entries stream="$2" -of csv=p=0 "$3" | head -1
}

video_codec=$(probe v:0 codec_name "$1")
audio_codec=$(probe a:0 codec_name "$1")
audio_channels=$(probe a:0 channels "$1")

if [ "$video_codec" = "h264" ]; then
  video_args=(-c:v copy)
else
  video_args=(-c:v libx264 -preset veryfast -crf 20 -profile:v high -level 4.1 -pix_fmt yuv420p)
fi

if [ "$audio_codec" = "aac" ] && [ "${audio_channels:-0}" -le 2 ]; then
  audio_args=(-c:a copy)
else
  audio_args=(-c:a aac -ac 2 -b:a 192k)
fi

ffmpeg -i "$1" \
  -map 0:v:0 -map 0:a:0 \
  "${video_args[@]}" "${audio_args[@]}" \
  -sn -dn \
  -start_number 0 \
  -hls_time 6 \
  -hls_list_size 0 \
  -hls_segment_type mpegts \
  -hls_playlist_type vod \
  -f hls "$2/movie.m3u8"
