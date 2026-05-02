export const pages = {
    index: '/',
    setBoard: '/pages/set-board/',
    setPlayers: '/pages/set-players/',
    play: '/pages/play/',
    savedGames: '/pages/saved-games/',
    privacyPolicy: '/pages/privacy-policy/',
    credits: '/pages/credits/',
  };

  export const onAppStore = {
    packageName: "com.vishesh.dotbox",
    googlePlay: "http://play.google.com/store/apps/details?id="
  }

  export const shareTitle = `DotBox`,
    shareText = "Check out 'DotBox', an amazing dots and boxes gaming application!",
    shareUrl = window.location.href;

  export const playStoreLink = `${onAppStore.googlePlay}${onAppStore.packageName}`;
