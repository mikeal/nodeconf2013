(function() {

  var sidebar = document.querySelector('.sidebar'),
      sidebarPos = sidebar.offsetTop,
      apitoc = document.querySelector('.api-toc'),
      apitocPosition = apitoc.offsetTop + apitoc.offsetHeight,
      scrolled = false;

  var selectSection = function() {
    
    var headings = document.querySelectorAll('h2'),
        subHeadings = document.querySelectorAll('h3, h4');

    if (window.pageYOffset < apitocPosition) {
      displaySection(null, 'active');
    }

    checkPosition(headings, 'active');
    checkPosition(subHeadings, 'highlighted');
  };

  var checkPosition = function(selection, action) {
    
    var selectionLength = selection.length,
        match, matchElement, targetElement, selectionOffset, i;

    for (i = 0; i < selectionLength; ++i) {
      selectionOffset = selection[i].offsetTop;

      if (window.pageYOffset + 24 > selectionOffset) {
        match = selection[i].id;
        matchElement = sidebar.querySelector('a[href="#' + match + '"]');
        targetElement = matchElement.parentNode;

        displaySection(targetElement, action);
      }
    }
  };

  var displaySection = function(element, action) {
    
    var target = document.querySelectorAll('.' + action),
        targetLength = target.length,
        i;

    for (i = 0; i < targetLength; ++i) {
      target[i].className = '';
    }

    if (element) {
      element.className = action;
    }
  };

  document.addEventListener('scroll', function() {
    scrolled = true;

    if (window.pageYOffset + 24 > sidebarPos) {
      if (sidebar.className.indexOf('fixed') === -1) {
        sidebar.className += ' fixed';
      }
    } else {
      sidebar.className = sidebar.className.replace(/fixed/g , '');
    }
  });

  var expanderInterval = setInterval(function() {
    if (scrolled) {
      scrolled = false;
      selectSection();
    }
  }, 250);

})();
