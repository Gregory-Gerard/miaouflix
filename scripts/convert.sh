# Convert any format to HLS format, forcing audio on two channels (web player don't go above)

if [ $# -lt 2 ]; then
  >&2 echo "Movie and output location required."
  exit 1
fi

if [ ! -f $1 ]; then
  >&2 echo "Movie not found."
  exit 2
fi

ffmpeg -i $1 -c:v copy -c:a aac -ac 2 -sn -start_number 0 -hls_time 10 -hls_list_size 0 -f hls $2/movie.m3u8
