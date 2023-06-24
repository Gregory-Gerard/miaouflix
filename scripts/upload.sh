# Upload a movie *.ts files and .m3u8 file in parallel

if [ $# -lt 2 ]; then
  >&2 echo "Movie ID and location required."
  exit 1
fi

s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='*.m3u8' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie0*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie0*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie1*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie2*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie3*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie4*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie5*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie6*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie7*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie8*.ts' --acl-public > /dev/null 2>&1 &
s3cmd sync $2 "s3://miaouflix/movies/$1/" --exclude='*' --include='movie9*.ts' --acl-public > /dev/null 2>&1 &
