# auraAPP

## **폴더 구조**

```
auraAPP/app/src/main/java/com/example/auraapp
├── java/com/example/auraapp
|   ├── MainActivity.java
|   ├── MyPhoneStateListener.java
|   ├── NativeBridge.java
|   └── MyWebChromeClient.java
└── AndroidManifest.xml
```

MainActivity.java의 아래 부분을 본인의 프론트엔드 주소로 변경

// URL 로드
webView.loadUrl("[본인의 프론트엔드 주소]");

## **각 파일 설명**

### MainActivity.java

- 메인 실행 클래스

### MyPhoneStateListener.java

- 핸드폰의 스테이더스 상태(통화 종료 등)를 가져오기 위한 클래스

### NativeBridge.java

- 네이티브 브릿지 클래스

### MyWebChromeClient.java

- 웹상 마이크 입력을 위한 크롬클라이언트 클래스

### AndroidManifest.xml

- 앱 구성 요소 선언, 앱 권한 요청 등 각종 설정을 정의하는 파일
