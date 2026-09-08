(() => {
  'use strict';

  // ========== PLACEHOLDER CONFIG ==========
  // Replace these with real values from your backend/model
  const MODEL_METRICS = {
    accuracy: '94.2%',
    f1: '0.91',
    precision: '93.5%',
    recall: '92.1%',
    predictions: '1,240+'
  };

  const COUNTER_VALUES = {
    predictions: 1240,
    accuracy: 94.2,
    completion: 87,
  };
  
  const API_URL = 'https://mental-health-score-3-nj16.onrender.com';
  // ========================================

  // ========== 2. DOM REFERENCES ==========
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const els = {
    navbar: $('#navbar'),
    navToggle: $('#nav-toggle'),
    navMenu: $('#nav-menu'),
    particlesCanvas: $('#particles-canvas'),
    secHero: $('#sec-hero'),
    secAssess: $('#sec-assess'),
    secResult: $('#sec-result'),
    secError: $('#sec-error'),
    emptyState: $('#empty-state'),
    wizard: $('#wizard'),
    startAssessBtn: $('#start-assess-btn'),
    heroCta: $('#hero-cta'),
    predictionForm: $('#prediction-form'),
    prevBtn: $('#prev-btn'),
    nextBtn: $('#next-btn'),
    submitBtn: $('#submit-btn'),
    retakeBtn: $('#retake-btn'),
    errorRetryBtn: $('#error-retry-btn'),
    errorMessage: $('#error-message'),
    loadingOverlay: $('#loading-overlay'),
    wizStepText: $('#wiz-step-text'),
    wizPct: $('#wiz-pct'),
    wizFill: $('#wiz-fill'),
    gaugeFill: $('#gauge-fill'),
    gaugeDot: $('#gauge-dot'),
    gaugeScore: $('#gauge-score'),
    scoreBadge: $('#score-badge'),
    scoreInterp: $('#score-interp'),
    insightIndicators: $('#insight-indicators'),
    aiInsightBox: $('#ai-insight-box'),
    aiInsightText: $('#ai-insight-text'),
    factorBars: $('#factor-bars'),
    confettiBox: $('#confetti-box'),
    donutChart: $('#donut-chart'),
    quotesDots: $('#quotes-dots')
  };

  // ========== SHAKE ANIMATION CSS ==========
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .invalid input, .invalid select {
      border-color: #d63031 !important;
      animation: shake 0.4s ease-in-out;
    }
    .invalid .chip-grid, .invalid .purpose-grid, .invalid .stress-grid {
      animation: shake 0.4s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  // ========== 3. PARTICLES ==========
  function initParticles() {
    if (!els.particlesCanvas) return;
    const ctx = els.particlesCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const numParticles = 60;
    const connectionDistance = 150;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      els.particlesCanvas.width = width;
      els.particlesCanvas.height = height;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(108, 92, 231, 0.5)';
        ctx.fill();
      }
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108, 92, 231, ${1 - dist / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    animate();
  }
  initParticles();

  // ========== 4. STICKY NAVBAR & SCROLL ==========
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      els.navbar.classList.add('scrolled');
    } else {
      els.navbar.classList.remove('scrolled');
    }
  });

  els.navToggle.addEventListener('click', () => {
    els.navMenu.classList.toggle('open');
  });

  $$('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      els.navMenu.classList.remove('open');
      if (link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetEl = $(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = $(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  $$('.sec').forEach(sec => sectionObserver.observe(sec));


  // ========== 5. SCROLL ANIMATIONS ==========
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Handle staggered delays for siblings
        const parent = entry.target.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.anim-in'));
        if (siblings.length > 1) {
            siblings.forEach((sib, index) => {
               if (sib === entry.target) {
                   sib.style.transitionDelay = `${index * 0.1}s`;
               }
            });
        }
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  $$('.anim-in').forEach(el => animObserver.observe(el));

  // ========== 6. COUNTER ANIMATION ==========
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimal')) || 0;
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const current = easeOutCubic(progress) * target;
          
          if (decimals > 0) {
              el.textContent = current.toFixed(decimals) + suffix;
          } else {
              el.textContent = Math.floor(current) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
              el.textContent = target.toFixed(decimals) + suffix;
          }
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  $$('.counter').forEach(el => counterObserver.observe(el));

  // ========== 7. ASSESSMENT FLOW ==========
  let currentStep = 1;
  const totalSteps = 3;

  function goToStep(n) {
    $$('.wiz-step').forEach(step => step.classList.remove('active'));
    $(`#step-${n}`).classList.add('active');
    
    const pct = ((n) / totalSteps) * 100;
    els.wizFill.style.width = `${pct}%`;
    els.wizPct.textContent = `${Math.round(pct)}%`;
    
    const stepNames = ["About You", "Digital Life", "Wellness"];
    els.wizStepText.textContent = `Step ${n} of ${totalSteps} — ${stepNames[n-1]}`;

    $$('.wiz-dot').forEach(dot => {
      const dotStep = parseInt(dot.getAttribute('data-step'));
      dot.classList.remove('active', 'completed');
      if (dotStep === n) {
        dot.classList.add('active');
      } else if (dotStep < n) {
        dot.classList.add('completed');
      }
    });

    if (n === 1) {
      els.prevBtn.classList.add('hidden');
      els.nextBtn.classList.remove('hidden');
      els.submitBtn.classList.add('hidden');
    } else if (n === totalSteps) {
      els.prevBtn.classList.remove('hidden');
      els.nextBtn.classList.add('hidden');
      els.submitBtn.classList.remove('hidden');
    } else {
      els.prevBtn.classList.remove('hidden');
      els.nextBtn.classList.remove('hidden');
      els.submitBtn.classList.add('hidden');
    }
    
    currentStep = n;
  }

  const openWizard = () => {
    els.emptyState.classList.add('hidden');
    els.wizard.classList.remove('hidden');
    goToStep(1);
  };

  els.heroCta.addEventListener('click', (e) => {
    e.preventDefault();
    els.secAssess.scrollIntoView({ behavior: 'smooth' });
    openWizard();
  });
  
  els.startAssessBtn.addEventListener('click', () => {
    openWizard();
  });

  $$('.nav-cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      els.secAssess.scrollIntoView({ behavior: 'smooth' });
      openWizard();
    });
  });

  els.prevBtn.addEventListener('click', () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  });

  els.nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      goToStep(currentStep + 1);
    }
  });

  $$('.wiz-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetStep = parseInt(dot.getAttribute('data-step'));
      if (targetStep < currentStep) {
        goToStep(targetStep);
      } else if (targetStep > currentStep) {
        // Must validate intermediate steps
        let valid = true;
        for (let i = currentStep; i < targetStep; i++) {
          if (!validateStep(i)) {
            valid = false;
            goToStep(i);
            break;
          }
        }
        if (valid) goToStep(targetStep);
      }
    });
  });

  // ========== 8. INTERACTIVE CONTROLS ==========
  $$('#platform-grid .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('#platform-grid .chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      $('#most_used_platform').value = chip.getAttribute('data-value');
      clearFieldError('most_used_platform');
    });
  });

  $$('#purpose-grid .purpose-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#purpose-grid .purpose-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      $('#purpose_of_use').value = btn.getAttribute('data-value');
      clearFieldError('purpose_of_use');
    });
  });

  $$('#stress-grid .stress-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#stress-grid .stress-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      $('#stress_level').value = btn.getAttribute('data-value');
      clearFieldError('stress_level');
    });
  });

  const sliders = [
    { slider: 'avg_daily_usage_hours_slider', hidden: 'avg_daily_usage_hours', display: 'usage-display' },
    { slider: 'study_hours_slider', hidden: 'study_hours', display: 'study-display' },
    { slider: 'physical_activity_hours_slider', hidden: 'physical_activity_hours', display: 'activity-display' },
    { slider: 'sleep_hours_per_night_slider', hidden: 'sleep_hours_per_night', display: 'sleep-display' }
  ];

  sliders.forEach(s => {
    const sliderEl = $(`#${s.slider}`);
    const hiddenEl = $(`#${s.hidden}`);
    const displayEl = $(`#${s.display}`);
    if (sliderEl && hiddenEl && displayEl) {
      sliderEl.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(1);
        hiddenEl.value = val;
        displayEl.textContent = val;
      });
    }
  });

  // ========== 9. VALIDATION ==========
  function setFieldError(id, msg) {
    const errorEl = $(`#${id}-error`);
    const fieldEl = $(`#field-${id}`);
    if (errorEl) errorEl.textContent = msg;
    if (fieldEl) {
        fieldEl.classList.add('invalid');
        // trigger reflow for animation restart
        fieldEl.offsetWidth;
    }
  }

  function clearFieldError(id) {
    const errorEl = $(`#${id}-error`);
    const fieldEl = $(`#field-${id}`);
    if (errorEl) errorEl.textContent = '';
    if (fieldEl) fieldEl.classList.remove('invalid');
  }

  function validateSingleField(id) {
    const el = $(`#${id}`);
    let val = el ? el.value.trim() : '';
    if (!val && el.hasAttribute('required')) {
      return "This field is required";
    }
    
    switch(id) {
      case 'age':
        const age = parseInt(val);
        if (isNaN(age) || age < 10 || age > 100) return "Please enter a valid age (10-100)";
        break;
      case 'daily_unlocks':
        const unlocks = parseInt(val);
        if (isNaN(unlocks) || unlocks < 0) return "Please enter a valid positive number";
        break;
    }
    return null;
  }

  function validateStep(step) {
    let fields = [];
    if (step === 1) fields = ['age', 'gender', 'country', 'academic_level'];
    if (step === 2) fields = ['most_used_platform', 'purpose_of_use', 'daily_unlocks'];
    if (step === 3) fields = ['stress_level'];

    let isValid = true;
    fields.forEach(id => {
      const err = validateSingleField(id);
      if (err) {
        setFieldError(id, err);
        isValid = false;
      } else {
        clearFieldError(id);
      }
    });
    return isValid;
  }

  // Live validation
  ['age', 'country', 'daily_unlocks'].forEach(id => {
    const el = $(`#${id}`);
    if(el) {
        el.addEventListener('input', () => clearFieldError(id));
        el.addEventListener('blur', () => {
            const err = validateSingleField(id);
            if (err) setFieldError(id, err);
        });
    }
  });
  ['gender', 'academic_level'].forEach(id => {
    const el = $(`#${id}`);
    if (el) el.addEventListener('change', () => clearFieldError(id));
  });

  // ========== 10. FORM SUBMIT & 11. SHOW RESULT ==========
  function showLoading() {
    els.loadingOverlay.classList.remove('hidden');
    els.submitBtn.disabled = true;
  }
  function hideLoading() {
    els.loadingOverlay.classList.add('hidden');
    els.submitBtn.disabled = false;
  }

  function showError(msg) {
    els.errorMessage.textContent = msg;
    els.secError.classList.remove('hidden');
    els.secError.scrollIntoView({ behavior: 'smooth' });
  }

  els.errorRetryBtn.addEventListener('click', () => {
    els.secError.classList.add('hidden');
    els.wizard.classList.remove('hidden');
    els.secAssess.scrollIntoView({ behavior: 'smooth' });
  });

  els.predictionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    let failingStep = 1;
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        if (valid) failingStep = i; // first failing step
        valid = false;
      }
    }
    if (!valid) {
      goToStep(failingStep);
      return;
    }

    const payload = {
      age: parseInt($('#age').value),
      gender: $('#gender').value,
      country: $('#country').value,
      academic_level: $('#academic_level').value,
      study_hours: parseFloat($('#study_hours').value),
      physical_activity_hours: parseFloat($('#physical_activity_hours').value),
      sleep_hours_per_night: parseFloat($('#sleep_hours_per_night').value),
      most_used_platform: $('#most_used_platform').value,
      avg_daily_usage_hours: parseFloat($('#avg_daily_usage_hours').value),
      purpose_of_use: $('#purpose_of_use').value,
      daily_unlocks: parseInt($('#daily_unlocks').value),
      stress_level: $('#stress_level').value
    };

    showLoading();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 422) {
          throw new Error("Validation Error: Please check your inputs.");
        }
        throw new Error(errorData.detail || "Something went wrong processing your request.");
      }

      const data = await response.json();
      hideLoading();
      const score = data.predicted_mental_health_score !== undefined 
        ? Number(data.predicted_mental_health_score) 
        : (data.wellness_score !== undefined ? Number(data.wellness_score) : 0);
      showResult(score, payload);
    } catch (err) {
      hideLoading();
      if (err.message.includes('Failed to fetch')) {
        showError("Unable to connect to the prediction server. Please ensure the backend is running at http://127.0.0.1:8000.");
      } else {
        showError(err.message);
      }
    }
  });

  function showResult(score, userInputs) {
    els.wizard.classList.add('hidden');
    els.emptyState.classList.add('hidden');
    els.secResult.classList.remove('hidden');
    els.secResult.scrollIntoView({ behavior: 'smooth' });

    // Animate Gauge
    const arcLength = 251.33;
    const ratio = Math.max(0, Math.min(score / 10, 1));
    const offset = arcLength * (1 - ratio);
    
    // reset
    els.gaugeFill.style.transition = 'none';
    els.gaugeFill.style.strokeDashoffset = arcLength;
    els.gaugeDot.style.transition = 'none';
    els.gaugeDot.setAttribute('cx', '20');
    els.gaugeDot.setAttribute('cy', '100');
    
    setTimeout(() => {
      els.gaugeFill.style.transition = 'stroke-dashoffset 2s ease-out';
      els.gaugeFill.style.strokeDashoffset = offset;
      
      const nx = 100 - 80 * Math.cos(ratio * Math.PI);
      const ny = 100 - 80 * Math.sin(ratio * Math.PI);
      els.gaugeDot.style.transition = 'all 2s ease-out';
      els.gaugeDot.setAttribute('cx', nx);
      els.gaugeDot.setAttribute('cy', ny);
    }, 50);

    // Score Number Animation
    let startTimestamp = null;
    const duration = 2000;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = easeOutCubic(progress) * score;
      els.gaugeScore.textContent = current.toFixed(2);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    // Update Score Badge & Interpretation
    let badgeText, badgeBg, badgeColor, interpText;
    if (score >= 8) {
      badgeText = "🌟 Excellent"; badgeBg = "#e8f5e9"; badgeColor = "#2e7d32";
      interpText = "Your habits reflect a very healthy lifestyle. You are managing stress well and maintaining a strong balance.";
    } else if (score >= 6) {
      badgeText = "😊 Good"; badgeBg = "#f3e5f5"; badgeColor = "#6a1b9a";
      interpText = "You have generally healthy habits, though there might be minor areas for optimization in your routine.";
    } else if (score >= 4) {
      badgeText = "😐 Moderate"; badgeBg = "#fff8e1"; badgeColor = "#f57f17";
      interpText = "Your wellness is moderate. Consider reviewing your habits, especially around sleep, digital use, or stress management.";
    } else if (score >= 2) {
      badgeText = "⚠️ Below Average"; badgeBg = "#fff3e0"; badgeColor = "#e65100";
      interpText = "Your inputs suggest significant stress or lifestyle imbalance. It might be helpful to take intentional breaks and prioritize rest.";
    } else {
      badgeText = "🚨 Needs Attention"; badgeBg = "#ffebee"; badgeColor = "#c62828";
      interpText = "Your results indicate high levels of pressure. Please prioritize your wellbeing and consider seeking support from a professional.";
    }
    
    els.scoreBadge.textContent = badgeText;
    els.scoreBadge.style.backgroundColor = badgeBg;
    els.scoreBadge.style.color = badgeColor;
    els.scoreInterp.textContent = interpText;

    // Insight Indicators
    els.insightIndicators.innerHTML = '';
    const indicators = [];
    if (userInputs.sleep_hours_per_night < 6) indicators.push("😴 Poor sleep");
    if (userInputs.avg_daily_usage_hours > 5) indicators.push("📱 High screen time");
    if (userInputs.study_hours > 8) indicators.push("📚 Heavy study load");
    if (userInputs.stress_level === 'High' || userInputs.stress_level === 'Very High') indicators.push("🧠 Elevated stress");
    if (userInputs.physical_activity_hours < 1) indicators.push("💪 Low activity");
    if (userInputs.daily_unlocks > 80) indicators.push("🔓 Frequent phone use");
    
    indicators.forEach(ind => {
      const span = document.createElement('span');
      span.className = 'indicator-tag';
      span.textContent = ind;
      els.insightIndicators.appendChild(span);
    });

    // AI Insight Text
    let insightParts = [];
    if (userInputs.sleep_hours_per_night < 7) insightParts.push("limited sleep");
    if (userInputs.avg_daily_usage_hours > 4) insightParts.push("extended digital engagement");
    if (userInputs.stress_level === 'High' || userInputs.stress_level === 'Very High') insightParts.push("high reported stress");
    if (userInputs.physical_activity_hours < 1.5) insightParts.push("low physical activity");
    
    let insightString = "Your responses suggest your current wellness is stable.";
    let suggestionString = "Keep up your healthy habits.";
    
    if (insightParts.length > 0) {
      insightString = `Your responses suggest your current wellness may be influenced by ${insightParts.join(', ')}.`;
      suggestionString = "Consider evaluating these areas to find a better daily balance.";
    }
    els.aiInsightText.textContent = `${insightString} ${suggestionString}`;

    // Factor Bars
    els.factorBars.innerHTML = '';
    const createBar = (label, userVal, idealVal, isLessIsBetter, unit) => {
      let pct, statusColor;
      if (isLessIsBetter) {
        pct = Math.min((userVal / (idealVal * 2)) * 100, 100);
        statusColor = userVal <= idealVal ? '#00b894' : (userVal <= idealVal * 1.5 ? '#fdcb6e' : '#d63031');
      } else {
        pct = Math.min((userVal / (idealVal * 1.5)) * 100, 100);
        statusColor = userVal >= idealVal ? '#00b894' : (userVal >= idealVal * 0.7 ? '#fdcb6e' : '#d63031');
      }
      return `
        <div class="factor-bar-item">
          <span class="fb-label">${label}</span>
          <div class="fb-track">
            <div class="fb-fill" style="width: ${pct}%; background: ${statusColor}"></div>
          </div>
          <span class="fb-val">${userVal} ${unit}</span>
        </div>
      `;
    };

    els.factorBars.innerHTML += createBar('Sleep', userInputs.sleep_hours_per_night, 8, false, 'hrs');
    els.factorBars.innerHTML += createBar('Screen Time', userInputs.avg_daily_usage_hours, 2, true, 'hrs');
    els.factorBars.innerHTML += createBar('Study Hours', userInputs.study_hours, 5, true, 'hrs');
    els.factorBars.innerHTML += createBar('Physical Activity', userInputs.physical_activity_hours, 1.5, false, 'hrs');
    els.factorBars.innerHTML += createBar('Phone Unlocks', userInputs.daily_unlocks, 50, true, 'times');

    // Confetti
    if (score >= 6) {
      triggerConfetti();
    }
  }

  // ========== 12. CONFETTI ==========
  function triggerConfetti() {
    els.confettiBox.innerHTML = '';
    const colors = ['#6c5ce7', '#00cec9', '#e84393', '#fdcb6e', '#00b894', '#a29bfe'];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = Math.random() * 100 + '%';
      el.style.top = -10 + 'px';
      el.style.width = Math.random() * 10 + 5 + 'px';
      el.style.height = Math.random() * 20 + 10 + 'px';
      
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 0.5;
      
      el.animate([
        { transform: `translate3d(0,0,0) rotate(0deg)`, opacity: 1 },
        { transform: `translate3d(${Math.random()*200 - 100}px, 100vh, 0) rotate(${Math.random()*720}deg)`, opacity: 0 }
      ], {
        duration: duration * 1000,
        delay: delay * 1000,
        easing: 'cubic-bezier(.37,0,.63,1)',
        fill: 'forwards'
      });
      
      els.confettiBox.appendChild(el);
    }
    setTimeout(() => { els.confettiBox.innerHTML = ''; }, 5000);
  }

  // ========== 13. RETAKE ==========
  els.retakeBtn.addEventListener('click', () => {
    els.predictionForm.reset();
    
    $$('.chip').forEach(c => c.classList.remove('selected'));
    $$('.purpose-btn').forEach(b => b.classList.remove('selected'));
    $$('.stress-btn').forEach(b => b.classList.remove('selected'));
    
    $$('#prediction-form input[type="hidden"]').forEach(inp => inp.value = '');
    $$('.fe').forEach(err => err.textContent = '');
    $$('.field').forEach(f => f.classList.remove('invalid'));

    // Reset sliders specifically if needed to default values
    const sliderDefaults = {
      avg_daily_usage_hours: { val: 3, slider: 'avg_daily_usage_hours_slider', display: 'usage-display' },
      study_hours: { val: 4, slider: 'study_hours_slider', display: 'study-display' },
      physical_activity_hours: { val: 1, slider: 'physical_activity_hours_slider', display: 'activity-display' },
      sleep_hours_per_night: { val: 7, slider: 'sleep_hours_per_night_slider', display: 'sleep-display' }
    };
    for(const key in sliderDefaults) {
      const conf = sliderDefaults[key];
      const s = $(`#${conf.slider}`);
      const h = $(`#${key}`);
      const d = $(`#${conf.display}`);
      if(s) s.value = conf.val;
      if(h) h.value = conf.val;
      if(d) d.textContent = conf.val.toFixed(1);
    }

    els.secResult.classList.add('hidden');
    els.emptyState.classList.remove('hidden');
    els.secAssess.scrollIntoView({ behavior: 'smooth' });
    goToStep(1);
  });

  // ========== 15. DONUT CHART ==========
  function drawDonutChart() {
    if (!els.donutChart) return;
    const data = [
      {label:'Academic', pct:32, color:'#6c5ce7'}, 
      {label:'Career', pct:21, color:'#0984e3'}, 
      {label:'Digital', pct:18, color:'#00cec9'}, 
      {label:'Sleep', pct:14, color:'#a29bfe'}, 
      {label:'Social', pct:9, color:'#e84393'}, 
      {label:'Other', pct:6, color:'#636e88'}
    ];
    
    const cx = 100, cy = 100, radius = 80, strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    data.forEach(item => {
      const dash = (item.pct / 100) * circumference;
      const gap = circumference - dash;
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', radius);
      circle.setAttribute('fill', 'transparent');
      circle.setAttribute('stroke', item.color);
      circle.setAttribute('stroke-width', strokeWidth);
      circle.setAttribute('stroke-dasharray', `${dash} ${gap}`);
      circle.setAttribute('stroke-dashoffset', -offset);
      
      els.donutChart.appendChild(circle);
      offset += dash;
    });
  }
  drawDonutChart();

  // ========== 16. QUOTES CAROUSEL ==========
  const quotes = $$('.quote-slide');
  if (quotes.length > 0 && els.quotesDots) {
    let currentQuote = 0;
    
    // Create dots
    quotes.forEach((q, idx) => {
      const dot = document.createElement('button');
      dot.className = `q-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => showQuote(idx));
      els.quotesDots.appendChild(dot);
    });

    function showQuote(idx) {
      quotes[currentQuote].classList.remove('active');
      els.quotesDots.children[currentQuote].classList.remove('active');
      currentQuote = idx;
      quotes[currentQuote].classList.add('active');
      els.quotesDots.children[currentQuote].classList.add('active');
    }

    setInterval(() => {
      let next = (currentQuote + 1) % quotes.length;
      showQuote(next);
    }, 6000);
  }

  // ========== 17. EDUCATIONAL CARDS ==========
  $$('.ec-top').forEach(top => {
    top.addEventListener('click', () => {
      const card = top.closest('.edu-card');
      const isExpanded = card.getAttribute('data-expanded') === 'true';
      card.setAttribute('data-expanded', !isExpanded);
    });
  });

})();
