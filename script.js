// =========================================================================================
// محرك الكشف الكمي والتقديري المالي بالدينار الجزائري (Algerian Market Devis Engine)
// =========================================================================================

function calculateProjectDevis() {
    // 1. جلب الكميات الفيزيائية المحسوبة في الجزء العلوي للمواد
    // نقرأ حجم الخرسانة الكلي المدخل في حاسبة المواد
    const volume = parseFloat(document.getElementById('mat_volume').value) || 0;
    const dosage = parseFloat(document.getElementById('mat_dosage').value) || 350;

    if (volume <= 0) {
        resetDevisOutputs();
        return;
    }

    // حساب كمية المواد هندسياً أولاً
    const totalCementKg = volume * dosage;
    const totalCementBags = Math.ceil(totalCementKg / 50); // عدد الأكياس
    const totalSandM3 = volume * 0.4;
    const totalGravelM3 = volume * 0.8;
    
    // تقدير كمية الحديد الإجمالية بشكل تقريبي للمنشأ (حوالي 90 كجم لكل 1م³ خرسانة كمتوسط إنشائي)
    const totalSteelQuintals = (volume * 90) / 100;

    // 2. جلب أسعار الوحدة بالدينار الجزائري من مدخلات المستخدم
    const priceCementBag = parseFloat(document.getElementById('pr_cement').value) || 0;
    const priceSteelQuintal = parseFloat(document.getElementById('pr_steel').value) || 0;
    const priceGravelM3 = parseFloat(document.getElementById('pr_gravel').value) || 0;
    const priceSandM3 = parseFloat(document.getElementById('pr_sand').value) || 0;
    const priceLaborM3 = parseFloat(document.getElementById('pr_labor').value) || 0;

    // 3. العمليات الحسابية المالية (الضرب في أسعار السوق المحلية)
    const costCement = totalCementBags * priceCementBag;
    const costSteel = totalSteelQuintals * priceSteelQuintal;
    const costAggregates = (totalSandM3 * priceSandM3) + (totalGravelM3 * priceGravelM3);
    const costLabor = volume * priceLaborM3;
    
    const totalCost = costCement + costSteel + costAggregates + costLabor;

    // 4. طباعة الفواتير على الشاشة للمقاول بالدينار الجزائري DA
    document.getElementById('out_cost_cement').textContent = costCement.toLocaleString() + " DA";
    document.getElementById('out_cost_steel').textContent = costSteel.toLocaleString() + " DA";
    document.getElementById('out_cost_aggregates').textContent = costAggregates.toLocaleString() + " DA";
    document.getElementById('out_cost_labor').textContent = costLabor.toLocaleString() + " DA";
    document.getElementById('out_total_cost').textContent = totalCost.toLocaleString() + " DA";
}

function resetDevisOutputs() {
    document.getElementById('out_cost_cement').textContent = "0.00 DA";
    document.getElementById('out_cost_steel').textContent = "0.00 DA";
    document.getElementById('out_cost_aggregates').textContent = "0.00 DA";
    document.getElementById('out_cost_labor').textContent = "0.00 DA";
    document.getElementById('out_total_cost').textContent = "0.00 DA";
}

// ربط حاسبة التكلفة لتعمل تلقائياً بمجرد تغيير حجم الخرسانة في الأعلى
if (document.getElementById('mat_volume')) {
    document.getElementById('mat_volume').addEventListener('input', calculateProjectDevis);
    document.getElementById('mat_dosage').addEventListener('change', calculateProjectDevis);
}



// التبديل الحركي بين الحقول الخمسة بناء على الشكل المختار
function toggleSectionFields() {
    const shape = document.getElementById('sec_shape').value;
    document.getElementById('fields_rect').style.display = (shape === 'rect') ? 'block' : 'none';
    document.getElementById('fields_circle').style.display = (shape === 'circle') ? 'block' : 'none';
    document.getElementById('fields_box').style.display = (shape === 'box') ? 'block' : 'none';
    document.getElementById('fields_pipe').style.display = (shape === 'pipe') ? 'block' : 'none';
    document.getElementById('fields_triangle').style.display = (shape === 'triangle') ? 'block' : 'none';
}

// محرك الحسابات الرياضية والهندسية المتكامل للأشكال الخمسة
function calculateSectionProperties() {
    const shape = document.getElementById('sec_shape').value;
    
    let area = 0, Ix = 0, Iy = 0, ix = 0, iy = 0;

    if (shape === 'rect') {
        const b = parseFloat(document.getElementById('sec_b').value) || 0;
        const h = parseFloat(document.getElementById('sec_h').value) || 0;
        if (b > 0 && h > 0) {
            area = b * h;
            Ix = (b * Math.pow(h, 3)) / 12;
            Iy = (h * Math.pow(b, 3)) / 12;
        }
    } 
    else if (shape === 'circle') {
        const d = parseFloat(document.getElementById('sec_d').value) || 0;
        if (d > 0) {
            area = (Math.PI * Math.pow(d, 2)) / 4;
            Ix = (Math.PI * Math.pow(d, 4)) / 64;
            Iy = Ix;
        }
    } 
    else if (shape === 'box') {
        const B = parseFloat(document.getElementById('box_B').value) || 0;
        const H = parseFloat(document.getElementById('box_H').value) || 0;
        const b = parseFloat(document.getElementById('box_b_in').value) || 0;
        const h = parseFloat(document.getElementById('box_h_in').value) || 0;
        // صمام أمان: الأبعاد الخارجية يجب أن تكون أكبر من الداخلية
        if (B > b && H > h && b > 0 && h > 0) {
            area = (B * H) - (b * h);
            Ix = ((B * Math.pow(H, 3)) - (b * Math.pow(h, 3))) / 12;
            Iy = ((H * Math.pow(B, 3)) - (h * Math.pow(b, 3))) / 12;
        }
    } 
    else if (shape === 'pipe') {
        const D = parseFloat(document.getElementById('pipe_D').value) || 0;
        const d = parseFloat(document.getElementById('pipe_d_in').value) || 0;
        // صمام أمان: القطر الخارجي أكبر من الداخلي
        if (D > d && d > 0) {
            area = (Math.PI * (Math.pow(D, 2) - Math.pow(d, 2))) / 4;
            Ix = (Math.PI * (Math.pow(D, 4) - Math.pow(d, 4))) / 64;
            Iy = Ix;
        }
    } 
    else if (shape === 'triangle') {
        const b = parseFloat(document.getElementById('tri_b').value) || 0;
        const h = parseFloat(document.getElementById('tri_h').value) || 0;
        if (b > 0 && h > 0) {
            area = (b * h) / 2;
            Ix = (b * Math.pow(h, 3)) / 36; // العطالة حول مركز الثقل للمثلث X
            Iy = (h * Math.pow(b, 3)) / 48; // العطالة التقريبية حول المحور المار بمركز الثقل Y لشكل متماثل
        }
    }

    // حساب نصف قطر العطالة تلقائياً بناءً على النتائج السابقة: i = sqrt(I / A)
    if (area > 0 && Ix > 0 && Iy > 0) {
        ix = Math.sqrt(Ix / area);
        iy = Math.sqrt(Iy / area);
    }

    // جلب الوحدات حسب لغة النظام الحالية
    const m  = currentLang === 'ar' ? ' م' : ' m';
    const m2 = currentLang === 'ar' ? ' ²م' : ' m²';
    const m4 = currentLang === 'ar' ? ' ⁴م' : ' m⁴';

    // طباعة النتائج حية
    document.getElementById('out_sec_area').textContent = area.toFixed(4) + m2;
    document.getElementById('out_sec_ix').textContent = Ix.toFixed(5) + m4;
    document.getElementById('out_sec_iy').textContent = Iy.toFixed(5) + m4;
    document.getElementById('out_sec_ix_rad').textContent = ix.toFixed(3) + m;
    document.getElementById('out_sec_iy_rad').textContent = iy.toFixed(3) + m;
}
// استدعاء أولي لضمان جاهزية البيانات عند تحميل الصفحة لأول مرة
setTimeout(() => {
    if(document.getElementById('sec_shape')) {
        calculateSectionProperties();
    }
}, 500);
// =========================================================================================
// جناح الماستر الأكاديمي الشامل: محرك حسابات RPA99 و CBA93
// =========================================================================================

// 1. التبديل المرن بين التبويبين
function switchAcademicTab(tabType) {
    const tabRpa = document.getElementById('tab_rpa');
    const tabCba = document.getElementById('tab_cba');
    const panelRpa = document.getElementById('panel_rpa');
    const panelCba = document.getElementById('panel_cba');

    if (tabType === 'rpa') {
        tabRpa.style.background = '#3b82f6'; tabRpa.style.color = 'white';
        tabCba.style.background = '#1e293b'; tabCba.style.color = '#64748b';
        panelRpa.style.display = 'block'; panelCba.style.display = 'none';
        setTimeout(calculateRPASpectrum, 50);
    } else {
        tabCba.style.background = '#10b981'; tabCba.style.color = 'white';
        tabRpa.style.background = '#1e293b'; tabRpa.style.color = '#64748b';
        panelCba.style.display = 'block'; panelRpa.style.display = 'none';
        calculateFlambement();
    }
}

// 2. حساب ورسم طيف الاستجابة الزلزالي الجزائري RPA99/V2003 على الـ Canvas
function calculateRPASpectrum() {
    const rCanvas = document.getElementById('rpaCanvas');
    if (!rCanvas) return;
    const rCtx = rCanvas.getContext('2d');

    const A = parseFloat(document.getElementById('academic_zone').value);
    const T2 = parseFloat(document.getElementById('academic_soil').value);
    const R = parseFloat(document.getElementById('academic_R').value) || 5;
    const Q = parseFloat(document.getElementById('academic_Q').value) || 1.2;
    const T1 = 0.15; // معايير ثابتة للكود الجزائري للمنحنى الشائع
    const eta = 0.88; // معامل التصحيح الديناميكي الافتراضي لخرسانة الـ RPA

    rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
    
    // رسم المحاور الأساسية البيانية
    rCtx.strokeStyle = '#334155'; rCtx.lineWidth = 2;
    rCtx.beginPath(); rCtx.moveTo(60, 20); rCtx.lineTo(60, 310); rCtx.lineTo(760, 310); rCtx.stroke();

    // حساب نقاط المنحنى الرياضي لطيف الـ RPA99 بدقة هندسية مطلقة
    function getSaOverG(T) {
        if (T >= 0 && T <= T1) {
            // صعود منساب ومباشر من نقطة الصفر الزمني إلى الهضبة
            return A * (1 + (T / T1) * (2.5 * eta * (Q / R) - 1));
        } else if (T > T1 && T <= T2) {
            // منطقة الهضبة المستقرة (Plateau)
            return 2.5 * A * eta * (Q / R);
        } else if (T > T2 && T <= 3.0) {
            // الهبوط الأسي الأول
            return 2.5 * A * eta * (Q / R) * Math.pow(T2 / T, 2.0 / 3.0);
        } else {
            // الهبوط الأسي المخمد للمنشآت ذات الزمن العالي جداً
            return 2.5 * A * eta * (Q / R) * Math.pow(T2 / 3.0, 2.0 / 3.0) * Math.pow(3.0 / T, 2.0);
        }
    }

    // رسم دالة المنحنى الترددي الزلزالي حركياً بالألوان
    rCtx.strokeStyle = '#3b82f6'; 
    rCtx.lineWidth = 3;
    rCtx.beginPath();
    
    let isFirst = true;
    // قمنا بضبط الدقة (700 نقطة حسابية) ليكون المنحنى ناعماً وبدون تكسر
    for (let i = 0; i <= 700; i++) {
        let T = (i / 700) * 4.0; // دراسة الزمن من 0 إلى 4 ثوانٍ
        let saG = getSaOverG(T);
        
        // تحويل الإحداثيات الرياضية إلى إحداثيات بكسل الكانفاس بدقة
        let cx = 60 + i;
        let cy = 310 - (saG * 350); // تعديل معامل الارتفاع (350) ليناسب أبعاد الكانفاس الجديدة تماماً دون خروج عن الحواف
        
        if (isFirst) { 
            rCtx.moveTo(cx, cy); 
            isFirst = false; 
        } else { 
            rCtx.lineTo(cx, cy); 
        }
    }
    rCtx.stroke();

    // رسم كتابات ومؤشرات المحاور والترجمة
    rCtx.fillStyle = '#ffffff';
    rCtx.font = '11px sans-serif';
    rCtx.fillText("T (s) الزمن بالثواني", 700, 325);
    rCtx.fillText("Sa / g (تسارع المنشأ)", 10, 15);

    rCtx.fillStyle = '#f59e0b';
    rCtx.font = 'bold 12px Cairo, Tajawal, sans-serif';
    let maxVal = getSaOverG(T2).toFixed(3);
    rCtx.fillText(currentLang === 'ar' ? `أقصى تسارع طيفي للمنشأ الذروة: ${maxVal} g` : `Accélération spectrale max: ${maxVal} g`, 80, 50);
}

// 3. معادلات التحقق من انبعاج الأعمدة الطويلة وفق كود CBA93 الجزائري
function calculateFlambement() {
    const b = parseFloat(document.getElementById('cba_b').value) || 0.3;
    const h = parseFloat(document.getElementById('cba_h').value) || 0.3;
    const L0 = parseFloat(document.getElementById('cba_lo').value) || 3.2;
    const k = parseFloat(document.getElementById('cba_fix').value) || 1.0;

    // حساب الطول الفعال للانبعاج Lf
    const lf = k * L0;
    document.getElementById('out_lf').textContent = lf.toFixed(2) + " m";

    // حساب نصف قطر العطالة الأصغر للعمود المستطيل i_min = b / sqrt(12)
    const iMin = Math.min(b, h) / Math.sqrt(12);

    // حساب معامل النحافة الرياضي لامدا λ = Lf / i_min
    const lambda = lf / iMin;
    document.getElementById('out_lambda').textContent = lambda.toFixed(2);

    // حساب معامل خفض متانة الخرسانة خضوعاً للانبعاج ألفا α
    let alpha = 0;
    if (lambda <= 50) {
        alpha = 0.85 / (1 + 0.2 * Math.pow(lambda / 35, 2));
    } else if (lambda > 50 && lambda <= 70) {
        alpha = 0.6 * Math.pow(50 / lambda, 2);
    }

    document.getElementById('out_alpha').textContent = alpha.toFixed(3);

    // التحقق من صلاحية شروط الكود RPA / CBA وإخراج رسالة الأمان
    const outStatus = document.getElementById('out_status');
    if (lambda > 70) {
        outStatus.textContent = currentLang === 'ar' ? "❌ خطر انبعاج شديد! المقطع مرفوض وفق CBA93 (λ > 70)" : "❌ Flambement critique! Section rejetée (λ > 70)";
        outStatus.style.color = '#ef4444';
    } else if (lambda > 50) {
        outStatus.textContent = currentLang === 'ar' ? "⚠️ نحافة متوسطة، يجب تكثيف الحديد الطولي لحساب الضغط لـ (λ > 50)" : "⚠️ Élancement moyen, ferraillage lourd requis (λ > 50)";
        outStatus.style.color = '#f59e0b';
    } else {
        outStatus.textContent = currentLang === 'ar' ? "✅ العمود آمن تماماً ضد الانبعاج المباشر (λ ≤ 50)" : "✅ Section stable et sécurisée contre le flambement (λ ≤ 50)";
        outStatus.style.color = '#10b981';
    }
}

// تشغيل تلقائي للحسابات الفورية بمجرد الضغط على زر الصفحة في الـ Sidebar
document.getElementById('nav_wonders').addEventListener('click', function() {
    setTimeout(() => { switchAcademicTab('rpa'); }, 50);
});



// =========================================================================================
// محرك التصميم المطور الشامل لـ CivixHub + نظام التبديل والمحولات والمراجع الكاملة
// =========================================================================================

// 1. حساب التشوه طويل الأمد وفق ACI 318 و Eurocode 2 و CBA 93
function calculateLongTermDeflection(deltaInstant, rhoPrime, timeMonths, code) {
    let multiplier = 0;
    if (code === 'aci') {
        let xi = 2.0; 
        if (timeMonths <= 3) xi = 1.0;
        else if (timeMonths <= 6) xi = 1.2;
        else if (timeMonths <= 12) xi = 1.4;
        multiplier = xi / (1 + 50 * rhoPrime);
    } else {
        let phi = 2.5; 
        multiplier = phi * (1 / (1 + 15 * rhoPrime)); 
    }
    return deltaInstant * (1 + multiplier);
}

// تبديل الأقسام والصفحات
function switchPage(pageId) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');
    
    const clickedBtn = Array.from(document.querySelectorAll('.menu-btn')).find(btn => btn.getAttribute('onclick').includes(pageId));
    if (clickedBtn) clickedBtn.classList.add('active');
}

document.getElementById('beamType').addEventListener('change', function() {
    const type = this.value;
    const distanceGroup = document.getElementById('distance_a').closest('.input-group') || document.getElementById('distance_a').parentElement;
    if (distanceGroup) {
        distanceGroup.style.display = type === 'cantilever' ? 'none' : 'block';
    }
    if (type === 'cantilever') document.getElementById('distance_a').value = '0';
});

document.getElementById('designCode').addEventListener('change', function() {
    const code = this.value;
    const rpaGroup = document.getElementById('rpaZone').closest('.input-group') || document.getElementById('rpaZone').parentElement;
    if (rpaGroup) {
        rpaGroup.style.display = code === 'cba93' ? 'block' : 'none';
    }
});

// معالج الحساب للروافد
document.getElementById('calcBtn').addEventListener('click', function() {
    const type = document.getElementById('beamType').value;
    const code = document.getElementById('designCode').value;
    const rpaZone = document.getElementById('rpaZone').value;
    const L = parseFloat(document.getElementById('length').value);
    const w = parseFloat(document.getElementById('load_w').value) || 0;
    const P = parseFloat(document.getElementById('load_p').value) || 0;
    const a = parseFloat(document.getElementById('distance_a').value) || 0;
    const h = parseFloat(document.getElementById('height').value);
    const b = parseFloat(document.getElementById('width').value);
    const E = parseFloat(document.getElementById('elasticity').value) || 30; 
    const fc = parseFloat(document.getElementById('fc').value) || 25;
    const barDia = parseFloat(document.getElementById('barDiameter').value) || 12;

    if (!validateInputs(L, w, P, a, h, b, type)) return;

    let params = getCodeParams(code, fc);
    
    if (code === 'cba93') {
        let rpaConstraints = getRP99Constraints(rpaZone, b, h, L);
        if(!rpaConstraints.valid) {
            alert(currentLang === 'ar' ? `⚠️ تنبيه من نظام RPA 99 الجزائري: ${rpaConstraints.msg}` : `⚠️ Alerte RPA 99: ${rpaConstraints.msgFr}`);
        }
    }

    const results = calculateBeam(type, L, w, P, a, h, b, E, params, code, barDia, rpaZone);
    displayResults(results, b, h, L, code);
    drawDiagrams(type, L, w, P, a, results);
    drawCrossSection(b, h, results);
});

function getCodeParams(code, fc) {
    if (code === 'aci') {
        return { phi_bend: 0.90, phi_shear: 0.75, fy: 420, fc: fc, def_limit: 240, fr: 0.62 * Math.sqrt(fc) };
    } else if (code === 'ec2') {
        return { gamma_c: 1.5, gamma_s: 1.15, fy: 500, fc: fc, def_limit: 250, fr: 0.3 * Math.pow(fc, 2/3) };
    } else {
        return { gamma_c: 1.5, gamma_s: 1.15, fy: 400, fc: fc, def_limit: 250, fr: 0.6 + 0.06 * fc };
    }
}

function getRP99Constraints(zone, b, h, L) {
    let min_b = 20; 
    let min_h = 30; 
    let ratio_lh = (b / h);
    
    if (zone === 'zone3') {
        min_b = 30; 
    }

    if (b < min_b) return { valid: false, msg: `عرض الرافدة b يجب أن لا يقل عن ${min_b} سم في هذه المنطقة حسب المادة 7.1.1.`, msgFr: `La largeur b doit être d'au moins ${min_b} cm selon RPA99 Art 7.1.1.` };
    if (h < min_h) return { valid: false, msg: `ارتفاع الرافدة h يجب أن لا يقل عن ${min_h} سم حسب المادة 7.1.1.`, msgFr: `La hauteur h doit être d'au moins ${min_h} cm selon RPA99 Art 7.1.1.` };
    if (ratio_lh < 0.25) return { valid: false, msg: `نسبة العرض إلى الارتفاع b/h يجب أن تكون أكبر من 0.25.`, msgFr: `Le rapport b/h doit être supérieur à 0.25.` };
    
    return { valid: true };
}

function calculateBeam(type, L, w, P, a, h, b, E, params, code, barDia, rpaZone) {
    let R1, R2, Mmax, Vmax;
    
    if (type === 'simple') {
        R1 = (w * L) / 2 + (P * (L - a)) / L;
        R2 = (w * L) + P - R1;
        let M_at_P = (w * a * (L - a)) / 2 + (P * a * (L - a)) / L;
        let M_mid = (w * L * L) / 8;
        Mmax = Math.max(M_mid, M_at_P);
        Vmax = Math.max(R1, R2);
    } else { 
        R1 = (w * L) + P; R2 = 0; Vmax = R1;
        Mmax = (w * L * L) / 2 + P * L; 
    }

    const Ig = (b * Math.pow(h, 3)) / 12; 
    const E_MPa = E * 1000;
    const yt = h / 2;
    const Mcr = (params.fr * (Ig * 1e4)) / (yt * 10) / 1e6; 
    
    let I_effective = Ig; 
    if (Mmax > Mcr) {
        let crRatio = Mcr / Mmax;
        let Icr = Ig * 0.4; 
        I_effective = Math.min(Ig, Math.pow(crRatio, 3) * Ig + (1 - Math.pow(crRatio, 3)) * Icr);
    }

    let deflection = 0;
    const I_mm4 = I_effective * 1e4;
    const L_mm = L * 1000;

    if (type === 'simple') {
        let delta_w = (5 * w * Math.pow(L_mm, 4)) / (384 * E_MPa * I_mm4);
        let delta_p = P > 0 ? (P * 1000 * a * 1000 * (L_mm * L_mm - a*1000*a*1000 - (L_mm - a*1000)*(L_mm - a*1000))) / (6 * E_MPa * I_mm4 * L_mm) : 0;
        deflection = delta_w + delta_p;
    } else {
        deflection = ((w * Math.pow(L_mm, 4)) / (8 * E_MPa * I_mm4)) + ((P * 1000 * Math.pow(L_mm, 3)) / (3 * E_MPa * I_mm4));
    }

    const d = 0.9 * h; 
    const M_Nmm = Mmax * 1e6;
    let As = 0, AsPrime = 0;
    let doubleReinforced = false;

    let Rlim = 0.156, fcd = params.fc, fyd = params.fy;
    if (code === 'aci') { fcd = params.fc; fyd = params.fy; Rlim = 0.18; } 
    else if (code === 'ec2') { fcd = params.fc / params.gamma_c; fyd = params.fy / params.gamma_s; Rlim = 0.167; }
    else { fcd = (0.85 * params.fc) / params.gamma_c; fyd = params.fy / params.gamma_s; Rlim = 0.160; } 
    
    const Mlim = Rlim * (b * 10) * Math.pow(d * 10, 2) * fcd; 

    if (M_Nmm > Mlim) {
        doubleReinforced = true;
        let M2 = M_Nmm - Mlim;
        let dPrime = 40; 
        
        if (code === 'aci') {
            As = (Mlim / (params.phi_bend * fyd * (d * 10 * 0.9))) / 100; 
            AsPrime = (M2 / (params.phi_bend * fyd * (d * 10 - dPrime))) / 100;
            As += AsPrime; 
        } else {
            As = (Mlim / (fyd * (d * 10 * 0.9))) / 100;
            AsPrime = (M2 / (fyd * (d * 10 - dPrime))) / 100;
            As += AsPrime;
        }
    } else {
        if (code === 'aci') {
            let rn = M_Nmm / (params.phi_bend * b * 10 * Math.pow(d * 10, 2));
            let rho = (0.85 * params.fc / fyd) * (1 - Math.sqrt(1 - (2 * rn) / (0.85 * params.fc)));
            if (isNaN(rho)) rho = 0.005;
            As = rho * (b * 10) * (d * 10) / 100;
        } else {
            let mu = M_Nmm / (b * 10 * Math.pow(d * 10, 2) * fcd);
            let omega = 1 - Math.sqrt(1 - 2 * mu);
            if (isNaN(omega)) omega = 0.1;
            As = (omega * b * 10 * d * 10 * fcd / fyd) / 100;
        }
        AsPrime = 0.001 * b * h; 
        if (AsPrime < 1.5) AsPrime = 1.5; 
    }

    const Ac = b * h;
    let As_min = 0;
    
    if (code === 'aci') {
        As_min = Math.max(0.25 * Math.sqrt(params.fc) / params.fy, 1.4 / params.fy) * b * d;
    } else if (code === 'ec2') {
        As_min = Math.max(0.26 * (params.fr / params.fy), 0.0013) * b * d;
    } else {
        let rpa_min_ratio = 0.005; 
        As_min = rpa_min_ratio * b * h;
    }
    
    if (As < As_min) As = As_min;

    if (code === 'cba93') {
        let max_rpa_allowed = 0.04 * Ac;
        if (As > max_rpa_allowed) As = max_rpa_allowed;
    }

    const singleBarArea = (Math.PI * Math.pow(barDia / 10, 2)) / 4;
    let barsCount = Math.ceil(As / singleBarArea);
    if (barsCount < 2) barsCount = 2;

    let barsPrimeCount = Math.ceil(AsPrime / singleBarArea);
    if (barsPrimeCount < 2) barsPrimeCount = 2; 

    const concreteCover = 3.5; 
    const stirrupDia = 0.8; 
    const availableWidth = b - (2 * concreteCover) - (2 * stirrupDia);
    const clearSpacing = (availableWidth - (barsCount * (barDia / 10))) / (barsCount - 1);
    let spacingWarning = clearSpacing < Math.max(2.5, barDia / 10);

    const Vu = Vmax * 1000; 
    let Av_s = 0, shear_status = '', phi_Vc = 0;

    if (code === 'aci') {
        let Vc = 0.17 * Math.sqrt(params.fc) * (b * 10) * (d * 10); phi_Vc = params.phi_shear * Vc;
        if (Vu > phi_Vc) {
            Av_s = ((Vu - phi_Vc) / params.phi_shear * 10) / (params.fy * (d * 10)); shear_status = 'يحتاج كانات';
        } else if (Vu > phi_Vc / 2) {
            shear_status = 'تسليح أدنى للقص'; Av_s = (0.062 * Math.sqrt(params.fc) * b * 10) / params.fy;
        } else { shear_status = 'آمن بدون كانات'; }
    } else if (code === 'ec2') {
        let CRdc = 0.18 / params.gamma_c, k = Math.min(2, 1 + Math.sqrt(200 / (d * 10))), rho1 = Math.min(0.02, As / (b * d));
        let VRdc = (CRdc * k * Math.pow(100 * rho1 * params.fc, 1/3)) * (b * 10) * (d * 10); phi_Vc = VRdc;
        if (Vu > VRdc) {
            shear_status = 'يحتاج كانات'; Av_s = (Vu / ((0.9 * d * 10) * (params.fy / params.gamma_s))) * 10;
        } else { shear_status = 'آمن بدون كانات'; }
    } else {
        let tau_u = Vu / (b * 10 * d * 10); 
        let tau_lim = Math.min(0.2 * params.fc / params.gamma_c, 5.0); 
        
        if (tau_u > tau_lim) {
            shear_status = 'المقطع صغير جداً'; 
            Av_s = (Vu / ((0.9 * d * 10) * (params.fy / params.gamma_s))) * 10;
        } else if (tau_u > 0.05 * params.fc) {
            shear_status = 'يحتاج كانات';
            Av_s = (b * 10 * 0.3) * (tau_u / (params.fy / params.gamma_s));
        } else {
            shear_status = 'آمن بدون كانات';
            Av_s = 0.003 * b * 100; 
        }
    }
    Av_s = Av_s * 100; 

    const timeMonths = parseFloat(document.getElementById('time').value) || 12;
    const deltaLongTerm = calculateLongTermDeflection(deflection, (AsPrime/(b*d)), timeMonths, code);

    return {
        R1, R2, Mmax, Vmax, deflection, deltaLongTerm, As, AsPrime, Av_s, shear_status, d, 
        status: { deflection_ok: deltaLongTerm <= (L_mm / params.def_limit), as_ok: As <= (0.04 * Ac), shear_ok: shear_status !== 'المقطع صغير جداً' },
        barsCount, barsPrimeCount, barDia, spacingWarning, doubleReinforced, type
    };
}

function displayResults(res, b, h, L, code) {
    document.getElementById('r1').textContent = res.R1.toFixed(2);
    document.getElementById('r2').textContent = res.R2.toFixed(2);
    document.getElementById('mmax').textContent = res.Mmax.toFixed(2);
    document.getElementById('vmax').textContent = res.Vmax.toFixed(2);
    document.getElementById('as').textContent = res.As.toFixed(2);
    document.getElementById('as_prime').textContent = res.AsPrime.toFixed(2);
    document.getElementById('deflection').textContent = res.deflection.toFixed(2);
    document.getElementById('deflection_lt').textContent = res.deltaLongTerm.toFixed(2);
    document.getElementById('av_s').textContent = res.Av_s.toFixed(2);
    
    const barsDetailEl = document.getElementById('bars_detail');
    let txtSuf = res.type === 'cantilever' ? (currentLang === 'ar' ? ' (علوي للظفر)' : ' (supérieur)') : (currentLang === 'ar' ? ' (سفلي)' : ' (inférieur)');
    let barsOutput = `${res.barsCount} Φ ${res.barDia}` + txtSuf;
    if (res.spacingWarning) {
        barsOutput += currentLang === 'ar' ? ' ⚠️ (المسافة ضيقة!)' : ' ⚠️ (Espacement serré!)';
        barsDetailEl.style.color = '#ffa500';
    } else { barsDetailEl.style.color = '#2ed573'; }
    barsDetailEl.textContent = barsOutput;

    const barsPrimeDetailEl = document.getElementById('bars_prime_detail');
    let txtPr = "";
    if (currentLang === 'ar') {
        txtPr = res.doubleReinforced ? ' (حديد ضغط إنشائي علوي)' : ' (حديد تعليق الكانات علوي)';
        if (res.type === 'cantilever') txtPr = res.doubleReinforced ? ' (حديد ضغط إنشائي سفلي)' : ' (حديد سفلي تكميلي)';
    } else {
        txtPr = res.doubleReinforced ? ' (Armature de compression)' : ' (Barres de montage)';
    }
    barsPrimeDetailEl.textContent = `${res.barsPrimeCount} Φ ${res.barDia}` + txtPr;

    const shearEl = document.getElementById('shear_status');
    if (res.shear_status === 'يحتاج كانات') {
        shearEl.textContent = currentLang === 'ar' ? 'يحتاج كانات' : 'Étriers requis';
    } else if (res.shear_status === 'تسليح أدنى للقص') {
        shearEl.textContent = currentLang === 'ar' ? 'تسليح أدنى للقص' : 'Armature min requise';
    } else if (res.shear_status === 'المقطع صغير جداً') {
        shearEl.textContent = currentLang === 'ar' ? 'المقطع غير كافٍ للقص ❌' : 'Section insuffisante';
    } else {
        shearEl.textContent = currentLang === 'ar' ? 'آمن بدون كانات' : 'Sûr sans étriers';
    }

    document.getElementById('as').style.color = res.status.as_ok ? '#2ed573' : '#ff4757';
    document.getElementById('deflection_lt').style.color = res.status.deflection_ok ? '#2ed573' : '#ff4757';
    shearEl.style.color = res.status.shear_ok ? (res.Av_s > 0 ? '#ffa500' : '#2ed573') : '#ff4757';

    let checkMsg = "";
    if (currentLang === 'ar') {
        checkMsg = `سهم الأمد الطويل: ${res.status.deflection_ok ? 'مقبول' : 'مرفوض'} | التسليح الطولي: ${res.status.as_ok ? 'مقبول' : 'خارج الحدود'} | القص: ${res.status.shear_ok ? 'آمن' : 'المقطع صغير جداً'}`;
    } else {
        checkMsg = `Flèche LT: ${res.status.deflection_ok ? 'OK' : 'Non conforme'} | Acier longitudinal: ${res.status.as_ok ? 'OK' : 'Hors limite'} | Cisaillement: ${res.status.shear_ok ? 'Sûr' : 'Section insuffisante'}`;
    }

    let checkEl = document.getElementById('code_check');
    if (!checkEl) {
        checkEl = document.createElement('p'); checkEl.id = 'code_check'; document.querySelector('.results').appendChild(checkEl);
    }
    checkEl.textContent = checkMsg;
    checkEl.style.backgroundColor = (res.status.deflection_ok && res.status.as_ok && res.status.shear_ok) ? 'rgba(46, 213, 115, 0.15)' : 'rgba(255, 71, 87, 0.15)';
    checkEl.style.color = (res.status.deflection_ok && res.status.as_ok && res.status.shear_ok) ? '#2ed573' : '#ff4757';
}



function drawCrossSection(b_cm, h_cm, res) {
    const canvas = document.getElementById('sectionCanvas'); if (!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cW = canvas.width; const cH = canvas.height;

    const scale = Math.min((cW - 160) / b_cm, (cH - 60) / h_cm);
    const drawB = b_cm * scale; const drawH = h_cm * scale;
    const startX = (cW - drawB) / 2; const startY = (cH - drawH) / 2;

    ctx.fillStyle = '#334155'; ctx.fillRect(startX, startY, drawB, drawH);
    ctx.strokeStyle = '#4a6cf7'; ctx.lineWidth = 3; ctx.strokeRect(startX, startY, drawB, drawH);

    const coverPx = 4 * scale; 
    const stirrupX = startX + coverPx; const stirrupY = startY + coverPx;
    const stirrupW = drawB - (2 * coverPx); const stirrupH = drawH - (2 * coverPx);
    
    ctx.strokeStyle = '#ff4757'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.strokeRect(stirrupX, stirrupY, stirrupW, stirrupH); ctx.setLineDash([]); 

    const drawBars = (count, posY, isMain) => {
        const radius = Math.max(4, (res.barDia / 10) * scale * 0.4);
        if (count === 1) {
            ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(stirrupX + stirrupW/2, posY, radius+1, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(stirrupX + stirrupW/2, posY, radius, 0, Math.PI*2); ctx.fill();
        } else {
            for (let i = 0; i < count; i++) {
                const posX = stirrupX + (i * (stirrupW / (count - 1)));
                ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(posX, posY, radius+1, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = isMain ? '#2ed573' : '#ff9f43'; ctx.beginPath(); ctx.arc(posX, posY, radius, 0, Math.PI*2); ctx.fill();
            }
        }
    };

    if (res.type === 'cantilever') {
        drawBars(res.barsCount, stirrupY, true);
        drawBars(res.barsPrimeCount, stirrupY + stirrupH, false);
    } else {
        drawBars(res.barsCount, stirrupY + stirrupH, true);
        drawBars(res.barsPrimeCount, stirrupY, false);
    }

    ctx.fillStyle = '#94a3b8'; ctx.font = '12px Cairo'; ctx.fillText(`b = ${b_cm} cm`, startX + drawB/2 - 20, startY + drawH + 18);
    ctx.save(); ctx.translate(startX - 15, startY + drawH/2 + 20); ctx.rotate(-Math.PI / 2); ctx.fillText(`h = ${h_cm} cm`, 0, 0); ctx.restore();
}

function drawDiagrams(type, L, w, P, a, res) {
    const canvas = document.getElementById('beamCanvas'); if (!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width; const height = canvas.height;
    const paddingX = 60; const scaleX = (width - paddingX * 2) / L; const yBaseline = height / 2;

    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(paddingX, yBaseline - 40); ctx.lineTo(width - paddingX, yBaseline - 40);
    ctx.moveTo(paddingX, yBaseline + 40); ctx.lineTo(width - paddingX, yBaseline + 40); ctx.stroke(); ctx.setLineDash([]);

    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(paddingX, yBaseline); ctx.lineTo(width - paddingX, yBaseline); ctx.stroke();

    ctx.strokeStyle = '#1e90ff'; ctx.fillStyle = 'rgba(30, 144, 255, 0.15)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(paddingX, yBaseline);
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
        let x = (L / steps) * i; let Mx = (type === 'simple') ? ((w * x * (L - x)) / 2 + (P > 0 ? (x >= a ? (P * (L - x) * a) / L : (P * x * (L - a)) / L) : 0)) : -((w * Math.pow(L - x, 2)) / 2 + P * (L - x));
        ctx.lineTo(paddingX + x * scaleX, yBaseline + (Mx / Math.max(1, res.Mmax)) * 40);
    }
    ctx.lineTo(paddingX + L * scaleX, yBaseline); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.strokeStyle = '#ff4757'; ctx.fillStyle = 'rgba(255, 71, 87, 0.1)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(paddingX, yBaseline);
    if (type === 'simple') {
        ctx.lineTo(paddingX, yBaseline - (res.R1 / res.Vmax) * 40);
        ctx.lineTo(paddingX + a * scaleX, yBaseline - ((res.R1 - w * a) / res.Vmax) * 40);
        ctx.lineTo(paddingX + a * scaleX, yBaseline - ((res.R1 - w * a - P) / res.Vmax) * 40);
        ctx.lineTo(paddingX + L * scaleX, yBaseline - ((res.R1 - w * L - P) / res.Vmax) * 40);
    } else {
        ctx.lineTo(paddingX, yBaseline - (res.R1 / res.Vmax) * 40); ctx.lineTo(paddingX + L * scaleX, yBaseline);
    }
    ctx.lineTo(paddingX + L * scaleX, yBaseline); ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#1e90ff'; ctx.font = 'bold 11px Arial'; ctx.fillText(`Mmax: ${res.Mmax.toFixed(1)} kN.m`, paddingX, yBaseline + 55);
    ctx.fillStyle = '#ff4757'; ctx.fillText(`Vmax: ${res.Vmax.toFixed(1)} kN`, width - paddingX - 90, yBaseline - 45);
}

function validateInputs(L, w, P, a, h, b, type) {
    if (isNaN(L) || L <= 0 || isNaN(h) || h <= 0 || isNaN(b) || b <= 0) { alert(currentLang === 'ar' ? 'خطأ هندسي: يرجى التأكد من القيم.' : 'Erreur: Vérifiez les dimensions.'); return false; }
    if (type === 'simple' && (a < 0 || a > L)) { alert(currentLang === 'ar' ? 'موضع الحمل خارج البحر.' : 'Position de P hors travée.'); return false; }
    return true;
}








document.getElementById('pdfBtn').addEventListener('click', function() {
    if (!window.jspdf) { alert('jsPDF library missing.'); return; }
    const { jsPDF } = window.jspdf; const doc = new jsPDF();
    doc.setFontSize(16); doc.text('Advanced Structural Calculation Report', 105, 20, { align: 'center' });
    doc.setFontSize(10); doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 27, { align: 'center' });
    doc.line(20, 32, 190, 32); doc.setFontSize(11); let y = 42;
    
    const lines = [
        `Beam Model & Code: ${document.getElementById('beamType').value.toUpperCase()} / ${document.getElementById('designCode').value.toUpperCase()}`,
        `Max Bending Moment (Mmax): ${document.getElementById('mmax').textContent} kN.m`,
        `Max Shear Force (Vmax): ${document.getElementById('vmax').textContent} kN`,
        `Required Tension Steel (As): ${document.getElementById('as').textContent} cm² (${document.getElementById('bars_detail').textContent})`,
        `Compression/Hanger Steel (As'): ${document.getElementById('as_prime').textContent} cm² (${document.getElementById('bars_prime_detail').textContent})`,
        `Shear Reinforcement (Av/s): ${document.getElementById('av_s').textContent} cm²/m`,
        `Long-Term Deflection (lt): ${document.getElementById('deflection_lt').textContent} mm`
    ];
    lines.forEach(l => { doc.text(l, 20, y); y += 8; });

    const c1 = document.getElementById('beamCanvas'); const c2 = document.getElementById('sectionCanvas');
    if (c1) doc.addImage(c1.toDataURL('image/png'), 'PNG', 15, y + 5, 180, 55);
    if (c2) doc.addImage(c2.toDataURL('image/png'), 'PNG', 60, y + 65, 90, 45);
    doc.save('Advanced_Beam_Report.pdf');
});

document.getElementById('saveBtn').addEventListener('click', function() {
    const data = {
        length: document.getElementById('length').value, load_w: document.getElementById('load_w').value, load_p: document.getElementById('load_p').value,
        distance_a: document.getElementById('distance_a').value, height: document.getElementById('height').value, width: document.getElementById('width').value,
        fc: document.getElementById('fc').value, elasticity: document.getElementById('elasticity').value, time: document.getElementById('time').value,
        designCode: document.getElementById('designCode').value, beamType: document.getElementById('beamType').value, barDiameter: document.getElementById('barDiameter').value,
        rpaZone: document.getElementById('rpaZone').value
    };
    localStorage.setItem('beamProjectProPlus', JSON.stringify(data));
    alert(currentLang === 'ar' ? 'تم الحفظ بنجاح.' : 'Projet enregistré.');
});

document.getElementById('loadBtn').addEventListener('click', function() {
    const saved = localStorage.getItem('beamProjectProPlus');
    if (!saved) { alert(currentLang === 'ar' ? 'لا يوجد ملف.' : 'Aucun projet.'); return; }
    const data = JSON.parse(saved);
    for (let k in data) { if (document.getElementById(k)) document.getElementById(k).value = data[k]; }
    const rpaGroup = document.getElementById('rpaZone').closest('.input-group') || document.getElementById('rpaZone').parentElement;
    if(rpaGroup) rpaGroup.style.display = document.getElementById('designCode').value === 'cba93' ? 'block' : 'none';
    alert(currentLang === 'ar' ? 'تم استعادة المشروع.' : 'Projet chargé.');
});

document.getElementById('calcSlabBtn').addEventListener('click', function() {
    const type = document.getElementById('slabType').value;
    const L = parseFloat(document.getElementById('slab_length').value) || 4;
    const Q = parseFloat(document.getElementById('slab_load_q').value) || 2.5;

    let thickness = 0; let steelSuggestion = "";
    if (type === 'solid') {
        thickness = Math.ceil((L * 100) / 30); if (thickness < 12) thickness = 12;
        let qu = 1.35 * (thickness/100 * 25) + 1.5 * Q;
        let mmax = (qu * L * L) / 8;
        steelSuggestion = currentLang === 'ar' ? `Φ 10 كل 15 سم (شبكة سفلية)` : `Φ 10 chaque 15 cm (Treillis inf)`;
        document.getElementById('res_slab_thickness').textContent = `${thickness} cm (Dalle Pleine)`;
        document.getElementById('res_slab_qu').textContent = qu.toFixed(1);
        document.getElementById('res_slab_mmax').textContent = mmax.toFixed(1);
    } else {
        thickness = 20; 
        let qu = 1.35 * 2.8 + 1.5 * Q;
        let mmax = (qu * L * L) / 8;
        steelSuggestion = currentLang === 'ar' ? `1 Φ 12 + 1 Φ 10 في كل عصب` : `1 Φ 12 + 1 Φ 10 par poutrelle`;
        document.getElementById('res_slab_thickness').textContent = `20 cm (Corps Creux 16+4)`;
        document.getElementById('res_slab_qu').textContent = qu.toFixed(1);
        document.getElementById('res_slab_mmax').textContent = mmax.toFixed(1);
    }
    document.getElementById('res_slab_steel').textContent = steelSuggestion;
});

document.getElementById('calcMatBtn').addEventListener('click', function() {
    const V = parseFloat(document.getElementById('mat_volume').value) || 0;
    const dosage = parseFloat(document.getElementById('mat_dosage').value);

    const totalCementKg = V * dosage;
    const cementBags = Math.ceil(totalCementKg / 50);
    const cementTons = totalCementKg / 1000;
    const sandVolume = V * 0.4;   
    const gravelVolume = V * 0.8; 
    const waterLiters = V * 180;  

    document.getElementById('res_cement_bags').textContent = cementBags;
    document.getElementById('res_cement_tons').textContent = cementTons.toFixed(1);
    document.getElementById('res_sand').textContent = sandVolume.toFixed(1);
    document.getElementById('res_gravel').textContent = gravelVolume.toFixed(1);
    document.getElementById('res_water').textContent = waterLiters.toFixed(0);
});

function convertAllUnits() {
    const mpa = parseFloat(document.getElementById('val_mpa').value) || 0;
    document.getElementById('res_bar').textContent = (mpa * 10).toFixed(2);
    document.getElementById('res_kgcm').textContent = (mpa * 10.197).toFixed(2);
    document.getElementById('res_psi').textContent = (mpa * 145.038).toFixed(2);

    const meters = parseFloat(document.getElementById('val_meters').value) || 0;
    document.getElementById('res_cm').textContent = (meters * 100).toFixed(2);
    document.getElementById('res_mm').textContent = (meters * 1000).toFixed(2);
    document.getElementById('res_inch').textContent = (meters * 39.3701).toFixed(2);
    document.getElementById('res_feet').textContent = (meters * 3.28084).toFixed(2);

    const tons = parseFloat(document.getElementById('val_tons').value) || 0;
    document.getElementById('res_kg').textContent = (tons * 1000).toFixed(1);
    document.getElementById('res_lb').textContent = (tons * 2204.62).toFixed(1);

    const knm = parseFloat(document.getElementById('val_knm').value) || 0;
    document.getElementById('res_nmm').textContent = (knm * 1e6).toFixed(0);
    document.getElementById('res_kgm').textContent = (knm * 101.9716).toFixed(2);
}


// =========================================================================================
// محرك حساب مقاييس الأوتوكاد التفاعلي (AutoCAD Scale Engine)
// =========================================================================================
function convertCadScale() {
    const scaleSelect = document.getElementById('cad_scale');
    const measuredInput = document.getElementById('cad_measured');
    const outputElement = document.getElementById('out_cad_real');

    // حماية برمجية: إذا لم تكن العناصر قد ظهرت بعد في الـ HTML لا تنفذ الحساب لتجنب الخطأ
    if (!scaleSelect || !measuredInput || !outputElement) return;

    const scaleDenom = parseFloat(scaleSelect.value);
    const measuredCm = parseFloat(measuredInput.value) || 0;
    
    // الحساب: المسافة الحقيقية بالمتر
    const realDistanceMeters = (measuredCm * scaleDenom) / 100;
    
    // طباعة النتيجة ديناميكياً حسب اللغة الحالية
    const unitText = currentLang === 'ar' ? ' متر' : ' m';
    outputElement.textContent = realDistanceMeters.toFixed(2) + unitText;
}



const translations = {
    ar: {
        title: "حاسبة تصميم الروافد الخرسانية الاحترافية المتقدمة",
        lbl_sub_logo: "منصة المهندس المدني",
        nav_beams: "⚙️ حاسبة الروافد الاحترافية",
        nav_slabs: "📐 حاسبة البلاطات (Slabs)",
        nav_materials: "📊 حاسبة كميات المواد",
        nav_converter: "🔄 محول الوحدات والمراجع",
        card_inputs: "المدخلات الهندسية",
        lbl_type: "نوع الرافدة الإنشائي:",
        lbl_code: "الكود التصميمي المعتمد:",
        lbl_rpa_zone: "المنطقة الزلزالية (حسب RPA 99):",
        lbl_bar_dia: "قطر أسياخ التسليح الطولي المختَار (ملم):",
        lbl_time: "عمر التحميل الكلي (بالشهور):",
        lbl_length: "طول الرافدة الصافي L (متر):",
        lbl_w: "الحمل الموزع المنتظم w (kN/m):",
        lbl_p: "الحمل المركز المطبق P (kN):",
        lbl_a: "موضع الحمل P عن المسند الأيسر a (متر):",
        lbl_h: "الارتفاع الكلي للقطاع h (سم):",
        lbl_b: "عرض القطاع الخرساني b (سم):",
        lbl_fc: "مقاومة الخرسانة المميزة fc' (MPa):",
        lbl_e: "معامل مرونة الخرسانة E (GPa):",
        calcBtn: "حساب وتصميم المقطع",
        pdfBtn: "تصدير تقرير حسابي هندسي (PDF)",
        saveBtn: "حفظ التصميم الحالي",
        loadBtn: "استعادة آخر تصميم",
        card_results: "النتائج ومخططات التحليل الإنشائي",
        lbl_diagrams_title: "مخططات العزم والقص الأساسية:",
        lbl_section_title: "التفصيل الرسومي للمقطع العرضي (Cross-Section):",
        lbl_r1: "رد فعل المسند الأيسر R1:",
        lbl_r2: "رد فعل المسند الأيمن R2:",
        lbl_mmax: "العزم الأقصى التصميمي Mmax:",
        lbl_vmax: "قوة القص القصوى العظمى Vmax:",
        lbl_as: "مساحة تسليح الشد المطلوبة As:",
        lbl_bars_count: "تفريد حديد الشد الرئيسي (السفلي):",
        lbl_as_prime: "تسليح الضغط / التعليق العلوى As':",
        lbl_bars_prime_count: "تفريد حديد التعليق / الضغط (العلوي):",
        lbl_avs: "التسليح العرضي المطلوب للقص Av/s:",
        lbl_shear: "حالة الإجهاد والقص للمقطع:",
        lbl_def: "السهم اللحظي δmax:",
        lbl_def_long: "السهم الكلي طويل الأمد δlt:",
        slab_title: "حاسبة تصميم البلاطات الخرسانية والأعصاب (Slabs Design)",
        card_slab_inputs: "مدخلات البلاطة الإنشائية",
        lbl_slab_type: "نوع السقف المقترح:",
        lbl_slab_length: "أطول بحر أو مسافة بين الروافد L (متر):",
        lbl_slab_q: "الحمولة الحية المستغلة Q (kN/m²):",
        calcSlabBtn: "تحليل وتصميم السقف",
        card_slab_results: "السمك الموصى به والتسليح المقترح لـ 1 متر",
        lbl_res_thickness: "السمك الكلي الآمن للبلاطة:",
        lbl_res_qu: "الحمولة التصميمية الإجمالية القصوى qu:",
        lbl_res_slab_mmax: "عزم الانحناء الأقصى المتولد:",
        lbl_res_steel: "التوزيع المقترح للتسليح والتسليح الفرعي:",
        mat_title: "حاسبة حساب وتقدير كميات المواد الخرسانية بالموقع",
        card_mat_inputs: "حجم صب الخرسانة المستهدف والعيار المعياري",
        lbl_mat_volume: "الحجم الإجمالي المراد صبه بالمتر المكعب (m³):",
        lbl_mat_dosage: "جرعة الإسمنت المعتمدة للمتر المكعب (Dosage):",
        calcMatBtn: "تقدير كميات التوريد الفورية",
        card_mat_results: "بيان المواد والمكونات المطلوبة لطلب الشراء للموقع",
        lbl_res_bags: "عدد أكياس الإسمنت اللازمة (سعة 50 كجم):",
        lbl_res_tons: "الوزن الصافي الكلي للإسمنت:",
        lbl_res_sand: "حجم الرمل الكلي المطلوب لتوريده:",
        lbl_res_gravel: "حجم الحصى الإجمالي المطلوب لتوريده:",
        lbl_res_water: "الكمية التقريبية لمياه خلط العجنة الخرسانية:",
        conv_title: "محول الوحدات الهندسي المتكامل والمراجع اللائحية",
        card_conv_stress: "1. تحويل الإجهادات والمقاومة (Stress & Pressure)",
        lbl_conv_mpa: "القيمة بوحدة الـ MegaPascal (MPa):",
        lbl_res_bar: "بوحدة الـ Bar:",
        lbl_res_kgcm: "بوحدة (kg/cm²):",
        lbl_res_psi: "بوحدة الرطل/بوصة² (Psi):",
        card_conv_length: "2. تحويل الأطوال والبحور (Lengths)",
        lbl_conv_meters: "القيمة بوحدة المتر (m):",
        lbl_res_cm: "بالسنتيمتر (cm):",
        lbl_res_mm: "بالمليمتر (mm):",
        lbl_res_inch: "بالبوصة / إنش (Inch):",
        lbl_res_feet: "بالقدم (Feet):",
        card_conv_weight: "3. تحويل الأوزان وتوريد الحديد (Weights)",
        lbl_conv_tons: "القيمة بوحدة الطن الإنشائي (Ton):",
        lbl_res_kg: "بالكيلوجرام (kg):",
        lbl_res_lb: "بالرطل (Pound - lb):",
        card_conv_moment: "4. تحويل عزوم الانحناء (Bending Moments)",
        lbl_conv_knm: "القيمة بوحدة الـ (kN.m):",
        lbl_res_nmm: "بوحدة الـ (N.mm):",
        lbl_res_kgm: "بوحدة الـ (kg.m):",
        card_references: "المراجع والأكواد الهندسية الرسمية واللوائح",
        lbl_ref_cba: "اللوائح والقواعد الجزائرية الرسمية لحساب وتصميم المنشآت والخرسانة المسلحة.",
        lbl_ref_rpa: "القواعد والتشريعات الجزائرية المعتمدة للأبنية المقاومة للزلازل والتحقق الإنشائي.",
        lbl_ref_aci: "كود المعهد الأمريكي للخرسانة لتصميم المنشآت والهياكل.",
        
        
       // --- ترجمة جناح البحوث الأكاديمية (RPA99 / CBA93) ---
        nav_wonders: "🎓 جناح البحوث الاكاديمية و مذكرات التخرج",
        wonders_title: "🎓جناح البحوث الاكاديمية و مذكرات التخرج",
        wonders_sub: "أدوات متطورة لحساب المنشآت والتحقق الإنشائي وفق المعايير واللوائح الجزائرية الرسمية.",
        tab_rpa: "📈 طيف الاستجابة الزلزالي (RPA99)",
        tab_cba: "📐 انبعاج الأعمدة (CBA93)",
        lbl_rpa_zone1: "المنطقة الزلزالية :",
        lbl_rpa_soil: "نوع التربة أو الموقع (Site) :",
        lbl_rpa_r: "معامل السلوك الهيكلي (R) :",
        lbl_rpa_q: "معامل الجودة (Q) :",
        h_cba_dim: "أبعاد العمود والأطوال",
        lbl_cba_b: "عرض العمود b (متر) :",
        lbl_cba_h: "عمق العمود h (متر) :",
        lbl_cba_lo: "الطول الحر للعمود L0 (متر) :",
        h_cba_cond: "شروط التثبيت والمقاومة",
        lbl_cba_type: "نوع التثبيت والاستناد (Fixation) :",
        res_cba_lf: "الطول الفعال Lf :",
        res_cba_lambda: "درجة النحافة (Élancement λ) :",
        res_cba_alpha: "معامل الخفض الخرساني (α) :",
        // أضف هذه الأسطر في نهاية قسم الـ ar
        opt_zone1: "المنطقة 1 (نشاط ضعيف)",
        opt_zone2: "المنطقة 2 (نشاط متوسط)",
        opt_zone3: "المنطقة 3 (نشاط متوسط مرتفع)",
        opt_zone4: "المنطقة 4 (نشاط مرتفع)",
        opt_site1: "S1 (صخرية صلبة) T2=0.3s",
        opt_site2: "S2 (ثابتة) T2=0.4s",
        opt_site3: "S3 (ليّنة) T2=0.5s",
        opt_site4: "S4 (ليّنة جداً) T2=0.7s",
        opt_fix1: "ممسوك من الطرفين بجسامة (lf = 0.7 L0)",
        opt_fix2: "مفصلي طابق نموذجي بناية (lf = 1.0 L0)",
        opt_fix3: "عمود كابولي حر من الأعلى (lf = 2.0 L0)",
        nav_autocad: "📐 تفاصيل ومقاييس الأوتوكاد (AutoCAD)",
        cad_title: "جناح المخططات والتفاصيل الهندسية (AutoCAD) 📐",
        cad_sub: "مكتبة تفاعلية لتحميل تفاصيل التسليح الجاهزة وحاسبة ذكية لضبط مقاييس الرسم من الأوتوكاد إلى الواقع.",
        h_cad_calc: "🔄 محول مقاييس الرسم (AutoCAD to Reality)",
        lbl_cad_scale: "اختر مقياس رسم اللوحة (Échelle) :",
        lbl_cad_measured: "المسافة المقاسة بالمسطرة على الورقة المطبوعة (cm) :",
        res_cad_real: "المسافة الحقيقية في الموقع (الواقع):",
        h_cad_lib: "📂 مكتبة تفاصيل التسليح القياسية (دليلك في الـ PFE)",
        card_cad_poteau: "تفاصيل تسليح الأعمدة (Ferraillage Poteaux)",
        card_cad_poutre: "تسليح عوارض الخرسانة (Ferraillage Poutres)",
        card_cad_semelle: "تفاصيل الأساسات المنفصلة (Semelles)",
        card_cad_escalier: "مخططات تسليح السلالم (Escaliers)",
        h_sec_title: "📐 حاسبة الأشكال الهندسية والخواص الميكانيكية (Section Properties)",
        p_sec_sub: "حساب مساحة القطاعات، عزم العطالة (Inertie)، ونصف قطر العطالة للأشكال الهندسية الإنشائية النموذجية.",
        lbl_sec_shape: "اختر شكل القطاع الإنشائي :",
        lbl_sec_b: "العرض b (متر) :",
        lbl_sec_h: "الارتفاع h (متر) :",
        lbl_sec_d: "القطر الخارجي D (متر) :",
        res_sec_area: "مساحة المقطع الفعالة (A):",
        res_sec_ix: "عزم العطالة حول المحور X (Ix):",
        res_sec_iy: "عزم العطالة حول المحور Y (Iy):",
        res_sec_ix_rad: "نصف قطر العطالة (ix):",
        res_sec_iy_rad: "نصف قطر العطالة (iy):",
        opt_appa1: "قطاع مستطيل",
        opt_appa2: "قطاع دائري",
        opt_appa3: "قطاع صندوقي مجوف",
        opt_appa4: "قطاع أنبوبي مجوف",
        opt_appa5: "قطاع مثلث",
        lbl_box_B: "العرض الخارجي B (متر) :",
        lbl_box_H: "الارتفاع الخارجي H (متر) :",
        lbl_box_b_in: "العرض الفراغي الداخلي b (متر) :",
        lbl_box_h_in: "الارتفاع الفراغي الداخلي h (متر) :",
        lbl_pipe_D: "القطر الخارجي D (متر) :",
        lbl_pipe_d_in: "القطر الداخلي الفارغ d (متر) :",
        lbl_tri_b: "قاعدة المثلث b (متر) :",
        lbl_tri_h: "ارتفاع المثلث h (متر) :",
       opt_ech1: "1/50 (1cm في اللوحة = 0.5m في الواقع)",
        opt_ech2: "1/100 (1cm في اللوحة = 1.0m في الواقع)",
        opt_ech3: "1/20 (1cm في اللوحة = 0.2m في الواقع)",
        opt_ech4: "1/25 (1cm في اللوحة = 0.25m في الواقع)",
        opt_ech5: "1/200 (1cm في اللوحة = 2.0m في الواقع)",
        h_devis_title: "💰 حاسبة تكلفة المواد والكشف التقديري (Devis Estimatif - الجزائر)",
        p_devis_sub: "حساب التكلفة الإجمالية التقريبية للمواد واليد العاملة بالدينار الجزائري (DZD) بناءً على الكميات المحسوبة أعلاه.",
        h_market_prices: "🛒 أسعار السوق الافتراضية (يمكنك تعديلها) :",
        lbl_pr_cement: "سعر كيس الإسمنت 50 كجم (DZD) :",
        lbl_pr_steel: "سعر قنطار الحديد (100 كجم) (DZD) :",
        lbl_pr_gravel: "سعر المتر المكعب حصى (Gravier) (DZD) :",
        lbl_pr_sand: "سعر المتر المكعب رمل (Sable) (DZD) :",
        lbl_pr_labor: "مصاريف اليد العاملة (الماصو) لكل 1م³ خرسانة (DZD) :",
        h_devis_res: "📊 الكشف المالي التقديري (Devis Final) :",
        res_cost_cement: "تكلفة الإسمنت الإجمالية:",
        res_cost_steel: "تكلفة الحديد الإجمالية:",
        res_cost_aggregates: "تكلفة الرمل والحصى:",
        res_cost_labor: "تكلفة مصاريف اليد العاملة:",
        res_total_cost: "المبلغ الإجمالي التقريبي للمشروع (Total HT):",
       
    },
    fr: {
        title: "Calculateur Avancé de Conception des Poutres Béton",
        lbl_sub_logo: "Plateforme de l'Ingénieur Civil",
        nav_beams: "⚙️ Calculateur des Poutres",
        nav_slabs: "📐 Calculateur des Dalles",
        nav_materials: "📊 Quantification des Matériaux",
        nav_converter: "🔄 Convertisseur & Références",
        card_inputs: "Données d'Entrée",
        lbl_type: "Type structural de la poutre:",
        lbl_code: "Code de calcul appliqué:",
        lbl_rpa_zone: "Zone Parasismique (RPA 99):",
        lbl_bar_dia: "Diamètre des barres longitudinales (mm):",
        lbl_time: "Durée d'application des charges (mois):",
        lbl_length: "Portée nette de la poutre L (m):",
        lbl_w: "Charge linéaire uniforme w (kN/m):",
        lbl_p: "Charge concentrée appliquée P (kN):",
        lbl_a: "Position de P par rapport à l'appui gauche a (m):",
        lbl_h: "Hauteur totale de la section h (cm):",
        lbl_b: "Largeur de la section b (cm):",
        lbl_fc: "Résistance caractéristique fc' (MPa):",
        lbl_e: "Module d'élasticité du béton E (GPa):",
        calcBtn: "Calculer & Dimensionner la Section",
        pdfBtn: "Exporter le Rapport Technique (PDF)",
        saveBtn: "Enregistrer le Projet",
        loadBtn: "Charger le dernier Projet",
        card_results: "Résultats & Diagrammes Structureux",
        lbl_diagrams_title: "Diagrammes des Moments et Cisaillements:",
        lbl_section_title: "Détail de la section transversale (Cross-Section):",
        lbl_r1: "Réaction d'appui Gauche R1:",
        lbl_r2: "Réaction d'appui Droite R2:",
        lbl_mmax: "Moment maximum de calcul Mmax:",
        lbl_vmax: "Effort tranchant max Vmax:",
        lbl_as: "Section d'acier tendu requise As:",
        lbl_bars_count: "Ferraillage tendu proposé (Inférieur):",
        lbl_as_prime: "Section d'acier comprimé As':",
        lbl_bars_prime_count: "Ferraillage comprimé/Montage proposé:",
        lbl_avs: "Section d'étriers de cisaillement Av/s:",
        lbl_shear: "État limite du cisaillement:",
        lbl_def: "Flèche instantanée δmax:",
        lbl_def_long: "Flèche totale à long terme δlt:",
        slab_title: "Calculateur de Conception des Dalles et Poutrelles",
        card_slab_inputs: "Données de la Dalle",
        lbl_slab_type: "Type de plancher proposé:",
        lbl_slab_length: "Plus grande portée entre nus L (m):",
        lbl_slab_q: "Charge d'exploitation Q (kN/m²):",
        calcSlabBtn: "Analyser & Calculer le Plancher",
        card_slab_results: "Épaisseur Recommandée & Ferraillage / 1m",
        lbl_res_thickness: "Épaisseur totale sécuritaire:",
        lbl_res_qu: "Charge ultime totale qu:",
        lbl_res_slab_mmax: "Moment fléchissant max développé:",
        lbl_res_steel: "Ferraillage et répartition suggérée:",
        mat_title: "Calculateur de Quantification des Matériaux de Chantier",
        card_mat_inputs: "Volume du Béton & Dosage Standard",
        lbl_mat_volume: "Volume total à couler en (m³):",
        lbl_mat_dosage: "Dosage en ciment approuvé (kg/m³):",
        calcMatBtn: "Estimer les Quantités d'Achat",
        card_mat_results: "Bon de Commande des Matériaux pour le Chantier",
        lbl_res_bags: "Nombre de sacs de ciment requis (50 kg):",
        lbl_res_tons: "Poids net total du ciment:",
        lbl_res_sand: "Volume total de sable requis:",
        lbl_res_gravel: "Volume total de gravier requis:",
        lbl_res_water: "Quantité d'eau d'automalaxage approx:",
        conv_title: "Convertisseur d'Unités d'Ingénierie & Règlements",
        card_conv_stress: "1. Conversion des Contraintes & Pressions",
        lbl_conv_mpa: "Valeur en MegaPascal (MPa):",
        lbl_res_bar: "En unité Bar:",
        lbl_res_kgcm: "En unité (kg/cm²):",
        lbl_res_psi: "En unité (Psi):",
        card_conv_length: "2. Conversion des Longueurs & Portées",
        lbl_conv_meters: "Valeur en Mètre (m):",
        lbl_res_cm: "En Centimètres (cm):",
        lbl_res_mm: "En Millimètres (mm):",
        lbl_res_inch: "En Pouces / Inches:",
        lbl_res_feet: "En Pieds / Feet:",
        card_conv_weight: "3. Conversion des Poids & Armatures",
        lbl_conv_tons: "Valeur en Tonne Métrique (Ton):",
        lbl_res_kg: "En Kilogrammes (kg):",
        lbl_res_lb: "En Livres (Pound - lb):",
        card_conv_moment: "4. Conversion des Moments Fléchissants",
        lbl_conv_knm: "Valeur en (kN.m):",
        lbl_res_nmm: "En unité (N.mm):",
        lbl_res_kgm: "En unité (kg.m):",
        card_references: "Codes de Calcul & Règlements Officiels",
        lbl_ref_cba: "Règles de conception et de calcul des structures en béton armé (Algérie).",
        lbl_ref_rpa: "Règles Parasismiques Algériennes et vérifications structurales.",
        lbl_ref_aci: "Code de l'American Concrete Institute pour le calcul des structures.",
        
       // --- Traduction Espace Académique (RPA99 / CBA93) ---
        nav_wonders: "🎓 Espace Recherche Académique & PFE",
        wonders_title: "🎓 Espace Recherche Académique & PFE",
        wonders_sub: "Outils avancés pour l'analyse des structures et vérifications selon les codes algériens (RPA99 / CBA93).",
        tab_rpa: "📈 Spectre de Réponse (RPA99)",
        tab_cba: "📐 Flambement des Poteaux (CBA93)",
        lbl_rpa_zone1: "Zone Sismique :",
        lbl_rpa_soil: "Catégorie du Site (Sol) :",
        lbl_rpa_r: "Coefficient de comportement (R) :",
        lbl_rpa_q: "Facteur de qualité (Q) :",
        h_cba_dim: "Dimensions & Longueurs du Poteau",
        lbl_cba_b: "Largeur du poteau b (m) :",
        lbl_cba_h: "Hauteur du poteau h (m) :",
        lbl_cba_lo: "Longueur libre L0 (m) :",
        h_cba_cond: "Conditions de Liaison & Stabilité",
        lbl_cba_type: "Type d'articulation (Fixation) :",
        res_cba_lf: "Longueur flambement Lf :",
        res_cba_lambda: "Élancement mécanique (λ) :",
        res_cba_alpha: "Coefficient de réduction (α) :",
        // أضف هذه الأسطر في نهاية قسم الـ fr
        opt_zone1: "Zone 1 (Sismicité faible)",
        opt_zone2: "Zone 2 (Sismicité moyenne)",
        opt_zone3: "Zone 3 (Sismicité moyenne-élevée)",
        opt_zone4: "Zone 4 (Sismicité élevée)",
        opt_site1: "S1 (Rocher sain) T2=0.3s",
        opt_site2: "S2 (Ferme) T2=0.4s",
        opt_site3: "S3 (Meuble) T2=0.5s",
        opt_site4: "S4 (Très meuble) T2=0.7s",
        opt_fix1: "Articulé aux deux extrémités rigides (lf = 0.7 L0)",
        opt_fix2: "Poteau d'un étage bâtiment type (lf = 1.0 L0)",
        opt_fix3: "Console libre en tête - Encastré en pied (lf = 2.0 L0)",
        nav_autocad: "📐 Détails & Échelles AutoCAD",
        cad_title: "Plans & Détails Structuraux (AutoCAD) 📐",
        cad_sub: "Bibliothèque interactive pour le téléchargement des détails de ferraillage DWG et convertisseur d'échelles.",
        h_cad_calc: "🔄 Convertisseur d'Échelles (AutoCAD to Reality)",
        lbl_cad_scale: "Choisir l'échelle du plan :",
        lbl_cad_measured: "Distance mesurée sur le plan imprimé (cm) :",
        res_cad_real: "Distance réelle sur le chantier (Réalité) :",
        h_cad_lib: "📂 Bibliothèque des Détails Typiques de Ferraillage (PFE)",
        card_cad_poteau: "Détails de ferraillage des poteaux",
        card_cad_poutre: "Détails de ferraillage des poutres",
        card_cad_semelle: "Détails des fondations (Semelles)",
        card_cad_escalier: "Ferraillage des escaliers",
        h_sec_title: "📐 Caractéristiques Mécaniques des Sections",
        p_sec_sub: "Calcul de l'aire, du moment d'inertie (Ix/Iy) et du rayon de giration pour les sections géométriques.",
        lbl_sec_shape: "Choisir la forme de la section :",
        lbl_sec_b: "Largeur b (m) :",
        lbl_sec_h: "Hauteur h (m) :",
        lbl_sec_d: "Diamètre extérieur D (m) :",
        res_sec_area: "Aire de la section (A) :",
        res_sec_ix: "Moment d'inertie / X (Ix) :",
        res_sec_iy: "Moment d'inertie / Y (Iy) :",
        res_sec_ix_rad: "Rayon de giration (ix) :",
        res_sec_iy_rad: "Rayon de giration (iy) :",
        opt_appa1: "Rectangle",
        opt_appa2: "Cercle",
        opt_appa3: "Box Section",
        opt_appa4: "Pipe Section",
        opt_appa5: "Triangle",
        lbl_box_B: "Largeur extérieure B (m) :",
        lbl_box_H: "Hauteur extérieure H (m) :",
        lbl_box_b_in: "Largeur intérieure b (m) :",
        lbl_box_h_in: "Hauteur intérieure h (m) :",
        lbl_pipe_D: "Diamètre extérieur D (m) :",
        lbl_pipe_d_in: "Diamètre intérieur d (m) :",
        lbl_tri_b: "Base du triangle b (m) :",
        lbl_tri_h: "Hauteur du triangle h (m) :",
        opt_ech1: "1/50 (1cm sur plan = 0.5m en réalité)",
        opt_ech2: "1/100 (1cm sur plan = 1.0m en réalité)",
        opt_ech3: "1/20 (1cm sur plan = 0.2m en réalité)",
        opt_ech4: "1/25 (1cm sur plan = 0.25m en réalité)",
        opt_ech5: "1/200 (1cm sur plan = 2.0m en réalité)",
        h_devis_title: "💰 Calcul du Coût des Matériaux & Devis Estimatif (Algérie)",
        p_devis_sub: "Calcul du coût total estimatif des matériaux et de la main d'œuvre en dinar algérien (DZD).",
        h_market_prices: "🛒 Prix du Marché Actuel (Modifiables) :",
        lbl_pr_cement: "Prix d'un sac de Ciment 50kg (DZD) :",
        lbl_pr_steel: "Prix du quintal de Fer (100kg) (DZD) :",
        lbl_pr_gravel: "Prix du m³ de Gravier (DZD) :",
        lbl_pr_sand: "Prix du m³ de Sable (DZD) :",
        lbl_pr_labor: "Main d'œuvre (Maçon) par 1m³ de béton (DZD) :",
        h_devis_res: "📊 Résultats du Devis Estimatif :",
        res_cost_cement: "Coût Total du Ciment :",
        res_cost_steel: "Coût Total du Fer (Acier) :",
        res_cost_aggregates: "Coût Sable + Gravier :",
        res_cost_labor: "Coût de la Main d'œuvre :",
        res_total_cost: "Montant Total Estimatif (Total HT) :",
        
    }
};

let currentLang = 'ar';
document.getElementById('langBtn').addEventListener('click', function() {
    currentLang = currentLang === 'ar' ? 'fr' : 'ar';
    this.textContent = currentLang === 'ar' ? 'FR' : 'AR';
    updateLanguage();
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
});

function updateLanguage() {
    const t = translations[currentLang];
    for (let key in t) {
        const el = document.getElementById(key);
        if (el) el.textContent = t[key];
    }

    // صمام أمان لترجمة خيارات مقياس الرسم دون التسبب في توقف الموقع
    const optEch1 = document.getElementById('opt_ech1');
    if (optEch1 && typeof translations[currentLang] !== 'undefined') {
        document.getElementById('opt_ech1').textContent = translations[currentLang].opt_ech1;
        document.getElementById('opt_ech2').textContent = translations[currentLang].opt_ech2;
        document.getElementById('opt_ech3').textContent = translations[currentLang].opt_ech3;
        document.getElementById('opt_ech4').textContent = translations[currentLang].opt_ech4;
        document.getElementById('opt_ech5').textContent = translations[currentLang].opt_ech5;
    }
    
    document.querySelector('#beamType option[value="simple"]').textContent = currentLang === 'ar' ? 'بسيطة الاستناد (Simply Supported)' : 'Appui simple';
    document.querySelector('#beamType option[value="cantilever"]').textContent = currentLang === 'ar' ? 'ظفر / كابولي (Cantilever)' : 'Console (Cantilever)';
    document.querySelector('#designCode option[value="aci"]').textContent = currentLang === 'ar' ? 'ACI 318-19 (الأمريكي)' : 'ACI 318-19 (US)';
    document.querySelector('#designCode option[value="ec2"]').textContent = currentLang === 'ar' ? 'Eurocode 2 (الأوروبي)' : 'Eurocode 2 (EU)';
    document.querySelector('#designCode option[value="cba93"]').textContent = currentLang === 'ar' ? 'CBA 93 (الجزائري الرسمي)' : 'CBA 93 (Code Algérien)';
    
    document.querySelector('#rpaZone option[value="zone0"]').textContent = currentLang === 'ar' ? 'المنطقة 0: نشاط زلزالي ضئيل جداً' : 'Zone 0: Sismicité négligeable';
    document.querySelector('#rpaZone option[value="zone1"]').textContent = currentLang === 'ar' ? 'المنطقة I: نشاط زلزالي ضعيف' : 'Zone I: Sismicité faible';
    document.querySelector('#rpaZone option[value="zone2a"]').textContent = currentLang === 'ar' ? 'المنطقة IIa: نشاط زلزالي متوسط' : 'Zone IIa: Sismicité moyenne';
    document.querySelector('#rpaZone option[value="zone2b"]').textContent = currentLang === 'ar' ? 'المنطقة IIb: نشاط زلزالي متوسط مرتفع' : 'Zone IIb: Sismicité moyenne-élevée';
    document.querySelector('#rpaZone option[value="zone3"]').textContent = currentLang === 'ar' ? 'المنطقة III: نشاط زلزالي مرتفع' : 'Zone III: Sismicité élevée';

    document.querySelector('#slabType option[value="solid"]').textContent = currentLang === 'ar' ? 'بلاطة مصمتة مليئة (Dalle Pleine)' : 'Dalle Pleine';
    document.querySelector('#slabType option[value="hourdi"]').textContent = currentLang === 'ar' ? 'سقف هوردي ذو عناصر مجوفة (Corps Creux)' : 'Corps Creux (16+4)';
    
    document.querySelectorAll('#mat_dosage option').forEach(opt => {
        if(opt.value === "350") opt.textContent = currentLang === 'ar' ? '350 كجم/م³ (العناصر الإنشائية الحاملة الأساسية للبناية)' : '350 kg/m³ (Éléments porteurs principaux)';
        if(opt.value === "400") opt.textContent = currentLang === 'ar' ? '400 كجم/م³ (الخرسانة الكثيفة المسلحة عالية الأداء)' : '400 kg/m³ (Béton haute performance)';
        if(opt.value === "150") opt.textContent = currentLang === 'ar' ? '150 كجم/م³ (خرسانة النظافة الأرضية Gros Béton)' : '150 kg/m³ (Gros béton / Propreté)';
        
    });
}

window.addEventListener('DOMContentLoaded', () => {
    convertAllUnits();
    const rpaGroup = document.getElementById('rpaZone').closest('.input-group') || document.getElementById('rpaZone').parentElement;
    if (rpaGroup) rpaGroup.style.display = 'none';
});
