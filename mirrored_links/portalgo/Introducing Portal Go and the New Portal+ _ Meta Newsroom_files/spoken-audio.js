(function(){
  // Default selector mapping - will be made dynamic based on available sections
  const SELECTOR_MAP = {
    'title': '.entry-title',
    'highlights-title': '.highlights-title',
    'highlights-content': '.highlights-content', 
    'content': '.entry-content'
  };
  
  // This will be set dynamically per post based on available sections
  let ARTICLE_SELECTOR = [];
  
  const AUTO_SCROLL_MARGIN_VH = 25;
  const AUTO_SCROLL_THROTTLE_MS = 180;
  const AUTO_SCROLL_ENABLED = true;
  const ENABLE_TEXT_HIGHLIGHTING = true;
  const FALLBACK_MIN_DURATION = 0.04;
  const ALIGNMENT_TOLERANCE = 0.05; // seconds, tolerance between expected and actual token
  const DEBUG_TIMING = false; // Disable debug logging
  
  function setBtnLabel(btn, text){
    const label = btn.querySelector('.speechify-label');
    if (label) label.textContent = text;
    btn.setAttribute('aria-label', text);
  }

  function setBtnPlaying(btn, playing){
    btn.classList.toggle('is-playing', !!playing);
  }

  function showMessage(el, msg, color){
    let existing = el.querySelector('.speechify-msg');
    if (!existing) {
      existing = document.createElement('p');
      existing.className = 'speechify-msg';
      existing.style.marginTop = '8px';
      existing.style.fontSize = '0.9em';
      el.appendChild(existing);
    }
    existing.style.color = color || '#666';
    existing.textContent = msg || '';
  }

  function sanitizeForSpeech(raw, options){
    if (!raw) return '';
    const opts = options || {};
    const preserveUiTerms = !!opts.preserveUiTerms;
    let txt = raw;
    const leadingWhitespace = /^\s+/.test(txt);
    const trailingWhitespace = /\s+$/.test(txt);
    
    txt = txt.trim();
    
    // Remove URLs (including video URLs)
    txt = txt.replace(/\bhttps?:\/\/\S+/gi, '');
    txt = txt.replace(/\bwww\.\S+/gi, '');
    txt = txt.replace(/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/gi, '');
    
    // Remove file references (including mp4, images, etc.)
    txt = txt.replace(/\b[\w-]+\.(mp3|mp4|wav|m4a|pdf|docx?|xlsx?|pptx?|jpe?g|png|gif|webp|mov|webm|mkv|avi)\b/gi, '');
    
    // Remove common image-related text that might cause sync issues
    txt = txt.replace(/\b(alt text|fig\.|credit:|source:)\b/gi, ''); 
    
    // Remove common UI text that shouldn't be read
    if (!preserveUiTerms) {
      txt = txt.replace(/\b(related posts|skip to content|play video|watch video|video player|click to expand|view larger|zoom in)\b/gi, '');
    }
    
    // Remove multiple spaces and clean up
    txt = txt.replace(/\s{2,}/g, ' ');
    
    if (!txt.length) {
      return (leadingWhitespace || trailingWhitespace) ? ' ' : '';
    }

    if (leadingWhitespace) {
      txt = ' ' + txt;
    }

    if (trailingWhitespace) {
      txt = txt + ' ';
    }
    
    return txt;
  }

  function getArticleText(){
    // Handle multiple selectors for different sections
    const allTextSegments = [];
    
    for (const selector of ARTICLE_SELECTOR) {
      const root = document.querySelector(selector);
      if (!root) {
        if (DEBUG_TIMING) {
          console.log(`[ELABS DEBUG] Section not found: ${selector}`);
        }
        continue;
      }
      
      if (DEBUG_TIMING) {
        console.log(`[ELABS DEBUG] Processing section: ${selector}`);
      }
      
      const preserveUiTermsForSection = selector === '.entry-title' || selector === '.highlights-title';
      
      // Get all text-containing elements in document order
      const nodes = root.querySelectorAll([
        'h1','h2','h3','h4','h5','h6','p','li','td','th','blockquote','div'
      ].map(s => `${s}:not(.screen-reader-text):not(.sr-only)`).join(','));
      
      const skipSelectors = [
        'video','audio','iframe','figure','figcaption','img',
        'button','input','select','textarea', // Form elements and buttons
        '.wp-block-video','.wp-block-embed','.wp-block-audio','.wp-block-image',
        '.wp-block-code','.wp-block-preformatted','.wp-block-gallery','.wp-block-media-text',
        'nav','aside','header','footer','script','style',
        '.byline','.post-meta','.entry-meta','.breadcrumbs',
        '.share','.tags','.social','.wp-caption',
        '.video-container','.media-player','.image-container',
        '.pmz-inline-wrapper','.pmz-img-wrapper','.pmz-img-download', // Plugin-specific
        '.pmz-sr-only','.sr-only','.screen-reader-text', // Screen reader only
        '.download-btn','.media-controls','.overlay-text', // Common UI elements
        '.mejs-container','.wp-video-shortcode','.mejs-video','.mejs-cannotplay' // Video player elements
      ].join(',');

      const textSegments = [];
      
      // For title sections, get the text directly if it's a simple element
      if (selector === '.entry-title' || selector === '.highlights-title') {
        const text = sanitizeForSpeech(root.textContent || '', { preserveUiTerms: true });
        if (text && text.length >= 2) {
          textSegments.push(text);
        }
      } else {
        // For content sections, process all text nodes
        nodes.forEach(node => {
          // Skip if this node or any parent should be excluded
          if (node.closest(skipSelectors)) return;
          
          // Extract only the direct text content, excluding nested elements that should be skipped
          let text = '';
          const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: function(textNode) {
                // Check if this text node is inside a skipped element
                const parent = textNode.parentElement;
                if (parent && parent.closest(skipSelectors)) {
                  return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
              }
            }
          );
          
          const textParts = [];
          while (walker.nextNode()) {
            const nodeText = walker.currentNode.nodeValue || '';
            if (nodeText.trim()) {
              textParts.push(nodeText);
            }
          }
          
          text = textParts.join(' ');
          text = sanitizeForSpeech(text, { preserveUiTerms: preserveUiTermsForSection });
          
          if (!text || text.length < 2 || /^\W+$/.test(text)) return;
          
          // Additional filtering for URLs that might slip through
          if (/^https?:\/\//.test(text.trim()) || /\.(mp4|mp3|avi|mov|webm)$/i.test(text.trim())) {
            return;
          }
          
          textSegments.push(text);
        });
      }
      
      if (textSegments.length > 0) {
        const sectionText = textSegments.join(' ').replace(/\s{2,}/g, ' ').trim();
        if (sectionText) {
          allTextSegments.push(sectionText);
          if (DEBUG_TIMING) {
            console.log(`[ELABS DEBUG] Section ${selector} text length:`, sectionText.length);
            console.log(`[ELABS DEBUG] Section ${selector} first 100 chars:`, sectionText.substring(0, 100));
          }
        }
      }
    }
    
    // Join all sections with a brief pause indicator (this will be handled in PHP)
    const combined = allTextSegments.join(' ... ').replace(/\s{2,}/g, ' ').trim();
    const out = sanitizeForSpeech(combined, { preserveUiTerms: true });
    
    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Total extracted article text length:', out.length);
      console.log('[ELABS DEBUG] First 200 chars:', out.substring(0, 200));
    }
    
    return out.length > 12000 ? out.slice(0, 12000) : out;
  }

  function wrapWordsOnce(roots){
    if (!roots) return;
    
    // Handle both single element and array of elements
    const elements = Array.isArray(roots) ? roots : [roots];
    
    elements.forEach(root => {
      if (!root || root.__elabsWrapped) return;
      const preserveUiTerms = root.matches('.entry-title, .highlights-title');
      
      // Create a tree walker that only processes text nodes
      const walker = document.createTreeWalker(
        root, 
        NodeFilter.SHOW_TEXT, 
        {
          acceptNode: function(node) {
            // Skip text nodes that are inside media elements or other non-readable content
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            
            const skipSelectors = [
              'img', 'video', 'audio', 'iframe', 'figure', 'figcaption',
              'nav', 'aside', 'footer', 'script', 'style',
              'button', 'input', 'select', 'textarea', // Form elements and buttons
              '.wp-block-image', '.wp-block-video', '.wp-block-embed', 
              '.wp-block-audio', '.wp-block-code', '.wp-block-preformatted',
              '.wp-block-gallery', '.wp-block-media-text',
              '.byline', '.post-meta', '.entry-meta', '.breadcrumbs',
              '.share', '.tags', '.social', '.wp-caption',
              '.video-container', '.media-player', '.image-container',
              '.pmz-inline-wrapper', '.pmz-img-wrapper', '.pmz-img-download', // Plugin-specific image wrapper
              '.pmz-sr-only', '.sr-only', '.screen-reader-text', // Screen reader only text
              '.download-btn', '.media-controls', '.overlay-text', // Common UI elements
              '.mejs-container', '.wp-video-shortcode', '.mejs-video', '.mejs-cannotplay' // Video player elements
            ];
            
            // Check if the text node or any of its ancestors should be skipped
            if (parent.closest(skipSelectors.join(','))) {
              return NodeFilter.FILTER_REJECT;
            }
            
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      
      const nodes = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }

      nodes.forEach(node=>{
        if (!node.nodeValue) return;
        
        // Check if this node should be skipped based on its parent
        const parent = node.parentElement;
        if (parent) {
          const skipSelectors = [
            'img', 'video', 'audio', 'iframe', 'figure', 'figcaption',
            'nav', 'aside', 'footer', 'script', 'style',
            'button', 'input', 'select', 'textarea', // Form elements and buttons
            '.wp-block-image', '.wp-block-video', '.wp-block-embed', 
            '.wp-block-audio', '.wp-block-code', '.wp-block-preformatted',
            '.wp-block-gallery', '.wp-block-media-text',
            '.byline', '.post-meta', '.entry-meta', '.breadcrumbs',
            '.share', '.tags', '.social', '.wp-caption',
            '.video-container', '.media-player', '.image-container',
            '.pmz-inline-wrapper', '.pmz-img-wrapper', '.pmz-img-download', // Plugin-specific image wrapper
            '.pmz-sr-only', '.sr-only', '.screen-reader-text', // Screen reader only text
            '.download-btn', '.media-controls', '.overlay-text', // Common UI elements
            '.mejs-container', '.wp-video-shortcode', '.mejs-video', '.mejs-cannotplay' // Video player elements
          ].join(',');
          
          if (parent.closest(skipSelectors)) {
            if (DEBUG_TIMING) {
              console.log('[ELABS DEBUG] Skipping text node in filtered element:', node.nodeValue.trim(), 'parent:', parent.tagName, parent.className);
            }
            return;
          }
        }
        
        // Filter out problematic content that shouldn't be spoken
        const originalText = node.nodeValue;
        const cleanedText = sanitizeForSpeech(originalText, { preserveUiTerms });
        
        if (DEBUG_TIMING && cleanedText !== originalText) {
          console.log('[ELABS DEBUG] Text sanitized:', originalText, '->', cleanedText);
        }
        
        // Update the node with cleaned text before processing
        node.nodeValue = cleanedText;
        
        const parts = node.nodeValue.split(/(\s+)/);
        if (!parts.length) return;
        
        const frag = document.createDocumentFragment();
        parts.forEach(tok=>{
          if (/^\s+$/.test(tok)) { 
            frag.appendChild(document.createTextNode(tok)); 
            return; 
          }
          if (!tok.trim()) return; // Skip empty tokens
          
          const span = document.createElement('span');
          span.className = 'speechify-word';
          span.textContent = tok;
          frag.appendChild(span);
        });
        
        if (node.parentNode) {
          node.parentNode.replaceChild(frag, node);
        }
      });
      
      root.__elabsWrapped = true;
    });
  }

  function clearAllHighlights(roots){
    if (!roots) return;
    
    // Handle both single element and array of elements
    const elements = Array.isArray(roots) ? roots : [roots];
    
    elements.forEach(root => {
      if (!root) return;
      root.querySelectorAll('.speechify-word.speechify-active').forEach(el => el.classList.remove('speechify-active'));
    });
  }

  let _lastAutoScrollTs = 0;
  function isOutsideComfortZone(el){
    if (!AUTO_SCROLL_ENABLED || !el) return false;
    const rect = el.getBoundingClientRect();
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const topMargin = (AUTO_SCROLL_MARGIN_VH/100) * vh;
    const bottomMargin = vh - topMargin;
    const mid = rect.top + rect.height/2;
    return (mid < topMargin) || (mid > bottomMargin);
  }

  function scrollActiveIntoView(el){
    if (!AUTO_SCROLL_ENABLED || !el) return;
    const now = (window.performance && performance.now) ? performance.now() : Date.now();
    if (now - _lastAutoScrollTs < AUTO_SCROLL_THROTTLE_MS) return;
    _lastAutoScrollTs = now;
    if (isOutsideComfortZone(el)) {
      el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    }
  }

  function makeHighlighter(words, starts, ends){
    if (!ENABLE_TEXT_HIGHLIGHTING || !words.length) return null;
    let active = -1;
    
    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Creating highlighter for', words.length, 'words');
      console.log('[ELABS DEBUG] First 10 word timings:');
      for (let i = 0; i < Math.min(10, words.length); i++) {
        console.log(`  Word ${i}: '${words[i].textContent}' (${starts[i]?.toFixed(3) || 'undefined'}-${ends[i]?.toFixed(3) || 'undefined'})`);
      }
    }
    
    function setActive(i){
      if (i === active) return;
      if (active >= 0 && words[active]) {
        words[active].classList.remove('speechify-active');
      }
      active = i;
      if (active >= 0 && words[active]) {
        const el = words[active];
        el.classList.add('speechify-active');
        scrollActiveIntoView(el);
        if (DEBUG_TIMING) {
          console.log(`[ELABS DEBUG] Highlighting word ${i}: '${el.textContent}' at time ${el.dataset.start}-${el.dataset.end}`);
        }
      }
    }
    
    function findIndex(t){
      // Find the word that should be active at time t
      for (let i = 0; i < starts.length; i++) {
        if (t >= starts[i] && t < ends[i]) {
          return i;
        }
      }
      // If no exact match, find the closest word that has started but not ended
      for (let i = 0; i < starts.length; i++) {
        if (t >= starts[i] && (i === starts.length - 1 || t < starts[i + 1])) {
          return i;
        }
      }
      return -1;
    }
    
    return function onTimeUpdate(t){
      if (!starts || !starts.length) return;
      
      const i = findIndex(t);
      if (DEBUG_TIMING && i !== active) {
        console.log(`[ELABS DEBUG] Time ${t.toFixed(3)}s -> word index ${i} (was ${active})`);
      }
      setActive(i);
    };
  }

  // Utility function to create a debug toggle
  function createDebugToggle() {
    if (!DEBUG_TIMING) return;
    
    const toggle = document.createElement('button');
    toggle.textContent = 'Debug Timing';
    toggle.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;padding:5px;background:#fff;border:1px solid #ccc;';
    toggle.onclick = function() {
      const words = document.querySelectorAll('.speechify-word');
      words.forEach((word, i) => {
        const start = word.dataset.start;
        const end = word.dataset.end;
        word.title = `${i}: ${start}-${end}s`;
        word.style.border = '1px solid rgba(255,0,0,0.3)';
      });
      toggle.remove();
    };
    document.body.appendChild(toggle);
  }

  // Better timing data extraction
  function extractBestTimingData(raw, normalized) {
    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Extracting timing data from:', { raw, normalized });
    }
    
    // Try to find the best quality timing data
    let bestData = [];
    
    // First preference: normalized data if it exists and has good timing info
    if (Array.isArray(normalized) && normalized.length > 0) {
      const hasGoodTiming = normalized.some(item => 
        item && typeof item.start === 'number' && typeof item.end === 'number'
      );
      if (hasGoodTiming) {
        if (DEBUG_TIMING) console.log('[ELABS DEBUG] Using normalized alignment data');
        return normalized;
      }
    }
    
    // Second preference: raw data with proper structure
    if (raw && typeof raw === 'object') {
      // Try different possible structures
      const candidates = [
        raw.alignment,
        raw.words,
        raw.characters,
        raw.segments,
        raw.data?.words,
        raw.data?.alignment
      ].filter(Boolean);
      
      for (const candidate of candidates) {
        if (Array.isArray(candidate) && candidate.length > 0) {
          const hasGoodTiming = candidate.some(item => 
            item && (typeof item.start === 'number' || typeof item.timestamp === 'number' || Array.isArray(item.timestamp))
          );
          if (hasGoodTiming) {
            if (DEBUG_TIMING) console.log('[ELABS DEBUG] Using raw alignment data from:', candidate);
            return candidate;
          }
        }
      }
    }
    
    if (DEBUG_TIMING) console.warn('[ELABS DEBUG] No good timing data found');
    return [];
  }

  // Function to detect alignment URL from audio URL
  function getAlignmentUrlFromAudio(audioUrl) {
    if (!audioUrl) return null;
    // Replace .mp3 with .alignment.json
    return audioUrl.replace(/\.mp3$/i, '.alignment.json');
  }

  function sanitizeAlignmentText(text) {
    return String(text)
      .replace(/<[^>]*>?/g, '')
      .replace(/[\u0000-\u001F]+/g, '')
      .trim();
  }

  function isNumericArray(value) {
    if (!Array.isArray(value)) return false;
    return value.every(item => {
      const num = Number(item);
      return Number.isFinite(num);
    });
  }

  function sanitizeNumericArray(value) {
    return value.map(item => Number(item)).filter(num => Number.isFinite(num));
  }

  function sanitizeAlignmentArray(items) {
    if (!Array.isArray(items)) return [];
    const sanitized = [];
    for (const item of items) {
      if (!item || typeof item !== 'object') {
        continue;
      }

      const clean = {};
      for (const [key, rawValue] of Object.entries(item)) {
        if (typeof rawValue === 'string') {
          const cleaned = sanitizeAlignmentText(rawValue);
          if (cleaned !== '') {
            clean[key] = cleaned;
          }
        } else if (Array.isArray(rawValue)) {
          if (isNumericArray(rawValue)) {
            const numericValues = sanitizeNumericArray(rawValue);
            if (numericValues.length) {
              clean[key] = numericValues;
            }
          } else {
            const nested = sanitizeAlignmentArray(rawValue);
            if (nested.length) {
              clean[key] = nested;
            }
          }
        } else if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
          clean[key] = rawValue;
        } else if (typeof rawValue === 'boolean') {
          clean[key] = rawValue;
        }
      }

      if (typeof clean.text !== 'string' || clean.text === '') {
        const fallback = clean.word ?? clean.character ?? clean.value;
        if (typeof fallback === 'string' && fallback !== '') {
          clean.text = fallback;
        }
      }

      if (typeof clean.text === 'string' && clean.text !== '') {
        sanitized.push(clean);
      }
    }
    return sanitized;
  }

  function sanitizeAlignmentPayload(payload, depth = 0) {
    if (depth > 5 || payload == null) {
      return null;
    }

    if (Array.isArray(payload)) {
      const sanitizedArray = sanitizeAlignmentArray(payload);
      return sanitizedArray.length ? sanitizedArray : null;
    }

    if (typeof payload !== 'object') {
      return null;
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(payload)) {
      if (Array.isArray(value)) {
        if (isNumericArray(value)) {
          const numeric = sanitizeNumericArray(value);
          if (numeric.length) {
            sanitized[key] = numeric;
          }
        } else {
          const nestedArray = sanitizeAlignmentArray(value);
          if (nestedArray.length) {
            sanitized[key] = nestedArray;
          }
        }
      } else if (value && typeof value === 'object') {
        const nested = sanitizeAlignmentPayload(value, depth + 1);
        if (Array.isArray(nested)) {
          if (nested.length) sanitized[key] = nested;
        } else if (nested && Object.keys(nested).length) {
          sanitized[key] = nested;
        }
      } else if (typeof value === 'string') {
        const cleaned = sanitizeAlignmentText(value);
        if (cleaned !== '') {
          sanitized[key] = cleaned;
        }
      } else if (typeof value === 'number' && Number.isFinite(value)) {
        sanitized[key] = value;
      } else if (typeof value === 'boolean') {
        sanitized[key] = value;
      }
    }

    return Object.keys(sanitized).length ? sanitized : null;
  }
  
  // Function to fetch alignment data from URL
  async function fetchAlignmentFromUrl(alignmentUrl) {
    if (!alignmentUrl) return null;
    
    try {
      if (DEBUG_TIMING) console.log('[ELABS DEBUG] Fetching alignment from:', alignmentUrl);
      
      const response = await fetch(alignmentUrl, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (DEBUG_TIMING) console.warn(`[ELABS DEBUG] Alignment fetch failed: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      if (DEBUG_TIMING) console.log('[ELABS DEBUG] Fetched alignment data:', data);

      const sanitized = sanitizeAlignmentPayload(data);
      if (!sanitized) {
        if (DEBUG_TIMING) console.warn('[ELABS DEBUG] Alignment data failed sanitization');
        return null;
      }

      return sanitized;
    } catch (error) {
      if (DEBUG_TIMING) console.warn('[ELABS DEBUG] Error fetching alignment:', error);
      return null;
    }
  }

  // Function to aggregate character-level timing into word-level timing
  function buildWordTimingsFromCharacters(words, characterData) {
    if (!words.length || !characterData) {
      if (DEBUG_TIMING) console.warn('[ELABS DEBUG] buildWordTimingsFromCharacters: Missing words or characterData');
      return null;
    }
    
    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] buildWordTimingsFromCharacters: Starting with', words.length, 'words');
      console.log('[ELABS DEBUG] Character data type:', typeof characterData);
      console.log('[ELABS DEBUG] Character data keys:', Object.keys(characterData));
    }
    
    const starts = new Float32Array(words.length);
    const ends = new Float32Array(words.length);
    
    // Parse character data into a consistent format
    const chars = [];
    
    // Handle the specific format from your debug output
    if (characterData.characters && characterData.character_start_times_seconds && characterData.character_end_times_seconds) {
      if (DEBUG_TIMING) console.log('[ELABS DEBUG] Using characters + timing arrays format');
      
      const characters = characterData.characters;
      const startTimes = characterData.character_start_times_seconds;
      const endTimes = characterData.character_end_times_seconds;
      
      if (!Array.isArray(characters) || !Array.isArray(startTimes) || !Array.isArray(endTimes)) {
        if (DEBUG_TIMING) console.warn('[ELABS DEBUG] Expected arrays but got:', typeof characters, typeof startTimes, typeof endTimes);
        return null;
      }
      
      if (DEBUG_TIMING) console.log('[ELABS DEBUG] Processing', characters.length, 'characters with timing');
      
      for (let i = 0; i < characters.length; i++) {
        const ch = characters[i];
        const start = startTimes[i];
        const end = endTimes[i];
        
        if (ch == null || start == null) continue;
        chars.push({ ch: ch.toString(), s: +start, e: +(end || start) });
      }
    } else if (Array.isArray(characterData)) {
      // Handle other character data formats
      if (DEBUG_TIMING) console.log('[ELABS DEBUG] Using array format character data');
      
      for (let i = 0; i < characterData.length; i++) {
        const item = characterData[i];
        if (!item || typeof item !== 'object') continue;
        
        const ch = (item.character ?? item.char ?? item.c ?? item.text ?? '').toString();
        const start = item.start ?? item.start_time ?? 
          (item.timestamp && item.timestamp.start) ?? 
          (Array.isArray(item.timestamp) ? item.timestamp[0] : null);
        const end = item.end ?? item.end_time ?? 
          (item.timestamp && item.timestamp.end) ?? 
          (Array.isArray(item.timestamp) ? item.timestamp[1] : start);
        
        if (!ch || start == null) continue;
        chars.push({ ch, s: +start, e: +(end || start) });
      }
    } else {
      if (DEBUG_TIMING) console.warn('[ELABS DEBUG] Unrecognized character data format');
      return null;
    }
    
    if (!chars.length) {
      if (DEBUG_TIMING) console.warn('[ELABS DEBUG] No valid character data found after parsing');
      return null;
    }
    
    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Parsed', chars.length, 'characters');
      console.log('[ELABS DEBUG] First 10 parsed chars:', chars.slice(0, 10));
      console.log('[ELABS DEBUG] Last 10 parsed chars:', chars.slice(-10));
    }
    
    let charIndex = 0;
    
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const wordText = words[wordIndex].textContent || '';
      const cleanedWord = wordText.replace(/[^A-Za-z0-9']+/g, '');
      
      if (!cleanedWord) {
        // Empty or punctuation-only word
        const prevEnd = wordIndex > 0 ? ends[wordIndex - 1] : 0;
        starts[wordIndex] = prevEnd;
        ends[wordIndex] = prevEnd;
        words[wordIndex].dataset.start = starts[wordIndex].toFixed(3);
        words[wordIndex].dataset.end = ends[wordIndex].toFixed(3);
        if (DEBUG_TIMING) console.log(`[ELABS DEBUG] Word ${wordIndex}: '${wordText}' -> empty/punct, time: ${prevEnd}`);
        continue;
      }
      
      let wordStartTime = null;
      let wordEndTime = null;
      let matchedChars = 0;
      const originalCharIndex = charIndex;
      
      // Try to match characters from the word
      for (let k = 0; k < cleanedWord.length; k++) {
        const needChar = cleanedWord[k].toLowerCase();
        
        // Skip whitespace, punctuation, and potential gaps in character data
        while (charIndex < chars.length) {
          const ch = chars[charIndex].ch.toLowerCase();
          if (/\s/.test(ch) || (/[^\w]/.test(ch) && !/[a-z0-9']/.test(ch))) {
            charIndex++;
            continue;
          }
          break;
        }
        
        if (charIndex >= chars.length) {
          if (DEBUG_TIMING) console.warn(`[ELABS DEBUG] Ran out of characters at word ${wordIndex} ('${wordText}'), char ${k} ('${needChar}')`);
          break;
        }
        
        const currentChar = chars[charIndex];
        const foundChar = currentChar.ch.toLowerCase();
        
        if (foundChar === needChar) {
          if (wordStartTime === null) wordStartTime = currentChar.s;
          wordEndTime = currentChar.e;
          matchedChars++;
          charIndex++;
        } else {
          // Character mismatch - try to advance and find a match
          let foundMatch = false;
          
          // Look ahead more aggressively to handle content gaps
          for (let lookahead = 1; lookahead <= 10 && charIndex + lookahead < chars.length; lookahead++) {
            const lookaheadChar = chars[charIndex + lookahead].ch.toLowerCase();
            if (lookaheadChar === needChar) {
              // Skip the intervening characters (likely from filtered content)
              charIndex += lookahead;
              const matchChar = chars[charIndex];
              if (wordStartTime === null) wordStartTime = matchChar.s;
              wordEndTime = matchChar.e;
              matchedChars++;
              charIndex++;
              foundMatch = true;
              
              if (DEBUG_TIMING && lookahead > 1) {
                console.log(`[ELABS DEBUG] Found '${needChar}' after skipping ${lookahead} chars (content gap)`);
              }
              break;
            }
          }
          
          if (!foundMatch) {
            if (DEBUG_TIMING) {
              console.warn(`[ELABS DEBUG] Character mismatch: word '${cleanedWord}' char '${needChar}' vs data '${foundChar}' at position ${charIndex}`);
            }
            charIndex++; // Skip this character and continue
          }
        }
      }
      
      // Set timing for this word
      if (wordStartTime !== null && wordEndTime !== null && matchedChars > 0) {
        starts[wordIndex] = wordStartTime;
        ends[wordIndex] = Math.max(wordEndTime, wordStartTime + FALLBACK_MIN_DURATION);
        
        if (DEBUG_TIMING) {
          console.log(`[ELABS DEBUG] Word ${wordIndex}: '${wordText}' -> matched ${matchedChars}/${cleanedWord.length} chars, time: ${wordStartTime.toFixed(3)}-${ends[wordIndex].toFixed(3)}`);
        }
      } else {
        // Fallback timing
        const prevEnd = wordIndex > 0 ? ends[wordIndex - 1] : 0;
        starts[wordIndex] = prevEnd;
        ends[wordIndex] = prevEnd + FALLBACK_MIN_DURATION;
        
        if (DEBUG_TIMING) {
          console.log(`[ELABS DEBUG] Word ${wordIndex}: '${wordText}' -> NO MATCH (matched ${matchedChars}/${cleanedWord.length}), fallback time: ${starts[wordIndex].toFixed(3)}-${ends[wordIndex].toFixed(3)}`);
        }
      }
      
      words[wordIndex].dataset.start = starts[wordIndex].toFixed(3);
      words[wordIndex].dataset.end = ends[wordIndex].toFixed(3);
    }
    
    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Character-to-word mapping completed successfully');
      console.log('[ELABS DEBUG] Total timing range:', starts[0]?.toFixed(3), 'to', ends[words.length - 1]?.toFixed(3));
    }
    
    return { starts, ends };
  }

  function normalizeWordToken(s){
    return (s || '')
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[^0-9a-z'\p{L}\p{N}]+/gu, '');
  }

  function extractWordEntries(raw, normalized){
    const entries = [];
    const push = (start, end, text) => {
      if (!isFinite(start)) start = entries.length ? entries[entries.length-1].end : 0;
      if (!isFinite(end) || end <= start) end = start + FALLBACK_MIN_DURATION;
      entries.push({ start: +start, end: +end, text: text || '' });
    };

    const getTime = obj => {
      if (!obj || typeof obj !== 'object') return { start: null, end: null };
      let start = null;
      let end = null;
      const candidates = ['start', 'from', 's', 't'];
      const endCandidates = ['end', 'to', 'e'];
      candidates.some(key=>{
        if (typeof obj[key] === 'number') { start = obj[key]; return true; }
        if (obj.timestamp && typeof obj.timestamp[key] === 'number') { start = obj.timestamp[key]; return true; }
        if (Array.isArray(obj.timestamp) && typeof obj.timestamp[0] === 'number') { start = obj.timestamp[0]; return true; }
        return false;
      });
      endCandidates.some(key=>{
        if (typeof obj[key] === 'number') { end = obj[key]; return true; }
        if (obj.timestamp && typeof obj.timestamp[key] === 'number') { end = obj.timestamp[key]; return true; }
        if (Array.isArray(obj.timestamp) && typeof obj.timestamp[1] === 'number') { end = obj.timestamp[1]; return true; }
        return false;
      });
      return { start, end };
    };

    const collectWords = (source, type) => {
      if (!Array.isArray(source)) return false;
      source.forEach(word => {
        if (!word || typeof word !== 'object') return;
        const text = word.text ?? word.word ?? word.value ?? word.character ?? '';
        if (text === '') return;
        const time = getTime(word);
        push(time.start, time.end, text);
      });
      return source.length > 0;
    };

    let found = false;
    if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.words) && collectWords(raw.words, 'words')) {
        found = true;
      } else if (raw.normalized && Array.isArray(raw.normalized.words) && collectWords(raw.normalized.words, 'normalized.words')) {
        found = true;
      } else if (Array.isArray(raw.segments) && collectWords(raw.segments, 'segments')) {
        found = true;
      } else if (raw.alignment && Array.isArray(raw.alignment) && collectWords(raw.alignment, 'alignment')) {
        found = true;
      } else if (raw.data && Array.isArray(raw.data.words) && collectWords(raw.data.words, 'data.words')) {
        found = true;
      } else if (raw.alignments && Array.isArray(raw.alignments.words) && collectWords(raw.alignments.words, 'alignments.words')) {
        found = true;
      }
    }

    if (!found && Array.isArray(normalized)) {
      normalized.forEach(item => {
        if (!item || typeof item !== 'object') return;
        const start = isFinite(item.start) ? item.start : 0;
        let end = isFinite(item.end) ? item.end : start + FALLBACK_MIN_DURATION;
        if (end <= start) end = start + FALLBACK_MIN_DURATION;
        entries.push({ start, end, text: item.text || '' });
      });
    }

    return entries;
  }

  function buildWordTimings(words, normalized, raw){
    const len = words.length;
    if (!len) return null;

    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Building word timings for', len, 'words');
      console.log('[ELABS DEBUG] Raw alignment data:', raw);
      console.log('[ELABS DEBUG] Normalized alignment data:', normalized);
    }

    // First, try to use character-level data if available
    let characterData = null;
    if (raw && typeof raw === 'object') {
      // Check for the specific format: {characters: [], character_start_times_seconds: [], character_end_times_seconds: []}
      if (raw.characters && raw.character_start_times_seconds && raw.character_end_times_seconds) {
        characterData = raw;
        if (DEBUG_TIMING) console.log('[ELABS DEBUG] Found character data with timing arrays:', raw.characters.length, 'characters');
      } else {
        // Try different possible character data locations
        const characterCandidates = [
          raw.characters,
          raw.character,
          raw.alignment?.characters,
          raw.data?.characters,
          Array.isArray(raw) ? raw : null // Direct array of characters
        ].filter(Boolean);
        
        for (const candidate of characterCandidates) {
          if (Array.isArray(candidate) && candidate.length > 0) {
            // Check if this looks like character data
            const sample = candidate[0];
            if (sample && typeof sample === 'object' && 
                (sample.character || sample.char || sample.c) &&
                (typeof sample.start === 'number' || sample.timestamp)) {
              characterData = candidate;
              if (DEBUG_TIMING) console.log('[ELABS DEBUG] Found character data array:', characterData.length, 'characters');
              break;
            }
          }
        }
      }
    }
    
    // If we have character data, use it for more accurate timing
    if (characterData) {
      const result = buildWordTimingsFromCharacters(words, characterData);
      if (result) {
        if (DEBUG_TIMING) console.log('[ELABS DEBUG] Successfully built word timings from character data');
        return result;
      }
    }
    
    // Fallback to the original word-level approach
    if (DEBUG_TIMING) console.log('[ELABS DEBUG] Falling back to word-level timing approach');
    
    // Use the improved timing data extraction
    const bestTimingData = extractBestTimingData(raw, normalized);
    const entries = extractWordEntries(raw, bestTimingData);
    
    const starts = new Float32Array(len);
    const ends   = new Float32Array(len);

    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Best timing data:', bestTimingData);
      console.log('[ELABS DEBUG] Extracted entries:', entries);
    }

    if (!entries.length) {
      if (DEBUG_TIMING) console.warn('[ELABS DEBUG] No timing entries found, using fallback');
      return null;
    }

    // Create a copy of entries we can consume
    const remaining = entries.map((entry, idx) => ({ ...entry, idx }));
    const assignedEntries = new Array(entries.length).fill(false);

    let lastEnd = 0;

    for (let i = 0; i < len; i++) {
      const token = words[i].textContent || '';
      if (!token.trim()) {
        starts[i] = lastEnd;
        ends[i] = lastEnd;
        words[i].dataset.start = starts[i].toFixed(3);
        words[i].dataset.end = ends[i].toFixed(3);
        if (DEBUG_TIMING) console.log(`[ELABS DEBUG] Word ${i}: Empty token, time: ${lastEnd}`);
        continue;
      }

      const wordToken = normalizeWordToken(token);
      if (!wordToken) {
        starts[i] = lastEnd;
        ends[i] = lastEnd;
        words[i].dataset.start = starts[i].toFixed(3);
        words[i].dataset.end = ends[i].toFixed(3);
        if (DEBUG_TIMING) console.log(`[ELABS DEBUG] Word ${i}: No normalized token for '${token}', time: ${lastEnd}`);
        continue;
      }

      let bestMatch = null;
      let bestScore = Infinity;

      // Prefer sequential matching over text matching to maintain audio sync
      for (let j = 0; j < remaining.length; j++) {
        const entry = remaining[j];
        if (assignedEntries[entry.idx]) continue;

        const entryToken = normalizeWordToken(entry.text);
        if (!entryToken) continue;

        const tokenMatch = entryToken === wordToken;
        const sequentialMatch = j < 3; // Prefer entries near the front of remaining array
        
        // Prioritize sequential matching with slight preference for text match
        const textScore = tokenMatch ? 0 : 0.5;
        const sequentialScore = sequentialMatch ? 0 : j * 0.1;
        const score = textScore + sequentialScore;

        if (score < bestScore) {
          bestScore = score;
          bestMatch = { entry, index: j };
        }

        // For exact text matches that are reasonably sequential, take it immediately
        if (tokenMatch && j < 5) {
          bestMatch = { entry, index: j };
          break;
        }
      }

      let start, end;

      if (bestMatch) {
        start = bestMatch.entry.start;
        end = bestMatch.entry.end;
        assignedEntries[bestMatch.entry.idx] = true;
        remaining.splice(bestMatch.index, 1);
        
        if (DEBUG_TIMING) {
          console.log(`[ELABS DEBUG] Word ${i}: '${token}' -> '${bestMatch.entry.text}' (${start.toFixed(3)}-${end.toFixed(3)})`);
        }
      } else {
        start = lastEnd;
        end = start + FALLBACK_MIN_DURATION;
        if (DEBUG_TIMING) {
          console.log(`[ELABS DEBUG] Word ${i}: '${token}' -> NO MATCH, fallback time: ${start.toFixed(3)}-${end.toFixed(3)}`);
        }
      }

      if (!isFinite(start)) start = lastEnd;
      if (!isFinite(end) || end <= start) end = start + FALLBACK_MIN_DURATION;
      if (start < lastEnd) {
        if (DEBUG_TIMING) console.log(`[ELABS DEBUG] Word ${i}: Adjusting start time from ${start} to ${lastEnd} to maintain sequence`);
        start = lastEnd;
        end = start + FALLBACK_MIN_DURATION;
      }

      starts[i] = start;
      ends[i] = end;
      words[i].dataset.start = start.toFixed(3);
      words[i].dataset.end = end.toFixed(3);
      lastEnd = end;
    }

    // If there are still unassigned of the original entries, we can adjust outputs slightly
    // But since we already ensured monotonic start/end, we can leave as is

    return { starts, ends };
  }

  function computeFallbackTimings(words, duration){
    const len = words.length;
    const starts = new Float32Array(len);
    const ends   = new Float32Array(len);
    let total = isFinite(duration) && duration > 0 ? duration : len * FALLBACK_MIN_DURATION;
    const slice = total / Math.max(1, len);
    for (let i = 0; i < len; i++) {
      starts[i] = i * slice;
      ends[i] = (i + 1) * slice;
      words[i].dataset.start = starts[i].toFixed(3);
      words[i].dataset.end = ends[i].toFixed(3);
    }
    return { starts, ends };
  }

  async function initPlayer(el){
    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Initializing ElevenLabs player');
      console.log('[ELABS DEBUG] Player element:', el);
    }
    
    const btn = el.querySelector('.speechify-btn');
    const pauseBtn = el.querySelector('.speechify-pause-btn');
    const audio = el.querySelector('audio');
    const speedSelect = el.querySelector('.speechify-speed-select');
    const rewindBtn = el.querySelector('.speechify-rewind-btn');
    const skipBtn = el.querySelector('.speechify-skip-btn');
    if (!btn || !audio) {
      if (DEBUG_TIMING) console.warn('[ELABS DEBUG] Missing required elements: btn or audio');
      return;
    }

    const labelEl = btn.querySelector('.speechify-label');
    if (!labelEl) {
      if (DEBUG_TIMING) console.warn('[ELABS DEBUG] Missing speechify-label element');
      return;
    }

    btn.dataset.state = 'idle';

    // First, get the alignment data to determine available sections
    const alignmentScript = el.querySelector('.elabs-alignment-data');
    let inlineData = { alignment: [], alignment_raw: null, tts_text: '', audio_url: '', available_sections: [] };
    if (alignmentScript && alignmentScript.textContent) {
      try {
        inlineData = JSON.parse(alignmentScript.textContent);
        if (DEBUG_TIMING) {
          console.log('[ELABS DEBUG] Parsed inline alignment data:', inlineData);
        }
      } catch (e) {
        console.warn('Invalid ElevenLabs inline alignment data', e);
      }
    } else {
      if (DEBUG_TIMING) {
        console.log('[ELABS DEBUG] No inline alignment script found');
      }
    }

    // Set dynamic selectors based on available sections BEFORE word collection
    const availableSections = Array.isArray(inlineData.available_sections) ? inlineData.available_sections : [];
    if (availableSections.length > 0) {
      ARTICLE_SELECTOR = availableSections.map(section => SELECTOR_MAP[section]).filter(Boolean);
      if (DEBUG_TIMING) {
        console.log('[ELABS DEBUG] Dynamic selectors based on available sections:', {
          availableSections,
          selectors: ARTICLE_SELECTOR
        });
      }
    } else {
      // Fallback to default behavior if no sections data
      ARTICLE_SELECTOR = ['.entry-title', '.entry-content'];
      if (DEBUG_TIMING) {
        console.log('[ELABS DEBUG] No available sections data, using fallback selectors:', ARTICLE_SELECTOR);
      }
    }

    // Now collect all article sections based on the correct ARTICLE_SELECTOR array
    const articleRoots = [];
    for (const selector of ARTICLE_SELECTOR) {
      const root = document.querySelector(selector);
      if (root) {
        articleRoots.push(root);
        if (DEBUG_TIMING) {
          console.log(`[ELABS DEBUG] Found article section: ${selector}`);
        }
      } else {
        if (DEBUG_TIMING) {
          console.log(`[ELABS DEBUG] Article section not found: ${selector}`);
        }
      }
    }
    
    if (articleRoots.length > 0 && ENABLE_TEXT_HIGHLIGHTING) {
      if (DEBUG_TIMING) console.log('[ELABS DEBUG] Wrapping words in', articleRoots.length, 'article sections');
      wrapWordsOnce(articleRoots);
    }
    
    // Collect all words from all article sections in order
    const words = [];
    if (ENABLE_TEXT_HIGHLIGHTING && articleRoots.length > 0) {
      // Process sections in the same order as ARTICLE_SELECTOR
      for (let i = 0; i < ARTICLE_SELECTOR.length; i++) {
        const selector = ARTICLE_SELECTOR[i];
        const root = articleRoots.find(r => r.matches && r.matches(selector));
        if (root) {
          const sectionWords = Array.from(root.querySelectorAll('.speechify-word'));
          words.push(...sectionWords);
          if (DEBUG_TIMING) {
            console.log(`[ELABS DEBUG] Added ${sectionWords.length} words from section ${selector} (${sectionWords[0]?.textContent?.substring(0, 20) || 'empty'}...)`);
          }
        }
      }
    }
    
    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Found', words.length, 'words to highlight');
    }

    const initialAlignment = Array.isArray(inlineData.alignment) ? inlineData.alignment : [];
    const initialAlignmentRaw = inlineData.alignment_raw && typeof inlineData.alignment_raw === 'object' ? inlineData.alignment_raw : null;
    const initialTtsText = typeof inlineData.tts_text === 'string' ? inlineData.tts_text : '';
    const preAudioUrl = el.dataset.audioUrl || inlineData.audio_url || '';
    let preAlignmentUrl = el.dataset.alignment || el.dataset.alignmentUrl || '';
    
    if (DEBUG_TIMING) {
      console.log('[ELABS DEBUG] Initial data extracted:', {
        alignmentLength: initialAlignment.length,
        hasAlignmentRaw: !!initialAlignmentRaw,
        ttsTextLength: initialTtsText.length,
        preAudioUrl,
        preAlignmentUrl
      });
    }

    let currentAlignment = initialAlignment;
    let currentAlignmentRaw = initialAlignmentRaw;
    let timing = null;
    let highlighter = null;
    let floatingPlayer = null;
    let isOriginalPlayerVisible = true;
    let pendingPollTimer = null;
    let pendingPollInterval = 5;
    let pendingHistoryId = '';
    let attemptedAlignmentRecovery = false;

    function updateControlVisibility(){
      const active = el.classList.contains('elabs-is-active');
      const preparing = el.classList.contains('elabs-is-preparing');
      const showControls = active && !preparing;

      if (speedSelect) {
        const speedWrap = speedSelect.closest('.speechify-speed');
        speedSelect.disabled = !showControls;
        speedSelect.style.display = showControls ? '' : 'none';
        if (speedWrap) {
          speedWrap.style.display = showControls ? '' : 'none';
        }
      }
      if (pauseBtn) {
        pauseBtn.style.display = showControls ? 'inline-block' : 'none';
      }
      if (rewindBtn) {
        rewindBtn.style.display = showControls ? 'inline-flex' : 'none';
        rewindBtn.disabled = !showControls;
      }
      if (skipBtn) {
        skipBtn.style.display = showControls ? 'inline-flex' : 'none';
        skipBtn.disabled = !showControls;
      }

      if (floatingPlayer) {
        const floatingSpeedSelect = floatingPlayer.querySelector('.speechify-speed-select');
        const floatingPauseBtn = floatingPlayer.querySelector('.speechify-pause-btn');
        const floatingRewindBtn = floatingPlayer.querySelector('.speechify-rewind-btn');
        const floatingSkipBtn = floatingPlayer.querySelector('.speechify-skip-btn');

        if (floatingSpeedSelect) {
          const floatingSpeedWrap = floatingSpeedSelect.closest('.speechify-speed');
          floatingSpeedSelect.disabled = !showControls;
          floatingSpeedSelect.style.display = showControls ? '' : 'none';
          if (floatingSpeedWrap) {
            floatingSpeedWrap.style.display = showControls ? '' : 'none';
          }
        }
        if (floatingPauseBtn) {
          floatingPauseBtn.style.display = showControls ? 'inline-block' : 'none';
        }
        if (floatingRewindBtn) {
          floatingRewindBtn.style.display = showControls ? 'inline-flex' : 'none';
          floatingRewindBtn.disabled = !showControls;
        }
        if (floatingSkipBtn) {
          floatingSkipBtn.style.display = showControls ? 'inline-flex' : 'none';
          floatingSkipBtn.disabled = !showControls;
        }
      }
    }

    function setPlayerActive(active){
      el.classList.toggle('speechify-is-active', !!active);
      el.classList.toggle('elabs-is-active', !!active);
      if (floatingPlayer) {
        floatingPlayer.classList.toggle('speechify-is-active', !!active);
        floatingPlayer.classList.toggle('elabs-is-active', !!active);
      }
      updateControlVisibility();
    }

    function setPreparing(preparing){
      el.classList.toggle('elabs-is-preparing', !!preparing);
      if (floatingPlayer) {
        floatingPlayer.classList.toggle('elabs-is-preparing', !!preparing);
      }
      updateControlVisibility();
    }

    updateControlVisibility();

    function createFloatingPlayer() {
      if (floatingPlayer || !AUTO_SCROLL_ENABLED) return;
      
      floatingPlayer = document.createElement('div');
      floatingPlayer.className = 'elabs-floating-player';
      floatingPlayer.innerHTML = `
        <div class="speechify-controls">
          <button type="button" class="speechify-btn" aria-live="polite" aria-label="Listen to Article">
            <span class="speechify-icon" aria-hidden="true">
              <svg width="46" height="14" viewBox="0 0 46 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.604915" y1="4.58026" x2="0.604915" y2="9.41958" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="22.7842" y1="4.58026" x2="22.7842" y2="9.41958" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="0.604915" y1="-0.604915" x2="5.44424" y2="-0.604915" transform="matrix(7.59195e-08 1 1 -2.51671e-08 45.166 3.97534)" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="4.63671" y1="3.37054" x2="4.63671" y2="10.6295" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="26.4137" y1="3.37054" x2="26.4137" y2="10.6295" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="0.604915" y1="-0.604915" x2="7.8639" y2="-0.604915" transform="matrix(7.59198e-08 1 1 -2.51672e-08 19.7596 2.76562)" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="0.604915" y1="-0.604915" x2="7.8639" y2="-0.604915" transform="matrix(7.59198e-08 1 1 -2.51672e-08 41.5365 2.76562)" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="8.26617" y1="2.16058" x2="8.26617" y2="11.8392" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="30.0431" y1="2.16058" x2="30.0431" y2="11.8392" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="0.604915" y1="-0.604915" x2="10.2836" y2="-0.604915" transform="matrix(7.59198e-08 1 1 -2.51672e-08 16.1301 1.55566)" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="0.604915" y1="-0.604915" x2="10.2836" y2="-0.604915" transform="matrix(7.59198e-08 1 1 -2.51672e-08 37.907 1.55566)" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="11.8957" y1="0.950863" x2="11.8957" y2="13.0492" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
                <line x1="33.6726" y1="0.950863" x2="33.6726" y2="13.0492" stroke="#0064E0" stroke-width="1.20983" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="speechify-label ui-body4">Listen to Article</span>
          </button>
          <button type="button" class="speechify-seek-btn speechify-rewind-btn" style="display: none;" aria-label="Rewind 10 seconds">
            <span class="speechify-icon" aria-hidden="true">
              <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 4L10 10L18 16V4Z" fill="#0064E0"/>
                <path d="M26 4L18 10L26 16V4Z" fill="#0064E0"/>
              </svg>
            </span>
          </button>
          <button type="button" class="speechify-pause-btn" style="display: none;" aria-label="Pause">
            <span class="speechify-pause-label">Pause</span>
          </button>
          <button type="button" class="speechify-seek-btn speechify-skip-btn" style="display: none;" aria-label="Skip ahead 10 seconds">
            <span class="speechify-icon" aria-hidden="true">
              <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4L18 10L10 16V4Z" fill="#0064E0"/>
                <path d="M18 4L26 10L18 16V4Z" fill="#0064E0"/>
              </svg>
            </span>
          </button>
          <div class="speechify-speed">
            <select class="speechify-speed-select" aria-label="Playback speed">
              <option value="0.25">0.25×</option>
              <option value="0.5">0.5×</option>
              <option value="1" selected>1×</option>
              <option value="1.25">1.25×</option>
              <option value="1.5">1.5×</option>
              <option value="2">2×</option>
            </select>
          </div>
        </div>
      `;
      
      // Apply floating styles
      floatingPlayer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        background: white;
        border: 1px solid #d9e1ef;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: none;
      `;
      
      document.body.appendChild(floatingPlayer);
      floatingPlayer.classList.toggle('speechify-is-active', el.classList.contains('elabs-is-active'));
      floatingPlayer.classList.toggle('elabs-is-active', el.classList.contains('elabs-is-active'));
      floatingPlayer.classList.toggle('elabs-is-preparing', el.classList.contains('elabs-is-preparing'));
      
      // Sync floating controls with main controls
      const floatingBtn = floatingPlayer.querySelector('.speechify-btn');
      const floatingPauseBtn = floatingPlayer.querySelector('.speechify-pause-btn');
      const floatingSpeedSelect = floatingPlayer.querySelector('.speechify-speed-select');
      const floatingRewindBtn = floatingPlayer.querySelector('.speechify-rewind-btn');
      const floatingSkipBtn = floatingPlayer.querySelector('.speechify-skip-btn');
      
      // Copy current state
      floatingBtn.classList.toggle('is-playing', btn.classList.contains('is-playing'));
      if (speedSelect && floatingSpeedSelect) {
        floatingSpeedSelect.value = speedSelect.value;
        floatingSpeedSelect.disabled = speedSelect.disabled;
      }
      if (rewindBtn && floatingRewindBtn) {
        floatingRewindBtn.style.display = rewindBtn.style.display;
        floatingRewindBtn.disabled = rewindBtn.disabled;
      }
      if (skipBtn && floatingSkipBtn) {
        floatingSkipBtn.style.display = skipBtn.style.display;
        floatingSkipBtn.disabled = skipBtn.disabled;
      }
      
      // Set up event listeners for floating controls
      floatingBtn.addEventListener('click', function() {
        btn.click(); // Delegate to main button
      });
      
      if (floatingPauseBtn) {
        floatingPauseBtn.addEventListener('click', function() {
          if (pauseBtn) {
            pauseBtn.click(); // Delegate to main pause button
          }
        });
      }
      
      if (floatingSpeedSelect) {
        floatingSpeedSelect.addEventListener('change', function() {
          if (speedSelect) {
            speedSelect.value = floatingSpeedSelect.value;
            speedSelect.dispatchEvent(new Event('change'));
          }
        });
      }
      
      if (floatingRewindBtn) {
        floatingRewindBtn.addEventListener('click', function() {
          if (rewindBtn) {
            rewindBtn.click();
          }
        });
      }
      
      if (floatingSkipBtn) {
        floatingSkipBtn.addEventListener('click', function() {
          if (skipBtn) {
            skipBtn.click();
          }
        });
      }

      updateControlVisibility();
      
      // Keep floating player in sync with main player
      const syncFloatingPlayer = () => {
        if (!floatingPlayer) return;
        
        const mainLabel = btn.querySelector('.speechify-label');
        const floatingLabel = floatingBtn.querySelector('.speechify-label');
        const mainLabelText = mainLabel ? String(mainLabel.textContent || '').trim() : '';
        const displayLabel = mainLabelText.toLowerCase() === 'stop listening' ? 'Stop' : (mainLabelText || 'Listen to Article');
        if (floatingLabel) {
          floatingLabel.textContent = displayLabel;
        }
        
        floatingBtn.classList.toggle('is-playing', btn.classList.contains('is-playing'));
        const mainAria = (btn.getAttribute('aria-label') || mainLabelText || 'Listen to Article').trim();
        const floatingAria = mainAria.toLowerCase() === 'stop listening' ? 'Stop' : mainAria;
        floatingBtn.setAttribute('aria-label', floatingAria);
        
        // Sync pause button states
        if (pauseBtn && floatingPauseBtn) {
          const mainPauseLabel = pauseBtn.querySelector('.speechify-pause-label');
          const floatingPauseLabel = floatingPauseBtn.querySelector('.speechify-pause-label');
          if (mainPauseLabel && floatingPauseLabel) {
            floatingPauseLabel.textContent = mainPauseLabel.textContent;
            floatingPauseBtn.setAttribute('aria-label', pauseBtn.getAttribute('aria-label') || 'Pause');
          }
        }
        
        if (rewindBtn && floatingRewindBtn) {
          floatingRewindBtn.style.display = rewindBtn.style.display;
          floatingRewindBtn.disabled = rewindBtn.disabled;
          floatingRewindBtn.setAttribute('aria-label', rewindBtn.getAttribute('aria-label') || 'Rewind 10 seconds');
        }
        
        if (skipBtn && floatingSkipBtn) {
          floatingSkipBtn.style.display = skipBtn.style.display;
          floatingSkipBtn.disabled = skipBtn.disabled;
          floatingSkipBtn.setAttribute('aria-label', skipBtn.getAttribute('aria-label') || 'Skip ahead 10 seconds');
        }
      };
      
      // Monitor main player changes
      const observer = new MutationObserver(syncFloatingPlayer);
      observer.observe(btn, { attributes: true, childList: true, subtree: true });
      syncFloatingPlayer();
    }

    function applyPlaybackRate(rate){
      el._elabsPlaybackRate = rate;
      audio.playbackRate = rate;
      if (speedSelect && speedSelect.value !== String(rate)) {
        speedSelect.value = String(rate);
      }
    }

    if (speedSelect) {
      speedSelect.style.display = 'none';
      speedSelect.disabled = true;
      el._elabsPlaybackRate = parseFloat(speedSelect.value) || 1;
      speedSelect.addEventListener('change', function(){
        applyPlaybackRate(parseFloat(speedSelect.value));
      });
    } else {
      el._elabsPlaybackRate = 1;
    }

    function seekRelative(offsetSeconds){
      if (!audio) return;
      let current = 0;
      try {
        current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      } catch (err) {
        current = 0;
      }
      let target = current + offsetSeconds;
      if (Number.isFinite(audio.duration) && !Number.isNaN(audio.duration)) {
        target = Math.min(Math.max(0, target), audio.duration);
      } else if (target < 0) {
        target = 0;
      }
      try {
        audio.currentTime = target;
      } catch (err) {
        return;
      }
      audio.dispatchEvent(new Event('timeupdate'));
    }

    if (rewindBtn) {
      rewindBtn.addEventListener('click', function(){
        seekRelative(-10);
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', function(){
        seekRelative(10);
      });
    }

    async function rebuildHighlight(alignment, alignmentRaw, audioUrl = null, alignmentUrl = null){
      if (!ENABLE_TEXT_HIGHLIGHTING || !words.length) return;
      
      if (DEBUG_TIMING) {
        console.log('[ELABS DEBUG] rebuildHighlight called with:');
        console.log('[ELABS DEBUG] - Alignment length:', Array.isArray(alignment) ? alignment.length : 'not array');
        console.log('[ELABS DEBUG] - Raw alignment type:', typeof alignmentRaw);
        console.log('[ELABS DEBUG] - Audio URL:', audioUrl);
        console.log('[ELABS DEBUG] - Alignment URL:', alignmentUrl);
        console.log('[ELABS DEBUG] - DOM words count:', words.length);
      }
      
      let finalAlignment = alignment;
      let finalAlignmentRaw = alignmentRaw;
      
      // Check if we have any real alignment data before proceeding
      const hasEmbeddedAlignment = Array.isArray(alignment) && alignment.length > 0 && 
        alignment.some(item => item && typeof item.start === 'number');
      const hasRawAlignment = alignmentRaw && typeof alignmentRaw === 'object' && 
        (alignmentRaw.characters || alignmentRaw.character_start_times_seconds);
      
      if (DEBUG_TIMING) {
        console.log('[ELABS DEBUG] Alignment check:', {
          hasEmbeddedAlignment,
          hasRawAlignment,
          hasAlignmentUrl: !!alignmentUrl,
          hasAudioUrl: !!audioUrl
        });
      }
      
      if (!hasEmbeddedAlignment && !hasRawAlignment) {
        let fetchUrl = alignmentUrl;
        
        // If no explicit alignment URL, try to derive it from audio URL
        if (!fetchUrl && audioUrl) {
          fetchUrl = getAlignmentUrlFromAudio(audioUrl);
          if (DEBUG_TIMING) console.log('[ELABS DEBUG] Derived alignment URL from audio:', fetchUrl);
        }
        
        if (fetchUrl) {
          if (DEBUG_TIMING) console.log('[ELABS DEBUG] Attempting to fetch alignment from URL:', fetchUrl);
          
          const fetchedAlignment = await fetchAlignmentFromUrl(fetchUrl);
          if (fetchedAlignment) {
            if (DEBUG_TIMING) console.log('[ELABS DEBUG] Successfully fetched alignment data:', fetchedAlignment);
            
            // Update current alignment for future use
            currentAlignment = Array.isArray(fetchedAlignment) ? fetchedAlignment : 
              (fetchedAlignment.alignment || fetchedAlignment.words || []);
            currentAlignmentRaw = fetchedAlignment;
            
            finalAlignment = currentAlignment;
            finalAlignmentRaw = currentAlignmentRaw;
          } else {
            if (DEBUG_TIMING) console.warn('[ELABS DEBUG] Failed to fetch alignment data from URL, attempting history refresh');
            const recovered = await recoverAlignmentFromHistory();
            if (recovered && Array.isArray(recovered.alignment) && recovered.alignment.length) {
              finalAlignment = recovered.alignment;
              finalAlignmentRaw = recovered.alignment_raw;
            } else if (recovered && recovered.alignment_raw) {
              finalAlignmentRaw = recovered.alignment_raw;
              finalAlignment = Array.isArray(currentAlignment) ? currentAlignment : [];
            } else {
              if (DEBUG_TIMING) console.warn('[ELABS DEBUG] Alignment recovery failed - skipping timing setup');
              return; // Don't set up timing without alignment data
            }
          }
        } else {
          if (DEBUG_TIMING) console.warn('[ELABS DEBUG] No alignment source available - skipping timing setup');
          return; // Don't set up timing without alignment data
        }
      }
      
      if (DEBUG_TIMING) {
        console.log('[ELABS DEBUG] Proceeding with timing setup using:', {
          finalAlignmentLength: Array.isArray(finalAlignment) ? finalAlignment.length : 'not array',
          finalAlignmentRawType: typeof finalAlignmentRaw
        });
      }
      
      let result = buildWordTimings(words, finalAlignment, finalAlignmentRaw);
      if (!result) {
        if (DEBUG_TIMING) console.warn('[ELABS DEBUG] buildWordTimings returned null - skipping timing setup');
        return; // Don't fall back to generic timing
      }
      
      timing = result;
      highlighter = makeHighlighter(words, timing.starts, timing.ends);
      
      // Don't automatically highlight - wait for audio to start
      if (DEBUG_TIMING) console.log('[ELABS DEBUG] Timing setup complete - ready for audio playback');
    }

    // Only set up timing if we have initial alignment data available OR if we have audio URL to derive alignment from
    const hasEmbeddedAlignment = (Array.isArray(initialAlignment) && initialAlignment.length > 0) ||
      (initialAlignmentRaw && typeof initialAlignmentRaw === 'object' && 
       (initialAlignmentRaw.characters || initialAlignmentRaw.character_start_times_seconds));
    
    const hasAlignmentSource = hasEmbeddedAlignment || preAlignmentUrl || preAudioUrl;
    
    if (hasAlignmentSource) {
      if (DEBUG_TIMING) {
        console.log('[ELABS DEBUG] Alignment source available:', {
          hasEmbeddedAlignment,
          hasAlignmentUrl: !!preAlignmentUrl,
          hasAudioUrl: !!preAudioUrl
        });
        console.log('[ELABS DEBUG] Setting up timing for existing audio');
      }
      // Ensure we have words ready before setting up highlighting
      if (words.length > 0) {
        rebuildHighlight(initialAlignment, initialAlignmentRaw, preAudioUrl, preAlignmentUrl);
      } else {
        if (DEBUG_TIMING) console.warn('[ELABS DEBUG] No words found for highlighting - skipping timing setup');
      }
    } else {
      if (DEBUG_TIMING) console.log('[ELABS DEBUG] No alignment source available, waiting for audio generation');
    }

    function resetUI(){
      clearPendingPoll();
      setPreparing(false);
      setPlayerActive(false);
      setBtnLabel(btn, 'Listen to Article');
      setBtnPlaying(btn, false);
      btn.dataset.state = 'idle';
      clearAllHighlights(articleRoots);
      
      // Clean up floating player
      if (el._cleanupFloatingPlayer) {
        el._cleanupFloatingPlayer();
        el._cleanupFloatingPlayer = null;
      }
    }

    function playUI(){
      setPreparing(false);
      setPlayerActive(true);
      setBtnLabel(btn, 'Stop');
      setBtnPlaying(btn, true);
      btn.dataset.state = 'playing';
      audio.style.display = 'block';
      applyPlaybackRate(el._elabsPlaybackRate || 1);
      
      // Create floating player when audio starts and auto scroll is enabled
      if (AUTO_SCROLL_ENABLED) {
        createFloatingPlayer();
        manageFloatingPlayerVisibility();
      }
    }

    async function loadAudio(url){
      audio.pause();
      audio.removeAttribute('src');
      while (audio.firstChild) audio.removeChild(audio.firstChild);
      const source = document.createElement('source');
      source.type = 'audio/mpeg';
      source.src = url;
      audio.appendChild(source);
      audio.load();
      return new Promise(resolve=>{
        if (audio.readyState >= 1) {
          resolve();
        } else {
          audio.addEventListener('loadedmetadata', function handle(){
            audio.removeEventListener('loadedmetadata', handle);
            resolve();
          });
        }
      });
    }

    function manageFloatingPlayerVisibility() {
      if (!floatingPlayer || !AUTO_SCROLL_ENABLED) return;
      
      const updateVisibility = () => {
        if (!floatingPlayer) {
          return;
        }
        const playerRect = el.getBoundingClientRect();
        const isOriginalVisible = playerRect.bottom > 0 && playerRect.top < window.innerHeight;
        
        if (isOriginalVisible !== isOriginalPlayerVisible) {
          isOriginalPlayerVisible = isOriginalVisible;
          
          if (isOriginalVisible) {
            // Original player is visible, hide floating player
            floatingPlayer.style.display = 'none';
          } else {
            // Original player is not visible, show floating player
            floatingPlayer.style.display = 'block';
          }
        }
      };
      
      // Check visibility on scroll
      const throttledUpdate = throttle(updateVisibility, 100);
      window.addEventListener('scroll', throttledUpdate);
      window.addEventListener('resize', throttledUpdate);
      
      // Initial check
      updateVisibility();
      
      // Store cleanup function
      el._cleanupFloatingPlayer = () => {
        window.removeEventListener('scroll', throttledUpdate);
        window.removeEventListener('resize', throttledUpdate);
        if (floatingPlayer && floatingPlayer.parentNode) {
          floatingPlayer.parentNode.removeChild(floatingPlayer);
        }
        floatingPlayer = null;
      };
    }

    function throttle(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    function clearPendingPoll() {
      if (pendingPollTimer) {
        clearTimeout(pendingPollTimer);
        pendingPollTimer = null;
      }
    }

    function schedulePendingPoll(intervalSeconds) {
      const seconds = Math.max(3, Number(intervalSeconds) || pendingPollInterval || 5);
      pendingPollInterval = seconds;
      clearPendingPoll();
      pendingPollTimer = setTimeout(() => {
        pollPendingStatus().catch(err => {
          console.error('ElevenLabs poll failure:', err);
          // Exponential-ish backoff capped at 15 seconds.
          const nextInterval = Math.min(15, (pendingPollInterval || 5) * 1.5);
          schedulePendingPoll(nextInterval);
        });
      }, seconds * 1000);
    }

    async function pollPendingStatus() {
      const data = new FormData();
      data.append('action', 'elabs_generate');
      data.append('post_id', el.dataset.post || '');
      data.append('voice', el.dataset.voice || '');
      data.append('nonce', el.dataset.nonce || '');
      data.append('poll', '1');

      const resp = await fetch(window.ajaxurl || '/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: data,
        credentials: 'same-origin'
      });
      const json = await resp.json();
      if (!json) {
        throw new Error('Empty poll response');
      }
      if (json.success !== true || !json.data) {
        const message = json.data && json.data.message ? String(json.data.message) : 'Unable to check audio status.';
        showMessage(el, message, '#b00');
        resetUI();
        return;
      }
    const status = await handleGenerationPayload(json.data, { fromPoll: true });
    if (status === 'pending' || status === 'ready' || status === 'error') {
      return;
    }
  }

  async function recoverAlignmentFromHistory() {
    if (attemptedAlignmentRecovery) return null;
    attemptedAlignmentRecovery = true;
    console.info('[SpokenAudio] Attempting to refresh alignment from history…');

    const data = new FormData();
    data.append('action', 'elabs_fetch_alignment');
    data.append('post_id', el.dataset.post || '');
    data.append('voice', el.dataset.voice || '');
    data.append('nonce', el.dataset.nonce || '');

    try {
      const resp = await fetch(window.ajaxurl || '/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: data,
        credentials: 'same-origin'
      });
      const json = await resp.json();
      if (!json || json.success !== true || !json.data) {
        console.error('[SpokenAudio] Alignment recovery failed:', json);
        return null;
      }

      const payload = json.data;
      const recoveredAlignment = Array.isArray(payload.alignment) ? payload.alignment : [];
      const recoveredRaw = payload.alignment_raw && typeof payload.alignment_raw === 'object' ? payload.alignment_raw : null;

      if (!recoveredAlignment.length && !recoveredRaw) {
        console.warn('[SpokenAudio] Alignment recovery returned empty payload');
        return null;
      }

      currentAlignment = recoveredAlignment;
      currentAlignmentRaw = recoveredRaw;
      if (payload.alignment_url) {
        preAlignmentUrl = payload.alignment_url;
      }
      if (payload.history_item_id) {
        pendingHistoryId = payload.history_item_id;
      }

      console.info('[SpokenAudio] Alignment recovered and cached via history API');
      return {
        alignment: currentAlignment,
        alignment_raw: currentAlignmentRaw
      };
    } catch (err) {
      console.error('[SpokenAudio] Alignment recovery request failed:', err);
      return null;
    }
  }

  async function handleGenerationPayload(payload, options = {}) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload from server');
    }

      const status = (payload.status || '').toLowerCase();
      if (status === 'pending') {
        if (payload.poll_interval) {
          pendingPollInterval = Math.max(3, Number(payload.poll_interval) || 5);
        }
        pendingHistoryId = payload.history_item_id || '';
        btn.dataset.state = 'preparing';
        setPreparing(true);
        if (!options.fromPoll) {
          showMessage(el, 'Article audio is being generated. Will play once available.', '#000');
        }
        schedulePendingPoll(pendingPollInterval);
        return 'pending';
      }

      if (status === 'error') {
        clearPendingPoll();
        resetUI();
        showMessage(el, payload.error || 'Audio generation failed. Please try again.', '#b00');
        return 'error';
      }

    const audioUrl = payload.url || payload.audio_url || '';
    if (!audioUrl) {
      throw new Error('Missing audio URL in payload.');
    }

    clearPendingPoll();
    attemptedAlignmentRecovery = false;

      currentAlignment = Array.isArray(payload.alignment) ? payload.alignment : [];
      currentAlignmentRaw = payload.alignment_raw && typeof payload.alignment_raw === 'object' ? payload.alignment_raw : null;

      if (Array.isArray(payload.available_sections) && payload.available_sections.length > 0) {
        const newSelectors = payload.available_sections.map(section => SELECTOR_MAP[section]).filter(Boolean);
        if (newSelectors.length > 0) {
          ARTICLE_SELECTOR = newSelectors;
          if (DEBUG_TIMING) {
            console.log('[ELABS DEBUG] Updated selectors from payload:', {
              availableSections: payload.available_sections,
              selectors: ARTICLE_SELECTOR
            });
          }

          const newArticleRoots = [];
          for (const selector of ARTICLE_SELECTOR) {
            const root = document.querySelector(selector);
            if (root) {
              newArticleRoots.push(root);
            }
          }

          if (newArticleRoots.length > 0 && ENABLE_TEXT_HIGHLIGHTING) {
            wrapWordsOnce(newArticleRoots);

            words.length = 0;
            for (let i = 0; i < ARTICLE_SELECTOR.length; i++) {
              const selector = ARTICLE_SELECTOR[i];
              const root = newArticleRoots.find(r => r.matches && r.matches(selector));
              if (root) {
                const sectionWords = Array.from(root.querySelectorAll('.speechify-word'));
                words.push(...sectionWords);
                if (DEBUG_TIMING) {
                  console.log(`[ELABS DEBUG] Re-added ${sectionWords.length} words from section ${selector}`);
                }
              }
            }

            articleRoots.length = 0;
            articleRoots.push(...newArticleRoots);

            if (DEBUG_TIMING) {
              console.log('[ELABS DEBUG] Re-collected', words.length, 'words after selector update');
            }
          }
        }
      }

      if (!currentAlignment.length && currentAlignmentRaw) {
        currentAlignment = [];
      }

      await loadAudio(audioUrl);
      const alignmentUrl = payload.alignment_url || '';
      if (alignmentUrl) {
        preAlignmentUrl = alignmentUrl;
      }
      await rebuildHighlight(currentAlignment, currentAlignmentRaw, audioUrl, alignmentUrl);

      if (timing && highlighter) {
        playUI();
        showMessage(el, '');
        audio.play().catch(()=>{});
        return 'ready';
      }

      throw new Error('Failed to prepare timing data.');
    }

  async function ensureAndPlay(){
    const hasSource = !!audio.querySelector('source');

      if (hasSource) {
        // Check if player is in active state (showing controls) - then stop regardless of pause state
        const isPlayerActive = el.classList.contains('speechify-is-active') || el.classList.contains('elabs-is-active');
        
        if (isPlayerActive) {
          // Stop playback completely - reset everything
          isManualPause = false;
          audio.pause();
          audio.currentTime = 0;
          resetUI();
        } else if (audio.paused) {
          // Player not active and audio paused - start playback
          isManualPause = false;
          playUI();
          audio.play().catch(()=>{});
        }
        return;
      }

      // Use preloaded audio/alignment if available.
      if (preAudioUrl && currentAlignment && currentAlignment.length) {
        try {
          setBtnLabel(btn, 'Preparing...');
          setBtnPlaying(btn, true);
          setPreparing(true);
          btn.dataset.state = 'preparing';
          setPlayerActive(true);
          await loadAudio(preAudioUrl);
          await rebuildHighlight(currentAlignment, currentAlignmentRaw, preAudioUrl, preAlignmentUrl);
          
          // Only start playing if we successfully set up timing
          if (timing && highlighter) {
            playUI();
            audio.play().catch(()=>{});
          } else {
            throw new Error('Failed to set up word timing - alignment data may be missing');
          }
          return;
        } catch (err) {
          console.error('Failed to load cached ElevenLabs audio/alignment', err);
          resetUI();
        }
      }

      // Fetch via AJAX (may return cached data).
      setBtnLabel(btn, 'Preparing...');
      setBtnPlaying(btn, true);
      setPreparing(true);
      btn.dataset.state = 'preparing';
      setPlayerActive(true);
      showMessage(el, '', '#666');

    clearPendingPoll();

    const data = new FormData();
    data.append('action', 'elabs_generate');
    data.append('post_id', el.dataset.post || '');
    data.append('voice', el.dataset.voice || '');
    data.append('nonce', el.dataset.nonce || '');

    try {
      const resp = await fetch(window.ajaxurl || '/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: data,
        credentials: 'same-origin'
      });
      const json = await resp.json();
      if (!json) {
        throw new Error('Empty response from server');
      }

      if (json.success !== true) {
        const data = json.data && typeof json.data === 'object' ? json.data : {};
        const status = (data.status || '').toString().toLowerCase();
        if (status === 'quota_exceeded') {
          showMessage(el, 'Unable to process now. Try again later.', '#000');
        } else if (status === 'timeout' || status === 'http_request_failed') {
          showMessage(el, 'Audio service timed out. Please try again shortly.', '#b00');
        } else {
          const message = data.message ? String(data.message) : 'Unable to generate audio.';
          showMessage(el, message, '#b00');
        }
        resetUI();
        return;
      }

      const status = await handleGenerationPayload(json.data || {}, { fromPoll: false });
      if (status === 'pending') {
        return;
      }
      if (status !== 'ready') {
        throw new Error('Unexpected status from handler: ' + status);
      }
    } catch (err) {
      console.error('ElevenLabs error:', err);
      showMessage(el, 'Unable to fetch audio. Please try again later.', '#b00');
      resetUI();
      }
    }

    btn.addEventListener('click', ensureAndPlay);

    // Track if pause was manual (via pause button) vs automatic (via stop)
    let isManualPause = false;

    // Pause/Resume button functionality
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function() {
        if (audio.paused) {
          // Resume playback
          isManualPause = false;
          audio.play();
          pauseBtn.querySelector('.speechify-pause-label').textContent = 'Pause';
          pauseBtn.setAttribute('aria-label', 'Pause');
          
          // Update floating pause button if it exists
          if (floatingPlayer) {
            const floatingPauseBtn = floatingPlayer.querySelector('.speechify-pause-btn');
            if (floatingPauseBtn) {
              floatingPauseBtn.querySelector('.speechify-pause-label').textContent = 'Pause';
              floatingPauseBtn.setAttribute('aria-label', 'Pause');
            }
          }
        } else {
          // Pause playback
          isManualPause = true;
          audio.pause();
          pauseBtn.querySelector('.speechify-pause-label').textContent = 'Resume';
          pauseBtn.setAttribute('aria-label', 'Resume');
          
          // Update floating pause button if it exists
          if (floatingPlayer) {
            const floatingPauseBtn = floatingPlayer.querySelector('.speechify-pause-btn');
            if (floatingPauseBtn) {
              floatingPauseBtn.querySelector('.speechify-pause-label').textContent = 'Resume';
              floatingPauseBtn.setAttribute('aria-label', 'Resume');
            }
          }
        }
      });
    }

    audio.addEventListener('play', function(){
      // Reset manual pause flag when audio starts playing
      isManualPause = false;
      playUI();
      // Only start highlighting when audio actually plays and we have a highlighter
      if (highlighter) {
        const currentTime = audio.currentTime || 0;
        if (DEBUG_TIMING) console.log('[ELABS DEBUG] Audio started playing, beginning highlight at time:', currentTime);
        highlighter(currentTime);
      }
    });

    audio.addEventListener('pause', function(){
      if (audio.currentTime < audio.duration) {
        // Only hide controls and reset state if this wasn't a manual pause
        if (!isManualPause) {
          setBtnLabel(btn, 'Listen to Article');
          setBtnPlaying(btn, false);
          btn.dataset.state = 'idle';
          setPlayerActive(false);
        }
        // Always clear highlights when paused
        clearAllHighlights(articleRoots);
      }
    });

    audio.addEventListener('ended', function(){
      resetUI();
      // Clear highlights when audio ends
      clearAllHighlights(articleRoots);
    });

    audio.addEventListener('timeupdate', function(){
      if (highlighter) {
        const currentTime = audio.currentTime || 0;
        if (DEBUG_TIMING && Math.random() < 0.1) { // Log occasionally to avoid spam
          console.log('[ELABS DEBUG] Audio timeupdate:', currentTime.toFixed(3), 'playbackRate:', audio.playbackRate);
        }
        highlighter(currentTime);
      }
    });

    audio.addEventListener('seeked', function(){
      if (highlighter) {
        const currentTime = audio.currentTime || 0;
        if (DEBUG_TIMING) console.log('[ELABS DEBUG] Audio seeked to:', currentTime.toFixed(3));
        highlighter(currentTime);
      }
    });
  }

  function boot(){
    document.querySelectorAll('.elabs-player').forEach(initPlayer);
    createDebugToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
