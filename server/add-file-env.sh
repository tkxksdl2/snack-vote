#!/bin/bash
set -euo pipefail

# file_env() 은 mysql docker Image로부터 가져왔다.
# usage: file_env VAR [DEFAULT]
#    ie: file_env 'DB_PASSWORD' 'example'
#  (DB_PASSWORD_FILE의 값을 가져온다. 해당 값에는 docker secret경로가 저장되어 있다.
#   해당 경로에 접근하여 파일을 읽고 그 값을 DB_PASSWORD 환경변수에 저장한다.)
file_env() {
	local var="$1"
	local fileVar="${var}_FILE"
	local def="${2:-}"
	if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
		echo >&2 "Both $var and $fileVar are already set"
		exit 1
	fi
	local val="$def"
	if [ "${!var:-}" ]; then
		val="${!var}"
	elif [ "${!fileVar:-}" ]; then
		val="$(< "${!fileVar}")"
	fi
	export "$var"="$val"
	unset "$fileVar"
}

# 이 docker image 실행 시 수집할 Secrets 목록
envs=(
	"DB_HOST"
    "DB_USERNAME"
    "DB_PASSWORD"
    "JWT_PRIVATE_KEY"
    "JWT_PRIVATE_KEY_EXP_TIME"
    "JWT_REFRESH_KEY"
    "JWT_REFRESH_KEY_EXP_TIME"
	"ROOT_EMAIL_FILE"
	"ROOT_PASSWORD_FILE"
	"ROOT_NAME_FILE"
)

# Run file_env() to fill the value of every original env from either $var or $fileVar
for env in "${envs[@]}"; do
	file_env "$env"
done

# Call the original entrypoint bash script
source docker-entrypoint.sh