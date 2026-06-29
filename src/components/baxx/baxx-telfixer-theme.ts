/**
 * TelFixer design tokens en shadow-DOM overrides voor de Baxx Buyback widget.
 * Spiegelt het luxury designsysteem uit globals.css en de Repender-theming.
 */

export const BAXX_WIDGET_OVERRIDES = {
  primaryColor: "#094543",
  secondaryColor: "#F5EDE2",
} as const;

export const TELFIXER_BAXX_THEME_CSS = `
  :host {
    display: block;
    width: 100%;
    font-family: var(--font-sans, Manrope, ui-sans-serif, system-ui, -apple-system, sans-serif);
    font-size: 16px;
    line-height: 1.7;
    letter-spacing: -0.01em;
    color: #1A1A1A;
    -webkit-font-smoothing: antialiased;

    --tf-primary: #094543;
    --tf-primary-light: #0d6965;
    --tf-primary-muted: rgba(9, 69, 67, 0.1);
    --tf-cream: #FAF8F5;
    --tf-champagne: #F5EDE2;
    --tf-sand: #E8DFD4;
    --tf-soft-black: #1A1A1A;
    --tf-slate: #4A4A4A;
    --tf-muted: #6B6B6B;
    --tf-copper: #B87333;
    --tf-gold: #C9A96E;
    --tf-success: #0D9488;
    --tf-error: #DC2626;
    --tf-radius-md: 12px;
    --tf-radius-lg: 16px;
    --tf-radius-xl: 24px;
    --tf-shadow-sm: 0 2px 4px rgba(26, 26, 26, 0.04), 0 1px 2px rgba(26, 26, 26, 0.02);
    --tf-shadow-md: 0 4px 12px rgba(26, 26, 26, 0.06), 0 2px 4px rgba(26, 26, 26, 0.04);
    --tf-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --tf-transition: 200ms cubic-bezier(0.4, 0, 0.2, 1);

    --bbw-primary: var(--tf-primary);
    --bbw-primary-light: var(--tf-primary-muted);
    --bbw-secondary: var(--tf-champagne);
  }

  /* Geen dubbele kaart: de site-wrapper levert al border, shadow en padding */
  .bbw-container {
    max-width: none;
    margin: 0;
    padding: 0;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    overflow: visible;
  }

  /* Stappen: fade-in-up conform site-animaties */
  .bbw-step.active {
    animation: tf-bbw-fade-in-up 600ms var(--tf-ease) forwards;
  }

  @keyframes tf-bbw-fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Voortgangsbalk: teal met koper accent */
  .bbw-progress {
    gap: 6px;
    margin-bottom: 28px;
  }

  .bbw-progress-segment {
    height: 3px;
    border-radius: 999px;
    background: var(--tf-sand);
    transition: background var(--tf-transition), opacity var(--tf-transition), transform var(--tf-transition);
  }

  .bbw-progress-segment.done {
    background: linear-gradient(90deg, var(--tf-primary) 0%, var(--tf-copper) 100%);
  }

  .bbw-progress-segment.current {
    background: var(--tf-primary);
    opacity: 0.45;
    transform: scaleY(1.25);
  }

  /* Typografie */
  .bbw-title {
    font-family: var(--font-display, "Playfair Display", Georgia, "Times New Roman", serif);
    font-size: clamp(1.375rem, 3vw, 1.625rem);
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: var(--tf-soft-black);
    margin-bottom: 6px;
  }

  .bbw-subtitle {
    font-size: 0.9375rem;
    color: var(--tf-slate);
    margin-bottom: 22px;
    line-height: 1.6;
  }

  .bbw-subtitle a {
    color: var(--tf-primary);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color var(--tf-transition);
  }

  .bbw-subtitle a:hover {
    color: var(--tf-primary-light);
  }

  .bbw-back {
    font-size: 0.8125rem;
    color: var(--tf-muted);
    margin-bottom: 14px;
    transition: color var(--tf-transition), transform var(--tf-transition);
  }

  .bbw-back:hover {
    color: var(--tf-primary);
    transform: translateX(-2px);
  }

  /* Zoekveld */
  .bbw-search-input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-md);
    font-size: 1rem;
    background: #fff;
    color: var(--tf-soft-black);
    outline: none;
    transition: border-color var(--tf-transition), box-shadow var(--tf-transition);
  }

  .bbw-search-input::placeholder {
    color: var(--tf-muted);
  }

  .bbw-search-input:focus {
    border-color: var(--tf-primary);
    box-shadow: 0 0 0 3px rgba(9, 69, 67, 0.12);
  }

  .bbw-search-results {
    margin-top: 8px;
    max-height: 320px;
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-md);
    background: #fff;
    box-shadow: var(--tf-shadow-md);
  }

  .bbw-search-results::-webkit-scrollbar {
    width: 8px;
  }

  .bbw-search-results::-webkit-scrollbar-thumb {
    background: var(--tf-sand);
    border-radius: 999px;
  }

  .bbw-result-item {
    padding: 12px 14px;
    border-radius: 10px;
    transition: background var(--tf-transition), transform var(--tf-transition);
  }

  .bbw-result-item:hover {
    background: var(--tf-cream);
    transform: translateX(2px);
  }

  .bbw-result-item img {
    border-radius: 10px;
    background: var(--tf-cream);
  }

  .bbw-result-item .bbw-model-name {
    color: var(--tf-soft-black);
    font-weight: 600;
  }

  .bbw-result-item .bbw-model-sub {
    color: var(--tf-muted);
  }

  /* Categorieen */
  .bbw-category-section {
    margin: 24px 0;
  }

  .bbw-category-grid {
    gap: 12px;
  }

  .bbw-category-card {
    min-height: 112px;
    padding: 14px;
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-lg);
    background: var(--tf-cream);
    transition: border-color var(--tf-transition), background var(--tf-transition), box-shadow var(--tf-transition), transform var(--tf-transition);
  }

  .bbw-category-card:hover {
    border-color: var(--tf-primary);
    background: #fff;
    box-shadow: var(--tf-shadow-sm);
    transform: translateY(-2px);
  }

  .bbw-category-card.selected {
    border-color: var(--tf-primary);
    background: var(--tf-primary-muted);
    box-shadow: var(--tf-shadow-sm);
  }

  .bbw-category-name {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--tf-soft-black);
  }

  .bbw-category-models .bbw-result-item {
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-md);
    background: #fff;
    margin: 6px;
    transition: border-color var(--tf-transition), box-shadow var(--tf-transition), transform var(--tf-transition);
  }

  .bbw-category-models .bbw-result-item:hover {
    border-color: var(--tf-primary);
    box-shadow: var(--tf-shadow-sm);
    transform: translateY(-2px);
  }

  .bbw-load-more .bbw-btn-secondary {
    width: auto;
  }

  /* Productopties */
  .bbw-product-header img {
    border-radius: var(--tf-radius-md);
    background: var(--tf-cream);
  }

  .bbw-option-label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--tf-soft-black);
    margin-bottom: 10px;
  }

  .bbw-pill {
    padding: 0.5rem 1rem;
    border: 1px solid var(--tf-sand);
    border-radius: 999px;
    font-size: 0.875rem;
    background: var(--tf-cream);
    color: var(--tf-soft-black);
    transition: border-color var(--tf-transition), background var(--tf-transition), color var(--tf-transition), transform var(--tf-transition);
  }

  .bbw-pill:hover:not(.disabled) {
    border-color: var(--tf-primary);
    background: #fff;
    transform: translateY(-1px);
  }

  .bbw-pill.selected {
    border-color: var(--tf-primary);
    background: var(--tf-primary-muted);
    color: var(--tf-primary);
    font-weight: 600;
  }

  /* Vragen */
  .bbw-q-dot {
    width: 30px;
    height: 30px;
    background: var(--tf-sand);
    color: var(--tf-muted);
    transition: background var(--tf-transition), color var(--tf-transition), transform var(--tf-transition);
  }

  .bbw-q-dot.current {
    background: var(--tf-primary);
    color: #fff;
    transform: scale(1.08);
  }

  .bbw-q-dot.answered {
    background: var(--tf-champagne);
    color: var(--tf-primary);
  }

  .bbw-question-text {
    font-family: var(--font-display, "Playfair Display", Georgia, serif);
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--tf-soft-black);
    letter-spacing: -0.01em;
  }

  .bbw-answer-item {
    padding: 14px 16px;
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-md);
    background: #fff;
    transition: border-color var(--tf-transition), background var(--tf-transition), box-shadow var(--tf-transition), transform var(--tf-transition);
  }

  .bbw-answer-item:hover {
    border-color: var(--tf-primary);
    background: var(--tf-cream);
    transform: translateX(2px);
  }

  .bbw-answer-item.selected {
    border-color: var(--tf-primary);
    background: var(--tf-primary-muted);
    box-shadow: var(--tf-shadow-sm);
  }

  .bbw-answer-item .bbw-answer-info {
    color: var(--tf-muted);
  }

  .bbw-container[data-step=questions] .bbw-subtitle:last-child {
    padding: 24px;
    border-radius: var(--tf-radius-lg);
    background: var(--tf-cream);
    border: 1px solid var(--tf-sand);
  }

  /* Prijs */
  .bbw-price-box {
    padding: 28px 16px;
  }

  .bbw-price-label {
    color: var(--tf-muted);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
  }

  .bbw-price-value {
    font-family: var(--font-display, "Playfair Display", Georgia, serif);
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 700;
    color: var(--tf-primary);
    letter-spacing: -0.02em;
  }

  /* Winkelmand */
  .bbw-cart-item {
    padding: 14px;
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-md);
    background: var(--tf-cream);
    transition: box-shadow var(--tf-transition);
  }

  .bbw-cart-item:hover {
    box-shadow: var(--tf-shadow-sm);
  }

  .bbw-cart-item img {
    border-radius: 10px;
    background: #fff;
  }

  .bbw-cart-item-price {
    color: var(--tf-primary);
  }

  /* Formulieren */
  .bbw-form-label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--tf-soft-black);
    margin-bottom: 6px;
  }

  .bbw-form-input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-md);
    font-size: 0.9375rem;
    background: #fff;
    color: var(--tf-soft-black);
    transition: border-color var(--tf-transition), box-shadow var(--tf-transition);
  }

  .bbw-form-input:focus {
    border-color: var(--tf-primary);
    box-shadow: 0 0 0 3px rgba(9, 69, 67, 0.12);
  }

  .bbw-form-input.invalid,
  .bbw-user-agree.invalid,
  .bbw-shipping-mode.invalid {
    border-color: var(--tf-error);
  }

  .bbw-error-text {
    color: var(--tf-error);
  }

  .bbw-section-title {
    font-family: var(--font-display, "Playfair Display", Georgia, serif);
    font-size: 1rem;
    font-weight: 600;
    color: var(--tf-soft-black);
    border-top-color: var(--tf-sand);
    letter-spacing: -0.01em;
  }

  /* Verzending */
  .bbw-shipping-mode {
    padding: 18px 14px;
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-lg);
    background: var(--tf-cream);
    color: var(--tf-soft-black);
    transition: border-color var(--tf-transition), background var(--tf-transition), box-shadow var(--tf-transition), transform var(--tf-transition);
  }

  .bbw-shipping-mode:hover {
    border-color: var(--tf-primary);
    background: #fff;
    transform: translateY(-2px);
  }

  .bbw-shipping-mode.selected {
    border-color: var(--tf-primary);
    background: var(--tf-primary-muted);
    color: var(--tf-primary);
    box-shadow: var(--tf-shadow-sm);
  }

  .bbw-shipping-option {
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-md);
    background: #fff;
    transition: border-color var(--tf-transition), background var(--tf-transition), box-shadow var(--tf-transition);
  }

  .bbw-shipping-option:hover {
    border-color: var(--tf-primary);
    background: var(--tf-cream);
  }

  .bbw-shipping-option.selected {
    border-color: var(--tf-primary);
    background: var(--tf-primary-muted);
    box-shadow: var(--tf-shadow-sm);
  }

  .bbw-shipping-detail {
    color: var(--tf-muted);
  }

  .bbw-sub-options.visible {
    animation: tf-bbw-slide-down 250ms var(--tf-ease);
  }

  @keyframes tf-bbw-slide-down {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Algemene voorwaarden */
  .bbw-user-agree {
    padding: 12px 14px;
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-md);
    background: var(--tf-cream);
    color: var(--tf-slate);
    line-height: 1.5;
  }

  .bbw-user-agree a {
    color: var(--tf-primary);
  }

  /* Knoppen */
  .bbw-btn {
    border-radius: var(--tf-radius-md);
    font-weight: 600;
    letter-spacing: -0.01em;
    transition: background var(--tf-transition), color var(--tf-transition), box-shadow var(--tf-transition), transform var(--tf-transition), opacity var(--tf-transition);
  }

  .bbw-btn-primary {
    background: var(--tf-primary);
    color: #fff;
  }

  .bbw-btn-primary:hover:not(:disabled) {
    background: var(--tf-primary-light);
    box-shadow: var(--tf-shadow-md);
    transform: translateY(-2px);
  }

  .bbw-btn-primary:active:not(:disabled) {
    transform: scale(0.98);
  }

  .bbw-btn-secondary {
    background: var(--tf-champagne);
    color: var(--tf-soft-black);
    border: 1px solid var(--tf-sand);
  }

  .bbw-btn-secondary:hover {
    background: var(--tf-sand);
  }

  /* Afronding */
  .bbw-complete {
    animation: tf-bbw-fade-in-up 600ms var(--tf-ease) forwards;
  }

  .bbw-check-icon {
    background: rgba(13, 148, 136, 0.12);
    color: var(--tf-success);
  }

  .bbw-order-nr {
    background: var(--tf-cream);
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-md);
    color: var(--tf-soft-black);
  }

  .bbw-next-steps {
    background: var(--tf-cream);
    border: 1px solid var(--tf-sand);
    border-radius: var(--tf-radius-lg);
  }

  .bbw-next-steps h4 {
    font-family: var(--font-display, "Playfair Display", Georgia, serif);
    color: var(--tf-soft-black);
  }

  .bbw-next-steps p {
    color: var(--tf-slate);
  }

  .bbw-powered-by {
    opacity: 0.55;
    margin-top: 28px;
  }

  /* Shake bij validatie: iets subtieler */
  @keyframes bbw-shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-3px); }
    40%, 80% { transform: translateX(3px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .bbw-step.active,
    .bbw-complete,
    .bbw-sub-options.visible {
      animation: none;
    }

    .bbw-result-item:hover,
    .bbw-category-card:hover,
    .bbw-pill:hover:not(.disabled),
    .bbw-answer-item:hover,
    .bbw-shipping-mode:hover,
    .bbw-btn-primary:hover:not(:disabled) {
      transform: none;
    }
  }

  @media (max-width: 480px) {
    .bbw-container {
      padding: 0;
    }

    .bbw-progress {
      margin-bottom: 20px;
    }

    .bbw-title {
      font-size: 1.2rem;
    }
  }
`;
