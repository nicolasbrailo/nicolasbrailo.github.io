(function () {
  var pmzData = window.PMZ_DATA || {};
  function closest(el, sel) {
    return el && (el.matches(sel) ? el : closest(el.parentElement, sel));
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  var MAIN_BUTTON_RESET_DELAY = 15000;
  var ICONS = {
    dark: pmzData.inlineIcon || pmzData.icon || '',
    light: pmzData.inlineIconLight || pmzData.icon || ''
  };
  var luminanceCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;

  function sanitizeDownloadUrl(rawUrl) {
    try {
      if (typeof URL === 'function') {
        var parsed = new URL(rawUrl, window.location.origin);
        if (!parsed.protocol || (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')) {
          return null;
        }
        if (parsed.origin !== window.location.origin) {
          return null;
        }
        return parsed.href;
      }
      var tempAnchor = document.createElement('a');
      tempAnchor.href = rawUrl;
      if (!tempAnchor.protocol || (tempAnchor.protocol !== 'http:' && tempAnchor.protocol !== 'https:')) {
        return null;
      }
      if (tempAnchor.host && tempAnchor.host !== window.location.host) {
        return null;
      }
      return tempAnchor.href;
    } catch (error) {
      return null;
    }
  }

  function navigateToUrl(rawUrl) {
    var sanitizedUrl = sanitizeDownloadUrl(rawUrl);
    if (!sanitizedUrl) {
      return;
    }

    var anchor = document.createElement('a');
    anchor.setAttribute('href', sanitizedUrl);
    anchor.setAttribute('rel', 'noopener noreferrer');
    anchor.setAttribute('target', '_self');
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  function ensureMainSpinner(anchor) {
    var spinner = anchor.querySelector('.pmz-spinner');
    if (!spinner) {
      spinner = document.createElement('span');
      spinner.className = 'pmz-spinner';
      spinner.setAttribute('aria-hidden', 'true');
      var icon = anchor.querySelector('.pmz-icon');
      if (icon && icon.parentNode === anchor) {
        icon.insertAdjacentElement('beforebegin', spinner);
      } else {
        var label = anchor.querySelector('.pmz-label');
        if (label) {
          anchor.insertBefore(spinner, label);
        } else {
          anchor.insertBefore(spinner, anchor.firstChild);
        }
      }
    }
    return spinner;
  }

  function getCreatingZipLabel() {
    if (window.PMZ_DATA && window.PMZ_DATA.strings && window.PMZ_DATA.strings.creatingZip) {
      return window.PMZ_DATA.strings.creatingZip;
    }
    return 'Creating zip file';
  }

  function setButtonIcon(btn, theme) {
    if (!btn) {
      return;
    }
    var iconImg = btn.querySelector('img');
    if (!iconImg) {
      return;
    }
    var normalized = theme === 'light' ? 'light' : 'dark';
    if (iconImg.dataset.pmzIconTheme === normalized) {
      return;
    }
    var src = normalized === 'light' ? ICONS.light : ICONS.dark;
    if (!src) {
      return;
    }
    iconImg.src = src;
    iconImg.dataset.pmzIconTheme = normalized;
  }

  function analyzeImageCorner(img, callback) {
    if (!img || typeof callback !== 'function') {
      return;
    }
    if (luminanceCache && luminanceCache.has(img)) {
      callback(luminanceCache.get(img));
      return;
    }

    function compute() {
      var width = img.naturalWidth || img.width;
      var height = img.naturalHeight || img.height;
      if (!width || !height) {
        callback(null);
        return;
      }
      var sampleSize = 24;
      var sw = Math.min(sampleSize, width);
      var sh = Math.min(sampleSize, height);
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext && canvas.getContext('2d');
      if (!ctx) {
        callback(null);
        return;
      }
      canvas.width = sw;
      canvas.height = sh;
      var sx = Math.max(0, width - sw);
      try {
        ctx.drawImage(img, sx, 0, sw, sh, 0, 0, sw, sh);
        var data = ctx.getImageData(0, 0, sw, sh).data;
        var total = 0;
        var pixels = data.length / 4;
        for (var i = 0; i < data.length; i += 4) {
          var r = data[i];
          var g = data[i + 1];
          var b = data[i + 2];
          total += 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }
        var avg = total / pixels;
        var theme = avg < 150 ? 'light' : 'dark';
        if (luminanceCache) {
          luminanceCache.set(img, theme);
        }
        callback(theme);
      } catch (err) {
        callback(null);
      }
    }

    if (!img.complete || !img.naturalWidth) {
      img.addEventListener('load', function onLoad() {
        img.removeEventListener('load', onLoad);
        compute();
      });
      return;
    }

    compute();
  }

  function applyAdaptiveIcon(btn, img) {
    if (!btn || !img) {
      return;
    }
    analyzeImageCorner(img, function(theme) {
      if (theme) {
        setButtonIcon(btn, theme);
      }
    });
  }

  function getVisibleSlideshowImage(slideshow) {
    if (!slideshow) {
      return null;
    }
    var selectors = [
      '.jetpack-slideshow-slide img',
      '.jetpack-slideshow-window img',
      'img'
    ];
    var imgs = null;
    for (var i = 0; i < selectors.length; i++) {
      var list = slideshow.querySelectorAll(selectors[i]);
      if (list && list.length) {
        imgs = list;
        break;
      }
    }
    if (!imgs || !imgs.length) {
      return null;
    }
    var fallback = imgs[0];
    for (var j = 0; j < imgs.length; j++) {
      var img = imgs[j];
      var holder = img.closest('.jetpack-slideshow-slide') || img;
      var style = window.getComputedStyle(holder);
      if (!style) {
        continue;
      }
      if (style.display === 'none' || style.visibility === 'hidden') {
        continue;
      }
      var opacity = parseFloat(style.opacity || '1');
      if (opacity < 0.1) {
        continue;
      }
      return img;
    }
    return fallback;
  }

  function watchSlideshowForActiveSlide(slideshow, btn) {
    if (!slideshow || !btn) {
      return;
    }

    var scheduled = null;
    function queueUpdate() {
      if (scheduled) {
        clearTimeout(scheduled);
      }
      scheduled = setTimeout(updateIcon, 60);
    }

    function updateIcon() {
      scheduled = null;
      var img = getVisibleSlideshowImage(slideshow);
      if (img) {
        applyAdaptiveIcon(btn, img);
      }
    }

    updateIcon();

    if (slideshow._pmzIconObserver) {
      slideshow._pmzIconObserver.disconnect();
    }

    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];
          if (mutation.type === 'attributes' || mutation.type === 'childList') {
            queueUpdate();
            break;
          }
        }
      });
      observer.observe(slideshow, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['style', 'class', 'data-cycle-hash']
      });
      slideshow._pmzIconObserver = observer;
    }

    var controls = slideshow.querySelectorAll('.jetpack-slideshow-controls a');
    controls.forEach(function(ctrl) {
      ctrl.addEventListener('click', queueUpdate);
    });
  }

  function setMainButtonLoading(anchor) {
    if (!anchor || anchor.dataset.pmzLoading === '1') {
      return;
    }
    var label = anchor.querySelector('.pmz-label');
    if (!label) {
      return;
    }

    ensureMainSpinner(anchor);

    anchor.dataset.pmzOriginalLabel = label.textContent;
    anchor.dataset.pmzLoading = '1';

    label.textContent = getCreatingZipLabel();
    anchor.classList.add('pmz-button--loading');
    anchor.setAttribute('aria-busy', 'true');
    anchor.setAttribute('aria-disabled', 'true');

    if (anchor._pmzResetTimer) {
      clearTimeout(anchor._pmzResetTimer);
    }
    anchor._pmzResetTimer = window.setTimeout(function () {
      resetMainButton(anchor);
    }, MAIN_BUTTON_RESET_DELAY);
  }

  function resetMainButton(anchor) {
    if (!anchor || anchor.dataset.pmzLoading !== '1') {
      return;
    }

    var label = anchor.querySelector('.pmz-label');
    if (label && Object.prototype.hasOwnProperty.call(anchor.dataset, 'pmzOriginalLabel')) {
      label.textContent = anchor.dataset.pmzOriginalLabel;
    }

    anchor.classList.remove('pmz-button--loading');
    anchor.removeAttribute('aria-busy');
    anchor.removeAttribute('aria-disabled');

    delete anchor.dataset.pmzLoading;
    delete anchor.dataset.pmzOriginalLabel;

    if (anchor._pmzResetTimer) {
      clearTimeout(anchor._pmzResetTimer);
      anchor._pmzResetTimer = null;
    }
  }

  function resetAllMainButtons() {
    var buttons = document.querySelectorAll('a.pmz-download.pmz-button--loading');
    buttons.forEach(function (btn) {
      resetMainButton(btn);
    });
  }

  document.addEventListener('click', function (e) {
    var a = closest(e.target, 'a.pmz-download');
    if (a) {
      if (a.classList.contains('pmz-button--loading')) {
        e.preventDefault();
        return;
      }
      setMainButtonLoading(a);
      return;
    }

    var btn = closest(e.target, '.pmz-img-download');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      if (!window.PMZ_DATA) return;
      var postId = parseInt(window.PMZ_DATA.postId, 10);
      var attachmentId = parseInt(btn.getAttribute('data-attachment-id'), 10);
      if (!postId || !attachmentId) return;

      var base = window.PMZ_DATA.downloadBase;
      var nonce = window.PMZ_DATA.singleNonce;
      if (!base || !nonce) return;

      btn.setAttribute('aria-busy', 'true');
      btn.classList.add('pmz-img-download--active');

      var url = base + '?action=pmz_download_single'
        + '&post_id=' + encodeURIComponent(postId)
        + '&attachment_id=' + encodeURIComponent(attachmentId)
        + '&pmz_nonce=' + encodeURIComponent(nonce)
        + '&v=' + Date.now();
      navigateToUrl(url);
      return;
    }

    // Handle slideshow download buttons
    var slideshowBtn = closest(e.target, '.pmz-slideshow-download');
    if (slideshowBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (!window.PMZ_DATA) return;
      var postId = parseInt(window.PMZ_DATA.postId, 10);
      var slideshowIds = slideshowBtn.getAttribute('data-slideshow-ids');
      if (!postId || !slideshowIds) return;

      var base = window.PMZ_DATA.downloadBase;
      var nonce = window.PMZ_DATA.singleNonce;
      if (!base || !nonce) return;

      slideshowBtn.setAttribute('aria-busy', 'true');
      slideshowBtn.classList.add('pmz-slideshow-download--active');

      const safeIds = slideshowIds.split(',').map(encodeURIComponent).join(',');

      var url = base + '?action=pmz_download_slideshow'
        + '&post_id=' + encodeURIComponent(postId)
        + '&slideshow_ids=' + safeIds
        + '&pmz_nonce=' + encodeURIComponent(nonce)
        + '&v=' + Date.now();
      navigateToUrl(url);
      return;
    }
  });

  window.addEventListener('focus', resetAllMainButtons);
  window.addEventListener('pageshow', resetAllMainButtons);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      resetAllMainButtons();
    }
  });

  function extractAttachmentId(img) {
    if (!img || !img.className) return null;
    var match = (img.className.match(/wp-image-(\d+)/) || []);
    if (match[1]) return parseInt(match[1], 10);

    var dataId = img.getAttribute('data-id') || img.getAttribute('data-attachment-id');
    if (dataId && !isNaN(parseInt(dataId, 10))) {
      return parseInt(dataId, 10);
    }
    return null;
  }

  function extractSlideshowAttachmentIds(slideshow) {
    var galleryData = slideshow.getAttribute('data-gallery');
    
    if (!galleryData) {
      return [];
    }
    
    try {
      var gallery = JSON.parse(galleryData);
      
      var ids = gallery.map(function(item) {
        return parseInt(item.id, 10);
      }).filter(function(id) {
        return !isNaN(id) && id > 0;
      });
      
      return ids;
    } catch (e) {
      return [];
    }
  }

  function ensureWrapper(img) {
    var container = img.closest('figure, .wp-block-image, .pmz-img-wrapper');
    if (!container) {
      container = img.parentElement;
    }

    if (!container) {
      return null;
    }

    if (!container.classList.contains('pmz-img-wrapper')) {
      var style = window.getComputedStyle(container);
      if (style.position === 'static') {
        container.classList.add('pmz-inline-wrapper');
      }
      container.classList.add('pmz-img-wrapper');
    }

    if (container === img) {
      var span = document.createElement('span');
      span.className = 'pmz-img-wrapper pmz-inline-wrapper';
      img.parentNode.insertBefore(span, img);
      span.appendChild(img);
      container = span;
    }

    return container;
  }

  function createDownloadButton(attachmentId, label, iconUrl) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pmz-img-download';
    btn.setAttribute('data-attachment-id', attachmentId);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('data-tooltip', label);

    if (iconUrl) {
      var icon = document.createElement('img');
      icon.src = iconUrl;
      icon.alt = '';
      icon.width = 18;
      icon.height = 18;
      icon.decoding = 'async';
      icon.loading = 'lazy';
      icon.dataset.pmzIconTheme = iconUrl === ICONS.light ? 'light' : 'dark';
      btn.appendChild(icon);
    }

    var srText = document.createElement('span');
    srText.className = 'pmz-sr-only';
    srText.textContent = label;
    btn.appendChild(srText);

    return btn;
  }

  function createSlideshowDownloadButton(attachmentIds, label, iconUrl) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pmz-slideshow-download';
    btn.setAttribute('data-slideshow-ids', attachmentIds.join(','));
    btn.setAttribute('aria-label', label);
    btn.setAttribute('data-tooltip', label);

    if (iconUrl) {
      var icon = document.createElement('img');
      icon.src = iconUrl;
      icon.alt = '';
      icon.width = 18;
      icon.height = 18;
      icon.decoding = 'async';
      icon.loading = 'lazy';
      icon.dataset.pmzIconTheme = iconUrl === ICONS.light ? 'light' : 'dark';
      btn.appendChild(icon);
    }

    var srText = document.createElement('span');
    srText.className = 'pmz-sr-only';
    srText.textContent = label;
    btn.appendChild(srText);

    return btn;
  }

  function renderButtons() {
    if (!window.PMZ_DATA) {
      return;
    }
    var postId = parseInt(window.PMZ_DATA.postId, 10);
    var base = window.PMZ_DATA.downloadBase;
    var nonce = window.PMZ_DATA.singleNonce;

    if (!postId || !base || !nonce) {
      return;
    }

    var allowList = Array.isArray(window.PMZ_DATA.attachmentIds)
      ? window.PMZ_DATA.attachmentIds.map(function (id) { return parseInt(id, 10); })
      : [];

    var allowLookup = {};
    allowList.forEach(function (id) { if (id) allowLookup[id] = true; });

    var iconUrl = window.PMZ_DATA.icon;
    var label = window.PMZ_DATA.strings && window.PMZ_DATA.strings.downloadImage
      ? window.PMZ_DATA.strings.downloadImage
      : 'Download image';
    var slideshowLabel = 'Download slideshow images';

    var processed = new WeakSet();
    var insertedImgButtons = 0;
    var insertedSlideshowButtons = 0;

    // Process regular images
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function (img) {
      if (processed.has(img)) return;
      var attachmentId = extractAttachmentId(img);
      if (!attachmentId || !allowLookup[attachmentId]) return;

      var wrapper = ensureWrapper(img);
      if (!wrapper) return;

      if (wrapper.querySelector('.pmz-img-download[data-attachment-id="' + attachmentId + '"]')) {
        processed.add(img);
        return;
      }

      var btn = createDownloadButton(attachmentId, label, ICONS.dark || iconUrl);
      wrapper.appendChild(btn);
      applyAdaptiveIcon(btn, img);
      processed.add(img);
      insertedImgButtons++;
    });

    // Process slideshow galleries
    var slideshows = document.querySelectorAll('.jetpack-slideshow');
    
    slideshows.forEach(function (slideshow) {
      
      if (slideshow.querySelector('.pmz-slideshow-download')) {
        return; // Already has button
      }

      var slideshowIds = extractSlideshowAttachmentIds(slideshow);

      if (slideshowIds.length === 0) {
        return;
      }

      // Check if any of the slideshow images are in our allow list
      var validIds = slideshowIds.filter(function(id) {
        return allowLookup[id];
      });

      if (validIds.length === 0) {
        return;
      }
      
      // Make slideshow container relatively positioned if it isn't already
      var computedStyle = window.getComputedStyle(slideshow);
      if (computedStyle.position === 'static') {
        slideshow.style.position = 'relative';
      }

      var btn = createSlideshowDownloadButton(validIds, slideshowLabel, ICONS.dark || iconUrl);
      slideshow.appendChild(btn);
      watchSlideshowForActiveSlide(slideshow, btn);
      insertedSlideshowButtons++;
    });

    var featuredId = parseInt(window.PMZ_DATA.featuredId || 0, 10);
    if (featuredId && allowLookup[featuredId]) {
      var featuredContainers = document.querySelectorAll('.featured-article-image');
      featuredContainers.forEach(function (container) {
        if (!container) {
          return;
        }

        if (!container.classList.contains('pmz-img-wrapper')) {
          container.classList.add('pmz-img-wrapper');
        }

        if (container.querySelector('.pmz-img-download[data-attachment-id="' + featuredId + '"]')) {
          return;
        }

        var featuredBtn = createDownloadButton(featuredId, label, ICONS.dark || (window.PMZ_DATA && window.PMZ_DATA.icon) || '');
        container.appendChild(featuredBtn);
        var featuredImg = container.querySelector('img');
        applyAdaptiveIcon(featuredBtn, featuredImg);
      });
    }
  }

  ready(renderButtons);
  ready(resetAllMainButtons);

  // Also run after a short delay to catch dynamically added slideshows
  ready(function() {
    setTimeout(renderButtons, 1000);
    setTimeout(renderButtons, 3000);
    
    // Check for Jetpack slideshow initialization
    if (window.jQuery) {
      window.jQuery(document).on('jetpack-slideshow-initialized', function() {
        setTimeout(renderButtons, 100);
      });
    }
  });

  if ('MutationObserver' in window) {
    var observer = new MutationObserver(function (mutations) {
      var shouldRender = false;
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && ( // Element node
                node.classList.contains('jetpack-slideshow') ||
                node.querySelector && node.querySelector('.jetpack-slideshow')
            )) {
              shouldRender = true;
            }
          });
        }
        if (mutation.type === 'attributes' && 
            mutation.target.classList.contains('jetpack-slideshow') &&
            mutation.attributeName === 'data-processed') {
          shouldRender = true;
        }
      });
      if (shouldRender) {
        setTimeout(renderButtons, 100);
      }
    });
    observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['data-processed']
    });
  }
})();
