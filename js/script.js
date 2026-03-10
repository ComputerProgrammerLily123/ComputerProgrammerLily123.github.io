// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.getElementById('sliderContainer');
    const cards = document.querySelectorAll('.card');
    const dotsContainer = document.getElementById('dots');
    
    console.log('卡片数量:', cards.length);
    
    if (cards.length > 0 && sliderContainer && dotsContainer) {
        dotsContainer.innerHTML = '';
        
        // 创建点
        cards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                const cardWidth = sliderContainer.clientWidth;
                sliderContainer.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                });
                resetAutoSlide();
            });
            
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');
        
        // 自动滑动变量
        let autoSlideInterval;
        const slideIntervalTime = 2000;
        
        // 开始自动滑动
        function startAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                goToNextSlide();
            }, slideIntervalTime);
        }
        
        // 重置自动滑动
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        // 切换到下一张 - 修复版本
        function goToNextSlide() {
            const scrollLeft = sliderContainer.scrollLeft;
            const cardWidth = sliderContainer.clientWidth;
            
            // 计算当前在第几张（四舍五入）
            const currentIndex = Math.round(scrollLeft / cardWidth);
            
            // 计算下一张的索引
            let nextIndex = currentIndex + 1;
            
            // 如果到了最后一张，回到第一张
            if (nextIndex >= cards.length) {
                nextIndex = 0;
            }
            
            console.log('当前索引:', currentIndex, '下一张:', nextIndex);
            
            // 滚动到下一张
            sliderContainer.scrollTo({
                left: nextIndex * cardWidth,
                behavior: 'smooth'
            });
        }
        
        // 切换到上一张
        function goToPrevSlide() {
            const scrollLeft = sliderContainer.scrollLeft;
            const cardWidth = sliderContainer.clientWidth;
            
            // 计算当前在第几张
            const currentIndex = Math.round(scrollLeft / cardWidth);
            
            // 计算上一张的索引
            let prevIndex = currentIndex - 1;
            
            // 如果到了第一张，跳到最后一张
            if (prevIndex < 0) {
                prevIndex = cards.length - 1;
            }
            
            console.log('当前索引:', currentIndex, '上一张:', prevIndex);
            
            sliderContainer.scrollTo({
                left: prevIndex * cardWidth,
                behavior: 'smooth'
            });
        }
        
        // 监听滚动更新点状态
        sliderContainer.addEventListener('scroll', () => {
            const scrollLeft = sliderContainer.scrollLeft;
            const cardWidth = sliderContainer.clientWidth;
            
            // 使用四舍五入计算当前索引
            const activeIndex = Math.round(scrollLeft / cardWidth);
            
            // 确保索引在有效范围内
            if (activeIndex >= 0 && activeIndex < cards.length) {
                dots.forEach((dot, index) => {
                    if (index === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        });
        
        // 用户手动滑动时重置定时器
        sliderContainer.addEventListener('scroll', () => {
            resetAutoSlide();
        });
        
        // 触摸事件
        sliderContainer.addEventListener('touchstart', () => {
            clearInterval(autoSlideInterval);
        });
        
        sliderContainer.addEventListener('touchend', () => {
            const scrollLeft = sliderContainer.scrollLeft;
            const cardWidth = sliderContainer.clientWidth;
            const targetIndex = Math.round(scrollLeft / cardWidth);
            
            sliderContainer.scrollTo({
                left: targetIndex * cardWidth,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                startAutoSlide();
            }, 500);
        });
        
        // 鼠标悬停
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
        
        // 开始自动滑动
        startAutoSlide();
        
        // 窗口大小改变时重新计算
        window.addEventListener('resize', () => {
            const scrollLeft = sliderContainer.scrollLeft;
            const cardWidth = sliderContainer.clientWidth;
            const activeIndex = Math.round(scrollLeft / cardWidth);
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
            
            resetAutoSlide();
        });
        
        console.log('自动滑动初始化完成');
    } else {
        console.log('没有找到必要的元素');
    }
});