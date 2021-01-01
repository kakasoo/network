module.exports = [
    {
        type: "input",
        name: "networkClass",
        message: "네트워크 클래스를 선택하세요. (A,B,C)",
    },
    {
        type: "input",
        name: "IP_Address",
        message: `사용할 IP 주소를 입력하세요. (A : 1 ~ 126, B : 128 ~ 191, C : 192 ~ 223)`,
    },
    {
        type: "input",
        name: "subnet",
        message: "사용할 서브넷 비트를 입력하세요.",
    },
];
