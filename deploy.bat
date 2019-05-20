aws s3 rm s3://softkave-client --recursive && ^
aws s3 cp ./build s3://softkave-client --recursive --content-encoding utf-8