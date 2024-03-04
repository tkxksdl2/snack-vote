#!/bin/bash

# 기본 파일 경로
files_dir="$1"

if [ "${files_dir: -1}" != "/" ]; then
    files_dir="$files_dir/"
fi

# 입력 경로 내 모든 txt 파일 읽음
for txt_file in "$files_dir"*.txt; do
    # 파일 이름 가져오기
    secret_name=$(basename "$txt_file" .txt)

    # 파일 읽기
    secret_value=$(cat "$txt_file")

    if docker secret inspect "$secret_name" > /dev/null 2>&1; then
        # 이미 존재하는 secret 제거
        docker secret rm "$secret_name"
    fi

    # secret 생성
    echo -n "$secret_value" | docker secret create "$secret_name" -
    echo "Created Docker secret: $secret_name"
done