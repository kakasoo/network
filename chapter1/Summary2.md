# 03. 전 서계의 DNS 서버가 연대한다

## 1. DNS 서버의 기본 동작

DNS 서버의 기본 동작은 클라이언트에서 조회 메시지를 받고 조회의 내용에 응답하는 형태로 정보를 회답하는 일이며, `DNS 서버의 이런 과정 역시 프로토콜`이라고 할 수 있다.

조회 메시지에는 `이름, 클래스, 타입` 의 세 가지 정보가 포함되어 있다.

이름에는 서버나 메일의 배송 목적지 ( 메일 주소에서는 `@ 기호` 뒤의 문자열 ) 를 나타내며, 클래스에서는 인터넷을 나타내며 기호는 `IN` , 타입에는 어떤 종류의 정보가 지원되는지를 나타낸다.

2개의 타입만 설명하자면,

타입이 A면 IP 주소를, MX면 메일 서버의 이름을 제공하게 되어 있다. DNS 서버는 `이름, 클래스 타입` 을 비교하여 세 가지가 일치하는 정보를 찾아준다. ( IP 주소를 가졌다고 해서 전부 서버인 것은 아니다. )

만약 타입이 MX인 경우에는 메일 서버의 우선 순위와 메일 서버의 이름이라는 두 개의 항목으로 회답을 하고, 메일 서버의 IP도 같이 찾아서 회답한다. ( @naver.com이 있다면 naver.com이 메일 서버가 된다. )

이 때, 조회를 요청받은 정보와 실제 값에 관한 비교를 설정 파일에서 찾는데, 이 등록 정보 각각을 `리소스 레코드`라고 한다.

⇒ 정리하자면, 등록 정보가 담겨 있는 리소스 레코드를 통해서 이름, 클래스, 타입이 일치하는 값을 돌려주는 게 DNS 서버의 기본 동작이다.

## 2. 도메인의 계층

위처럼 동작하면 좋겠지만, 인터넷에는 막대한 수의 서버 ( 또는 IP )가 있어서 하나의 DNS 서버에 모두 등록하는 것은 불가능하다. 그렇기 때문에 요청 받은 DNS 서버에 등록 정보가 없는 경우가 있을 수 있다.

따라서 DNS 서버끼리 연대하여 ( 연대라고 하긴 했지만 실제로는 계층을 Tree 형태의 계층을 이루어 ) 필요한 정보를 찾아내는 식으로 동작한다.

DNS 서버에 등록된 정보들은 `도메인 명`이라는 `계층적 구조를 가진 이름`이 붙어있다. 무슨 말이냐면, 도메인이란 쉽게 말해 www.lab.cyber.cokr 과 같이, 점으로 구분되는 계층 구조로 되어 있다는 의미이다.

우측에서 좌측으로 점점 계층이 내려가는 구조, 즉 kr → co → cyber → lab → www 의 구조를 가진다. 이런 계층 구분은 도메인을 분할할 필요 없이 하위 도메인을 만들어 할당할 수 있게 해준다.

이렇게 되면 kr. 국내에 할당된 도메인. co. 국내의 도메인을 분류하기 위해 설치된 도메인, 그 중에서 회사. cyber. 회사에 할당한 도메인. www. 서버의 이름의 형태가 된다.

( node에서 express generator를 사용하면 www file이 생성되는데 실제로 이게 서버이다. )

⇒ 정리하자면, DNS 서버에 찾고자 하는 도메인이 없는 경우를 대비하여 DNS 서버끼리는 서로 연대를 하고 있는 상태고, 이를 쉽게 하기 위해서 도메인은 점을 이용한 계층 구조로 작성되어 있다는 것이다.

## 3. 담당 DNS 서버를 찾아 IP 주소를 가져온다

도메인 수는 많다. 그래서 DNS 서버도 수만 대가 있다. 그러므로 이것을 일일히 찾아보는 것은 불가능한 일이다. 그렇기 때문에 고안된 방법이, 하위 DNS 서버의 IP 주소를 상위 DNS 서버에 등록하는 것이다.

2. 도메인의 계층에서 설명한 것과 같이 각 도메인이 점으로 이루어져 있기 때문에 DNS 서버도 이 도메인 단위로 나눠서 구성할 수 있다.

상위에 lab.glasscom.com 을 담당하는 DNS 서버를 glasscom.com 를 담당하는 서버에 등록시키고 이것을 다시 com 도메인을 가지는 DNS 서버에 등록하는 식으로 계층을 만들어낸다.

최상위에는 생략가능한, 루트 도메인이 있는데, 여기에는 각 나라의 도메인이나 com, net 등등을 모아 놓은 도메인이다. 생략하지 않을 경우에는 마지막 도메인에 점을 붙이는 것으로 표현한다.

⇒ 정리하자면, DNS 서버 역시 도메인과 같은 방식의 계층을 이루고 있어서 찾고자 하는 도메인을 빠르게 찾을 수 있도록 하고 있다는 것이다. 이것이 브라우저가 gethostbyname을 호출한 결과이다.

⇒ 결국 상위로 올라가면서 찾게 되거나, 못찾은 경우 루트부터 시작해 다시 내려가며 찾게 될 거라는 이야기이다.

## 4. DNS 서버는 캐시 기능으로 빠르게 회답할 수 있다

현실의 DNS 서버는 위의 설명들보다 더 빠르다. 이유는, 하나의 DNS 서버에 두 개 이상의 도메인을 등록해놓을 수 있기 때문이다. 따라서 반드시 하위의 도메인만 가지지 않고, 상하위를 모두 가지기도 한다.

이는 필요한 경우 순차적으로 조회하는 것이 아니라 하나의 서버를 건너 뛰고 조회할 수 있게 해준다.

또한 캐시를 기록하기도 한다. 캐시를 기록한 경우, 도메인이 일치할 때 루트로 가지 않고 해당 캐시 위치부터 탐색을 시작하여 더 빠르게 회답할 수 있도록 해준다. 다만 캐시가 항상 최신인 경우에만 해당하는 이야기이다.

DNS 서버에 등록하는 정보는 이를 위해, 유효 기간을 설정하고, 유효 기간이 지난 경우에는 캐시에서 삭제하도록 되어 있다. 또한 조회에서 회답할 때 정보가 캐시에 저장된 것인지, 아니면 DNS 서버에서 회답한건지 함께 알려준다.

⇒ 이 부분은, 실제 DNS 서버를 보충한 내용이다.

# 04. 프로토콜 스택에 메시지 송신을 의뢰한다

## 1. 데이터 송수신 동작의 개요

IP 주소를 조사했으면 이제 메시지를 송신해야 한다. 이것 역시 OS 내부의 프로토콜 스택에 의뢰한다. ( DNS 서버를 통한 IP 주소 조사 및 메시지 송신은 브라우저만이 아니라 모든 애플리케이션이 OS를 통하도록 되어 있다. )

데이터 송신 역시 DNS 서버에 IP 주소를 조회할 때와 같이 Socket 라이브러리를 사용한다. 여기서 말하는 소켓은 네트워크 상에서 서버와 클라이언트를 연결하는 파이프라고 생각해볼 수 있다. ( 하나의 연결엔 소켓이 2개 필요하다. )

`주의 : 소켓은 출입구의 역할을 할 뿐 데이터 송수신과 관련된 실질적 작업을 수행하지 않는다. 그저 의뢰받은 내용을 전달하는 중개역일 뿐이다.`

⇒ 이 내용이 어떤 의미인지 잘 모르겠으므로, 별도 조사 필요.

⇒ 라이브러리가 프로토콜 스택을 호출하여 실질적인 동작은 프로토콜 스택에서 일어난다. 라는 의미였다.

아래는 소켓을 사용하여 채팅을 구현한 예시이다. 코드는 JavaScript로 작성하였다.

### client 측 Socket

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Socket.IO chat</title>
        <!-- style 관련된 코드는 모두 제거하였다. -->
    </head>
    <body>
        <ul id="messages"></ul>
        <div id="chattingBar" action="">
            <input id="m" autocomplete="off" />
            <button type="button" id="sendButton">Send</button>
        </div>
    </body>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        const msg = document.getElementById("m");
        const messages = document.getElementById("messages");
        const sendButton = document.getElementById("sendButton");

        // enter 입력 시에 sendButton이 클릭된 것으로 간주하는 기능 추가.
        msg.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                sendButton.click();
            }
        });

        sendButton.addEventListener("click", (event) => {
            socket.emit("chat message", msg.value);
            msg.value = "";
        });

        socket.on("chat message", (msg) => {
            console.log("someone says... : ", msg);
            const chat = document.createElement("li");
            chat.innerText = msg;
            messages.appendChild(chat);
        });
    </script>
</html>
```

### Server 측 Socket

```jsx
// express를 사용하여 application을 만들고, 그것을 http 위에 올리는 과정.
// 이후 http 위에서 동작할 socket.io를 호출하여 기능을 정의했다.
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// index.html을 준다.
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// io의 기능을 정의한다.
// io는 자신과 연결된 socket들을 id 값을 key로 하는 Map에 저장하고,
// event emit 시에 전체 socket 들에게 event를 전달한다.
io.on("connection", (socket) => {
    // console.log("server IO : ", io);
    // 새로 입장한 User가 있는 경우
    console.log("a user connected. : ", socket.id);

    // 퇴장한 User가 있는 경우
    socket.on("disconnect", () => {
        console.log("A user disconnected.");
    });

    // socket 중에 채팅을 한 socket이 있는 경우 서버 측 io가 chat message 실행.
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });
});

// 연결을 위해 port 3000을 열어주었다.
http.listen(3000, () => {
    console.log("listening on *:3000");
});
```

소켓은 생성, 연결, 데이터 송수신, 소멸의 단계를 따른다. 소멸 시에는 소멸 순서나 방법 등이 정해져 있다. ( 책에 나와 있는 내용에는 어느 쪽이나 상관없다고 되어 있지만, 이러면 데이터가 망실될 위험이 있다. )

소켓의 4가지 동작을 실행하는 것은 전부 OS 내부의 프로토콜 스택이다.

## 2. 소켓의 작성 단계

소켓의 생성, 연결, 데이터 송수신, 소멸을 볼 수 있는 코드들을 첨부한다. 다만 작성자 외에는 보기 불편할 수 있으니 구태여 볼 필요는 없겠다.

socket() 메서드를 사용하여 소켓을 생성, 소켓은 디스크립터로서 반환되기 때문에 이것을 변수에 저장하여 다룬다. 디스크립터는 소켓에 할당된 번호라고 생각하면 된다.

## 3. 파이프를 연결하는 접속 단계

위 소켓 작성을 포함하여, 소켓의 전 단계가 고수준 언어에서는 매우 간단하게 구성되어 있다. 하지만 실제로는 복잡한 구조를 가지고 있기 때문에 C언어 코드를 첨부한다. 아래처럼 서버도 socket으로 만들어질 수 있다.

이렇게 작성을 해놓으면, 클라이언트 측에서도 connect 메서드를 통해서 연결이 가능하다. 연결 시에는 IP 주소와 포트 번호가 필요하다.

책에 있는 예시가 재밌는데, `포트 번호는 전화 후에 ㅇㅇ님 계십니까?` 라고 묻는 과정이라고 한다. ( 내가 본 설명 중에 가장 직관적이다. )

다만 우리가 사용하는 포트번호들의 대부분은 프로토콜에 따라서 선점된 포트번호들이 있어서 별도로 묻는 과정이 없다. ( 임의로 설정하는 경우도 있다. )

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <WinSock2.h>

#define BUF_SIZE 1024

void ErrorHandling(char* message) {
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}

int main(int argc, char* argv[]) {
    WSADATA wsaData;
    SOCKET hServSock, hClntSock; // 서버 소켓과 데이터 송수신 소켓 생성
    SOCKADDR_IN servAdr, clntAdr; // 서버 소켓과 데이터 송수신 소켓의 주소를 의미하는 변수 생성
    TIMEVAL timeout; // timeout 값을 저장할 변수 생성
    fd_set reads, cpyReads;

    int adrSz; // 서버 주소의 크기
    int strLen, fdNum;
    char buf[BUF_SIZE];

    if (argc != 2) { // port 값을 입력받지 않았을 경우, 즉 main 함수의 data가 1인 경우
        printf("Usage : %s <port> \n", argv[0]);
        exit(1);
    }

    /* 1. SOCKET 관련 함수 호출, WSAStartup() */
      if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) // 실패 시 에러 메세지 출력
          ErrorHandling("WSAStartup() error!");

    /* 2. server socket 생성 후, server socket 주소 정보 입력 */
      hServSock = socket(PF_INET, SOCK_STREAM, 0);
      memset(&servAdr, 0, sizeof(servAdr));
      servAdr.sin_family = AF_INET; // 주소 체계 정보 저장
      servAdr.sin_addr.s_addr = htonl(INADDR_ANY); // 접근 가능한 주소 저장, ANY
      servAdr.sin_port = htons(atoi(argv[1])); // 접근 가능한 port 저장

    /* 3. server socket과 주소 정보 간의 결합 */
      if (bind(hServSock, (SOCKADDR*)&servAdr, sizeof(servAdr)) == SOCKET_ERROR)
          ErrorHandling("bind() error!");

    /* 4. 소켓을 대기 상태로 변경 */
      if (listen(hServSock, 5) == SOCKET_ERROR)
          ErrorHandling("listen() error!");
      FD_ZERO(&reads); // fd_set을 모두 0으로 초기화
      FD_SET(hServSock, &reads); // hServSock의 관찰 대상을 저장

    /* 5. 데이터 송수신 */
      while (1) {
          cpyReads = reads; // cpyReads에 reads를 저장, select 이후에 변화가 없는 소켓은 모두 0으로 초기화되니 원본 사용 X
          timeout.tv_sec = 5; // timeout을 5 초로 설정
          timeout.tv_usec = 5000; // timeout을 5000 마이크로 sec로 설정

          if ((fdNum = select(0, &cpyReads, 0, 0, &timeout)) == SOCKET_ERROR)
              /*
                  1번째 매개변수 : 리눅스와의 호환성을 위해 존재하는 의미없는 값.
                  2번째 매개변수 : 수신된 데이터의 존재 여부를 확인하고자 cpyRead를 넣었다
                  3번째 매개변수 : 블로킹 없는 데이터 전송 가능 여부를 확인할 의사가 없어 0을 넣었다
                  4번째 매개변수 : 예외 상황의 발생 여부를 확인할 의사가 없어 0을 넣었다
                  5번째 매개변수 : timeout을 설정
                  반환 값은 변화가 발생한 FD의 숫자인데, 오류 발생 시에는 -1이 발생하여 반복문을 빠져나간다.
              */
              break;

          if (fdNum == 0) // 변화가 없을 경우에는 contiune;
              continue;

          // 변화가 있을 경우 전체 reads를 순환하며 변화가 발생한 FD를 탐색한다.
          for (int i = 0; i < reads.fd_count; i++) {
              if (FD_ISSET(reads.fd_array[i], &cpyReads)) // reads.fd_array[i]의 값이 cpyReads에 포함된다면, 표준 입력
              {
                  if (reads.fd_array[i] == hServSock) { // 그 표준 입력이 server socket이라면 연결 요청이 발생한 것
                      adrSz = sizeof(clntAdr);
                      hClntSock = accept(hServSock, (SOCKADDR*)&clntAdr, &adrSz); // 연결한다
                      FD_SET(hClntSock, &reads); // reads에 client socket을 저장한다, 새로 생성한 것
                      printf("conneced client: %d \n", hClntSock);
                  }
                  else {     // 서버 소켓이 아닌 경우에 변화 발생 시 read message
                      strLen = recv(reads.fd_array[i], buf, BUF_SIZE - 1, 0);
                      if (strLen == 0) { // 읽어들인 것이 0이라면, 연결을 종료한다.
                          FD_CLR(reads.fd_array[i], &reads);
                          closesocket(cpyReads.fd_array[i]);
                          printf("closed client : %d \n", cpyReads.fd_array[i]);
                      }
                      else { // 읽어들인 것이 있다면 echo 한다.
                          send(reads.fd_array[i], buf, strLen, 0);
                      }
                  }
              }
          }
      }
    closesocket(hServSock);
    WSACleanup();
    return 0;
}
```

## 4. 메시지를 주고받는 송수신 단계

write()와 read() 메서드를 사용한다. 송신할 때에는 HTTP 리퀘스트 메시지를 보내고, 수신할 때는 응답 메시지를 받는다. 이 메시지는 수신 버퍼에 저장해둔다.

## 5. 연결 끊기 단계에서 송수신이 종료된다

책에는, 위 연결 부분과 연결 끊기 부분에 대한 설명이 빈약하므로, 3 way handshake와 4 way handshake 내용을 추가로 작성하겠다.
