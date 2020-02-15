(function(){
  'use strict';

  window.configData = {
    numChatMax: 20,
    personalColor: false,
    badgeVisible: true,
    themeURI: "",
     theme: "default",
    themeName: "",
    msgExistDuration: 0,
    msgAniDuration: 0,
    debugLevel:2,
    useDisplayName: true,
    loadCheerImgs: true,
    loadTwitchCons: true,
    consRealSubsOnly: true,
    loadDcCons: true,
    dcConsURI: "",
    subMonthsMsg: "{!0:{months} 개월 }구독{0: 시작}!",
    cheersMsg     : "{!0:{bits} 비트 }후원!",
    loadClipPreview: true,
    clipReplaceMsg: "[ 클립 ]",
    webSocket: "wss://irc-ws.chat.twitch.tv:443",
    nick: "justinfan16831",
    pass: "foobar",
    channel: location.hash,
    retryInterval: 2,
    allMessageHandle: false,
    muteUser: ["Nightbot"],
    deleteBanMsg: true,
    commands: [
      { exe: "clear", msg:"!!clear" },
      { exe: "theme", msg:"!!theme" }
    ],
    replaceMsgs: [
      { orig: /^![a-zA-Z]+/, to: "{no_display}" }// 봇 호출 영문 메세지 미표시
    ]
  }

  let s = location.search.slice(1).split('&').map(_ => {
    let pair = _.split('=')
    window.configData[pair[0]] = pair[1]
  })

  if(window.configData.scale !== null) {
    let scale = parseFloat(window.configData.scale)
    if(scale >= 5) {
      scale /= 100
    }
    window.addEventListener('DOMContentLoaded', () => {
      document.documentElement.style.fontSize = scale + 'rem'
    })
  }
})()