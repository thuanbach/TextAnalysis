const tinyABinit = () => {
    const contentOriginal = document.getElementsByClassName('ab-test-original');
    const contentAlt = document.getElementsByClassName('ab-test-alternative');
    const id = wp_user_info.username.data.display_name;
    const testCriteria = (contentAlt.length > 0) && (typeof id !== 'undefined');
    
    testCriteria ? runTinyAB(contentOriginal, contentAlt, id) : removeElements(contentAlt);
  }

  const removeElements = (group) => Array.from(group).forEach(element => element.remove());

  const runTinyAB = (contentOriginal, contentAlt, id) => {
    const lastChar = id.slice(-1);
    const altChars = ['1', '3', '5', '7', '9', 'b', 'd', 'f'];
    const showAlt = altChars.includes(lastChar);

    showAlt ? removeElements(contentOriginal) : removeElements(contentAlt);
  }

  tinyABinit();
