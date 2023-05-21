# Snack-Vote

vote for everyone, every agenda

# 개발 동기

사람들은 남의 의견을 듣기를 참 좋아합니다.

커뮤니티에 투표기능이 있는 곳은 많지만, 투표기능이 메인이 되는 커뮤니티는 없는 것 같아

간단한 형태의 투표를 메인에 노출시키며 매일 여론을 확인할 수 있는 커뮤니티를 만들어 보았습니다.

# 사용 기술

backend - NestJS, TypeOrm, graphql

frontend - reactJS, graphql, typescript

DB - RDS for mysql, Elastic Cache for Redis

deploy - docker-stack, aws-EC2, Route53

현재 테스트 배포 진행중 - <http://snackvote.org>

# 프로젝트 아키텍처

ERD

<img src="images\ERD.png"  width="500" height="550">

Architecture

<img src="images\snackvote-architecture.png"  width="700" height="370">

---

---

# updated

- ## 모델 및 인기 글 기능 개선

  모델 인기 글 추출 방법은 기존에 최근 n일 내의 게시글 중 최다 득표를 받은 게시글로 선정했었습니다.

  그러나 최근 글 이외에는 가져올 수 없어 지난 글이 재조명 된 경우 화면에 표시해줄 수 없고, 사용자 관점에서 인기 글이라는 관점에 잘 부합하지 않는다 생각했습니다.

  최근 인기 글을 조명하기 위해서는 실제로 최근 투표를 참조해야 한다고 생각해, 기존에 다대다 관계로 매칭했을 뿐인 투표를 별개의 테이블로 추가하고 투표 일자를 기록하도록 했습니다. 실제 db 관점에서는 컬럼을 하나 추가했을 뿐입니다.

  그리고 인기글을 추출하는 쿼리를 변경해 최근 발생한 투표를 일부 집계한 후, 총 투표수 순위를 매겨서 상위 게시글을 가져오도록 변경했습니다.

  이러한 변경에 따라 쿼리의 부하가 많아졌으므로 사용자가 직접 쿼리를 실행하지 않고, 결과값을 서버에 저장하고 있다가 사용자는 값만을 받아오도록 변경했습니다. 실제 쿼리는 ScheduleModule을 이용해서 일정시간마다 실행되어 갱신합니다.

- ## Github Actions 이용 CI/CD 개선

  github action을 이용해 main 브랜치에 push 혹은 pr이 일어날 때 테스트를 수행하고, commit message에서 version 태그를 감지해서 version<숫자>.<숫자> 일 때 docker server와 client 각각에서 해당 버전 태그의 이미지를 빌드해서 push하도록 했습니다.

  aws사이드에서는 업데이트된 stack.yaml파일을 업로드하고 deploy를 실행하기만 하면 됩니다.

- ## Refresh token 관련 개선 및 버그 수정

  기존에는 refresh token을 별도의 테이블에 저장하고, 유저가 재 로그인할 때마다 검증 혹은 갱신되었습니다.

  그러나 이러한 방식에는 refresh token이 특별히 관리하지 않는 한 지워지지 않고 계속해서 쌓인다는 단점이 있었습니다.

  따라서 redis store를 cache module로 사용하여 refresh token을 관리하도록 변경했습니다.

  access token은 유저가 보관하므로 기존처럼 토큰 자체 만료 시간을 사용하지만, refresh token은 redis의 TTL 기능을 이용해 자동적으로 지워지도록 했습니다. RDBMS 사용이 줄었으므로 서버 부담도 덜고, 코드 자체도 간결해졌습니다.

  <**추가 버그 수정**>

  1.  client의 onError link가 refresh 동작 이후 재생성된 토큰을 바로 넘기지 않던 문제 수정. 이전 동작인 operation을 재수행할 때 header의 할당부터 시작하는 것이 아니라 이미 할당된 헤더를 사용하므로, 재생성된 토큰을 헤더에 직접 넣어주는 동작이 필요했음.
  2.  access token이 만료된 경우 뿐만 아니라 토큰이 이상한 값으로 오염되는 경우에도 refresh 동작을 일으키도록 수정. 이 경우엔 access token으로 만료를 무시하고라도 정보를 찾을 수 없으므로 클라이언트의 토큰을 지움.

- ## DB docker mysql image --> AWS RDS for MySQL

  초기엔 DB로 mysql docker image를 사용했었습니다. 이 이미지는 server 노드에 backend 이미지와 함께 존재했었는데, 서버와 db가 같은 공간에 존재하는것은 보안상으로도 적절치 않고 EC2 인스턴스의 메모리와 CPU 사용량에 부담을 주었습니다. 당시 EC2 저장소 사용량은 7~80%대로 상당히 무리가 있었습니다.

  또한 mysql을 docker image로 사용하게 되면 DB의 직접적 관리를 EC2 서버에 연결해서 CLI를 통해 해야하므로 개발 관점에서도 굉장히 불편했습니다.

  때문에 mysql과 서버를 분리시킬 겸 AWS RDS를 사용해서 DB를 구성하도록 수정했습니다. 기존에 있던 데이터는 덤핑해 .sql파일로 만들어 온전하게 이전했습니다.

  내부로는 EC2, 외부로는 로컬 컴퓨터 IP만 열어두었기에 mysql workbench를 이용해 DB를 직접적으로 관리할 수 있고, EC2 저장소도 50%대로 여유있게 되었습니다.

## Todo

테스트 코드 추가

이미지 관련 기능 추가
