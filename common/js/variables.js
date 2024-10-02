const pages = {
    indexPage: "index.html",
    setBoard: "set-board",
    setPlayers: "set-players",
    play: "play",
    privacyPolicy: "privacy-policy"
  };
  
  const onAppStore = {
    packageName: "com.vishesh.dotbox",
    googlePlay: "http://play.google.com/store/apps/details?id="
  }
  
  const shareTitle = `DotBox`,
    shareText = "Check out 'DotBox', an amazing dots and boxes gaming application!",
    shareUrl = window.location.href;
  
  const playStoreLink = `${onAppStore.googlePlay}${onAppStore.packageName}`;
  
  var currGame = {};