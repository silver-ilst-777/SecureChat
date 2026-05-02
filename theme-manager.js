(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeManager);
  } else {
    initThemeManager();
  }

  function initThemeManager() {
    // ════════════ Палитры (приятные глазу, контрастный текст) ════════════
    const themes = {
      gold: {
        name: 'Золотая классика',
        vars: {
          '--bg': '#1a1a1a',
          '--sb': 'rgba(30, 30, 30, 0.9)',
          '--surface': 'rgba(40, 40, 40, 0.75)',
          '--surface2': 'rgba(50, 50, 50, 0.85)',
          '--surface-hov': 'rgba(65, 65, 65, 0.9)',
          '--border': 'rgba(200, 160, 50, 0.3)',
          '--accent': '#C8A32D',
          '--accent-hov': '#E6C458',
          '--accent2': '#E5B83C',
          '--danger': '#D64545',
          '--success': '#4CAF50',
          '--text': '#F0F0F0',
          '--text-dim': '#C0C0C0',
          '--text-xs': '#999999',
          '--own': 'linear-gradient(135deg, #A67C00, #C8A32D)',
          '--reaction-bg': 'rgba(200,163,45,0.15)',
          '--reaction-border': 'rgba(200,163,45,0.35)',
          '--voice-wave': 'var(--accent2)'
        }
      },
      ocean: {
        name: 'Тихий океан',
        vars: {
          '--bg': '#101d2c',
          '--sb': 'rgba(16, 29, 44, 0.9)',
          '--surface': 'rgba(20, 36, 52, 0.75)',
          '--surface2': 'rgba(28, 45, 62, 0.85)',
          '--surface-hov': 'rgba(36, 60, 82, 0.9)',
          '--border': 'rgba(70, 190, 200, 0.3)',
          '--accent': '#46BEC8',
          '--accent-hov': '#6DD5DE',
          '--accent2': '#58D0DA',
          '--danger': '#EF6C6C',
          '--success': '#66BB6A',
          '--text': '#E8F4F6',
          '--text-dim': '#B0D4DA',
          '--text-xs': '#7FB6BE',
          '--own': 'linear-gradient(135deg, #1D5B63, #3A9CA6)',
          '--reaction-bg': 'rgba(70,190,200,0.15)',
          '--reaction-border': 'rgba(70,190,200,0.35)',
          '--voice-wave': 'var(--accent2)'
        }
      },
      forest: {
        name: 'Лесная чаща',
        vars: {
          '--bg': '#121a12',
          '--sb': 'rgba(18, 26, 18, 0.9)',
          '--surface': 'rgba(24, 34, 24, 0.75)',
          '--surface2': 'rgba(32, 44, 32, 0.85)',
          '--surface-hov': 'rgba(42, 58, 42, 0.9)',
          '--border': 'rgba(110, 180, 100, 0.3)',
          '--accent': '#6EB464',
          '--accent-hov': '#8CCB84',
          '--accent2': '#7EC073',
          '--danger': '#E57373',
          '--success': '#81C784',
          '--text': '#E6F0E6',
          '--text-dim': '#B8D0B8',
          '--text-xs': '#8AA68A',
          '--own': 'linear-gradient(135deg, #3B5E3B, #568C4B)',
          '--reaction-bg': 'rgba(110,180,100,0.15)',
          '--reaction-border': 'rgba(110,180,100,0.35)',
          '--voice-wave': 'var(--accent2)'
        }
      },
      sunset: {
        name: 'Закатный луч',
        vars: {
          '--bg': '#1E1715',
          '--sb': 'rgba(30, 23, 21, 0.9)',
          '--surface': 'rgba(40, 30, 28, 0.75)',
          '--surface2': 'rgba(50, 38, 36, 0.85)',
          '--surface-hov': 'rgba(65, 48, 44, 0.9)',
          '--border': 'rgba(230, 140, 80, 0.3)',
          '--accent': '#E68C50',
          '--accent-hov': '#F0AE7A',
          '--accent2': '#ED9E64',
          '--danger': '#EF5350',
          '--success': '#FFA726',
          '--text': '#FDF3EE',
          '--text-dim': '#E2C4B0',
          '--text-xs': '#C0957A',
          '--own': 'linear-gradient(135deg, #B85C2C, #D97B45)',
          '--reaction-bg': 'rgba(230,140,80,0.15)',
          '--reaction-border': 'rgba(230,140,80,0.35)',
          '--voice-wave': 'var(--accent2)'
        }
      },
      midnight: {
        name: 'Полуночный сапфир',
        vars: {
          '--bg': '#12161f',
          '--sb': 'rgba(18, 22, 31, 0.9)',
          '--surface': 'rgba(24, 28, 38, 0.75)',
          '--surface2': 'rgba(32, 37, 50, 0.85)',
          '--surface-hov': 'rgba(42, 50, 65, 0.9)',
          '--border': 'rgba(120, 140, 220, 0.3)',
          '--accent': '#788CDC',
          '--accent-hov': '#9AAAE8',
          '--accent2': '#8B9DE0',
          '--danger': '#E57373',
          '--success': '#81C784',
          '--text': '#E3E8F2',
          '--text-dim': '#B0BCD0',
          '--text-xs': '#8290A8',
          '--own': 'linear-gradient(135deg, #3F4A8A, #6270B8)',
          '--reaction-bg': 'rgba(120,140,220,0.15)',
          '--reaction-border': 'rgba(120,140,220,0.35)',
          '--voice-wave': 'var(--accent2)'
        }
      },
      rose: {
        name: 'Чайная роза',
        vars: {
          '--bg': '#1D161A',
          '--sb': 'rgba(29, 22, 26, 0.9)',
          '--surface': 'rgba(38, 28, 34, 0.75)',
          '--surface2': 'rgba(48, 36, 44, 0.85)',
          '--surface-hov': 'rgba(62, 46, 56, 0.9)',
          '--border': 'rgba(210, 120, 140, 0.3)',
          '--accent': '#D2788C',
          '--accent-hov': '#E49FAD',
          '--accent2': '#DB8A9C',
          '--danger': '#E57373',
          '--success': '#81C784',
          '--text': '#F5EBEF',
          '--text-dim': '#D4BCC7',
          '--text-xs': '#B08B9A',
          '--own': 'linear-gradient(135deg, #8E4356, #B35E6E)',
          '--reaction-bg': 'rgba(210,120,140,0.15)',
          '--reaction-border': 'rgba(210,120,140,0.35)',
          '--voice-wave': 'var(--accent2)'
        }
      },
      light: {
        name: 'Утренний свет',
        vars: {
          '--bg': '#FAFAFA',
          '--sb': 'rgba(255, 255, 255, 0.92)',
          '--surface': 'rgba(250, 250, 250, 0.9)',
          '--surface2': 'rgba(245, 245, 245, 0.95)',
          '--surface-hov': 'rgba(235, 235, 235, 0.95)',
          '--border': 'rgba(0,0,0,0.08)',
          '--accent': '#8B7355',
          '--accent-hov': '#A89070',
          '--accent2': '#9E8465',
          '--danger': '#D32F2F',
          '--success': '#388E3C',
          '--text': '#2C2C2C',
          '--text-dim': '#6A6A6A',
          '--text-xs': '#9E9E9E',
          '--own': 'linear-gradient(135deg, #7B6350, #A48E74)',
          '--reaction-bg': 'rgba(139,115,85,0.12)',
          '--reaction-border': 'rgba(139,115,85,0.25)',
          '--voice-wave': 'var(--accent2)'
        }
      }
    };

    const THEME_KEY = 'securechat-theme';

    function applyTheme(themeId) {
      const theme = themes[themeId];
      if (!theme) return;
      const root = document.documentElement;
      Object.entries(theme.vars).forEach(([prop, value]) => {
        root.style.setProperty(prop, value);
      });
      localStorage.setItem(THEME_KEY, themeId);
    }

    function getSavedTheme() {
      return localStorage.getItem(THEME_KEY) || 'gold';
    }

    // ════════ Строим компактную панель тем (адаптивную) ════════
    function buildThemeUI() {
      const modal = document.getElementById('settingsModal');
      if (!modal) return;
      if (document.getElementById('themePickerContainer')) return;

      const container = document.createElement('div');
      container.id = 'themePickerContainer';
      container.className = 'field-group';
      container.innerHTML = '<label>Тема оформления</label>';

      // Горизонтальная прокручиваемая панель
      const themesRow = document.createElement('div');
      themesRow.className = 'theme-palette-row';
      // Стили для строки (можно было бы вынести в CSS, но для независимости зададим здесь)
      themesRow.style.display = 'flex';
      themesRow.style.flexWrap = 'nowrap';
      themesRow.style.gap = '8px';
      themesRow.style.overflowX = 'auto';
      themesRow.style.paddingBottom = '6px';
      themesRow.style.marginTop = '6px';
      themesRow.style.webkitOverflowScrolling = 'touch';
      themesRow.style.scrollbarWidth = 'thin';

      Object.entries(themes).forEach(([id, theme]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.theme = id;
        btn.title = theme.name;

        const accent = theme.vars['--accent'] || '#888';
        btn.style.width = '32px';
        btn.style.height = '32px';
        btn.style.borderRadius = '50%';
        btn.style.background = accent;
        btn.style.border = '2px solid transparent';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.color = '#fff';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '12px';
        btn.style.flexShrink = '0';
        btn.textContent = theme.name.charAt(0);

        btn.addEventListener('click', () => {
          applyTheme(id);
          updateActiveThemeButton(id);
        });

        themesRow.appendChild(btn);
      });

      container.appendChild(themesRow);

      // Вставляем перед кнопками действий (Выйти / Сохранить)
      const buttonsDiv = modal.querySelector('.modal-box > div:last-child');
      if (buttonsDiv) {
        modal.querySelector('.modal-box').insertBefore(container, buttonsDiv);
      } else {
        modal.querySelector('.modal-box').appendChild(container);
      }
    }

    function updateActiveThemeButton(activeId) {
      const buttons = document.querySelectorAll('#themePickerContainer button');
      buttons.forEach(btn => {
        if (btn.dataset.theme === activeId) {
          btn.style.borderColor = 'var(--text)';
          btn.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.3)';
        } else {
          btn.style.borderColor = 'transparent';
          btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        }
      });
    }

    // ─── Дополнительный CSS-фикс для модального окна на мобильных (если оно растягивается) ───
    function injectMobileModalFix() {
      if (document.getElementById('theme-mobile-fix')) return;
      const style = document.createElement('style');
      style.id = 'theme-mobile-fix';
      style.textContent = `
        @media (max-width: 480px) {
          .modal-box {
            max-height: 85vh;
            overflow-y: auto;
            padding: 24px 20px !important;
          }
          .theme-palette-row {
            gap: 6px;
          }
          .theme-palette-row button {
            width: 28px;
            height: 28px;
            font-size: 10px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // ─── Старт ───
    const saved = getSavedTheme();
    applyTheme(saved);
    buildThemeUI();
    updateActiveThemeButton(saved);
    injectMobileModalFix();
  }
})();