# **SpringBoot 백엔드**

- env.txt에 있는 내용을 .env에 본인의 환경에 맞게 변경 하여 등록
- DB.sql은 DB sql문 파일

### 백엔드 구조

```
📦 프로젝트 루트
┣ 📂 config # 환경 설정 클래스 (보안, WebMvc, DB 등)
┣ 📂 controller # REST API 엔드포인트 정의
┣ 📂 dto # 데이터 전송 객체 (요청/응답용)
┣ 📂 entity # JPA 엔티티 클래스 (DB 매핑)
┣ 📂 repository # Spring Data JPA 리포지토리 인터페이스
┣ 📂 service # 비즈니스 로직 계층
┣ 📂 util # 유틸리티/헬퍼 클래스
┣ 📂 websocket # WebSocket 관련 처리 (핸들러, 설정 등)
┣ 📜 VoiceBackApplication.java # Spring Boot 실행 메인 클래스
```
