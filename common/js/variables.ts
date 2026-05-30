// Prefix to reach the site root from the current page. Sub-pages live at
// `pages/<name>/` (2 levels deep); everything else is the root. Computing this
// at runtime keeps navigation working under both a web server and the file://
// protocol (where a leading "/" would resolve to the filesystem root).
  const root = location.pathname.includes('/pages/') ? '../../' : '';

  const pages = {
    index: root + 'index.html',
    setBoard: root + 'pages/set-board/index.html',
    setPlayers: root + 'pages/set-players/index.html',
    play: root + 'pages/play/index.html',
    savedGames: root + 'pages/saved-games/index.html',
    privacyPolicy: root + 'pages/privacy-policy/index.html',
    credits: root + 'pages/credits/index.html',
  };

  // Resolve a stored `currPage` to a URL relative to the current page. New saves
  // store a key into `pages` (e.g. "play"). Older saves stored a depth-specific
  // path (e.g. "/pages/play/"); map its folder name back to a key so existing
  // in-progress games still resume on the correct page.
  function pageUrlFor(page) {
    if (pages[page]) return pages[page];

    const folder = String(page).match(/pages\/([^/]+)/)?.[1];
    const key = folder && Object.keys(pages).find(k => pages[k].includes(`pages/${folder}/`));

    return key ? pages[key] : pages.setBoard;
  }

  const onAppStore = {
    packageName: "com.vishesh.dotbox",
    googlePlay: "http://play.google.com/store/apps/details?id="
  }

  const shareTitle =`DotBox`,
    shareText = "Check out 'DotBox', an amazing dots and boxes gaming application!",
    shareUrl = window.location.href;

  const playStoreLink =`${onAppStore.googlePlay}${onAppStore.packageName}`;
