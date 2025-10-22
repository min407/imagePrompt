// 学习进度跟踪
let completedDays = new Set();

// 更新进度显示 - 简化为文字显示，添加鼓励文字
function updateProgress() {
    const progressText = document.getElementById('progress-text');
    const encouragementText = document.getElementById('encouragement-text');
    const progressContainer = document.querySelector('.progress-bar');
    
    // 直接显示完成天数，移除百分比
    if (progressText) {
        progressText.textContent = `已学习: ${completedDays.size}/7 天`;
    }
    
    // 添加鼓励文字
    if (encouragementText) {
        const messages = {
            0: "💪 开始你的AI学习之旅！",
            1: "🎉 很好的开始！继续加油！",
            2: "🚀 进步很快！你掌握了基础！",
            3: "⭐ 过半了！你已经入门了！",
            4: "🔥 太棒了！即将完成学习！",
            5: "🌟 就差一点！冲刺阶段！",
            6: "🎯 最后一关！坚持就是胜利！",
            7: "🏆 恭喜毕业！你已经成为AI开发者！"
        };
        
        const daysCompleted = completedDays.size;
        encouragementText.textContent = messages[daysCompleted] || "🎉 继续学习，成为AI专家！";
    }
    
    // 隐藏进度条容器
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
}

// 代码执行功能已移除，请在本地IDE（VS Code/PyCharm）中运行代码

// 显示/隐藏答案解析 - 统一版本
function toggleAnswer(answerId) {
    const answerDiv = document.getElementById(answerId);
    if (!answerDiv) {
        console.error('找不到答案元素:', answerId);
        return;
    }
    
    // 获取触发按钮
    let button;
    if (event && event.target) {
        button = event.target;
    } else {
        // 如果没有事件对象，通过相关元素查找按钮
        const container = answerDiv.previousElementSibling || answerDiv.parentElement;
        button = container.querySelector('button[onclick*="toggleAnswer"]');
    }
    
    if (!button) {
        console.error('找不到触发按钮');
        return;
    }
    
    const isVisible = answerDiv.style.display === 'block';
    
    if (isVisible) {
        // 隐藏答案
        answerDiv.style.display = 'none';
        button.textContent = '显示答案';
        button.style.background = '#667eea';
        button.style.color = 'white';
    } else {
        // 显示答案
        answerDiv.style.display = 'block';
        button.textContent = '隐藏答案';
        button.style.background = '#48bb78';
        button.style.color = 'white';
    }
}

// 检查练习答案 - 统一版本
function checkPracticeAnswer(topicId) {
    // 兼容两种ID格式
    const answerInput = document.getElementById(topicId + '-answer') || document.getElementById(`${topicId}-answer`);
    const feedbackDiv = document.getElementById(topicId + '-feedback') || document.getElementById(`${topicId}-feedback`);
    
    if (!answerInput) {
        console.error('找不到答案输入框:', topicId);
        return;
    }
    
    if (!feedbackDiv) {
        console.error('找不到反馈元素:', topicId);
        return;
    }
    
    const userAnswer = answerInput.value.trim();
    
    if (!userAnswer) {
        feedbackDiv.innerHTML = '<span style="color: #f56565; font-size: 16px;">⚠️ 请先填写你的答案</span>';
        return;
    }
    
    // 简单的答案验证和反馈
    feedbackDiv.innerHTML = '<span style="color: #48bb78; font-size: 16px;">✅ 答案已记录！点击"显示答案"查看参考答案</span>';
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化代码高亮
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    // 为所有textarea添加Tab键支持
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                // 插入4个空格代替Tab
                this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 4;
            }
        });
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 创建返回顶部按钮
    createScrollTopButton();
    
    // 初始化每日学习状态
    initializeDayProgress();
    
    // 添加代码示例的复制功能
    addCopyButtons();
});

// 创建返回顶部按钮
function createScrollTopButton() {
    const scrollTopButton = document.createElement('a');
    scrollTopButton.href = '#';
    scrollTopButton.className = 'scroll-top';
    scrollTopButton.innerHTML = '↑';
    scrollTopButton.setAttribute('aria-label', '返回顶部');
    
    document.body.appendChild(scrollTopButton);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopButton.classList.add('show');
        } else {
            scrollTopButton.classList.remove('show');
        }
    });
    
    // 点击返回顶部
    scrollTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化每日学习进度
function initializeDayProgress() {
    // 检查本地存储的进度
    const savedProgress = localStorage.getItem('pythonLearningProgress');
    if (savedProgress) {
        completedDays = new Set(JSON.parse(savedProgress));
        updateProgress();
    }
    
    // 保存进度到本地存储
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('pythonLearningProgress', JSON.stringify([...completedDays]));
    });
}

// 添加代码复制功能
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '📋 复制代码';
        button.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: #667eea;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            z-index: 10;
        `;
        
        // 为代码容器添加相对定位
        const pre = codeBlock.parentElement;
        pre.style.position = 'relative';
        
        button.addEventListener('click', function() {
            const text = codeBlock.textContent;
            
            // 使用现代API复制到剪贴板
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    showCopySuccess(button);
                }).catch(() => {
                    fallbackCopyTextToClipboard(text, button);
                });
            } else {
                fallbackCopyTextToClipboard(text, button);
            }
        });
        
        pre.appendChild(button);
    });
}

// 显示复制成功提示
function showCopySuccess(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '✅ 已复制';
    button.style.background = '#48bb78';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '#667eea';
    }, 2000);
}

// 兼容性复制方法
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        console.error('复制失败:', err);
    }
    
    document.body.removeChild(textArea);
}

// 实时代码提示（可选功能）
function setupCodeHints() {
    const pythonKeywords = [
        'def', 'class', 'if', 'else', 'elif', 'for', 'while', 
        'import', 'from', 'return', 'print', 'len', 'range', 'list',
        'dict', 'str', 'int', 'float', 'bool', 'try', 'except'
    ];
    
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function(e) {
            const value = e.target.value;
            const lastWord = value.split(' ').pop();
            
            // 检查是否匹配Python关键字
            if (pythonKeywords.includes(lastWord)) {
                // 这里可以添加自动完成或提示功能
                console.log(`检测到Python关键字: ${lastWord}`);
            }
        });
    });
}

// 学习统计功能
function updateLearningStats() {
    const stats = {
        totalExercises: document.querySelectorAll('.exercise').length,
        completedExercises: completedDays.size,
        startTime: localStorage.getItem('learningStartTime'),
        currentStreak: calculateStreak()
    };
    
    // 如果是第一次访问，记录开始时间
    if (!stats.startTime) {
        localStorage.setItem('learningStartTime', new Date().toISOString());
    }
    
    return stats;
}

// 计算连续学习天数
function calculateStreak() {
    const lastVisit = localStorage.getItem('lastVisitDate');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
        localStorage.setItem('lastVisitDate', today);
        return 1;
    }
    
    const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
    localStorage.setItem('currentStreak', currentStreak + 1);
    return currentStreak + 1;
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S 保存进度
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        localStorage.setItem('pythonLearningProgress', JSON.stringify([...completedDays]));
        showNotification('学习进度已保存！');
    }
    
    // 提示用户在本地IDE运行代码
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.tagName === 'TEXTAREA' && focusedElement.id.includes('exercise')) {
            e.preventDefault();
            showNotification('💻 请在本地IDE（VS Code/PyCharm）中运行代码');
        }
    }
});

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        notification.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// 主题切换功能（可选）
function toggleTheme() {
    const body = document.body;
    const isDark = body.style.background.includes('linear-gradient');
    
    if (isDark) {
        body.style.background = '#f8f9fa';
    } else {
        body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

// 添加学习提示
function showLearningTips() {
    const tips = [
        '💡 记得多练习，编程是最好的学习方式！',
        '🤝 遇到问题时，试着向AI助手提问',
        '📚 建议每天坚持学习，保持连续性',
        '🔧 实践项目是检验学习成果的最佳方式',
        '🚀 学完7天，你就能开发AI应用了！'
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    console.log(randomTip);
}

// 每30秒显示一个学习提示
setInterval(showLearningTips, 30000);