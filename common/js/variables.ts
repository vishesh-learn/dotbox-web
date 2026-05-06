const pages = {
    index: '/',
    setBoard: '/pages/set-board/',
    setPlayers: '/pages/set-players/',
    play: '/pages/play/',
    savedGames: '/pages/saved-games/',
    privacyPolicy: '/pages/privacy-policy/',
    credits: '/pages/credits/',
  };

  const onAppStore = {
    packageName: "com.vishesh.dotbox",
    googlePlay: "http://play.google.com/store/apps/details?id="
  }

  const shareTitle =`DotBox`,
    shareText = "Check out 'DotBox', an amazing dots and boxes gaming application!",
    shareUrl = window.location.href;

  const playStoreLink =`${onAppStore.googlePlay}${onAppStore.packageName}`;
