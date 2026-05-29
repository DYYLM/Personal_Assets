import { useState, useEffect, useRef, useCallback } from 'react';

// 自定义Hook：获取当前日期并每日自动更新
export function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateDate = useCallback(() => {
    setCurrentDate(new Date());
    
    // 计算到下一天0点的时间
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const timeout = tomorrow.getTime() - now.getTime();
    
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 设置下一次更新
    timeoutRef.current = setTimeout(updateDate, timeout);
  }, []);

  useEffect(() => {
    updateDate(); // 立即执行一次并设置下一次更新
    
    // 清理函数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateDate]);

  return currentDate;
}

// 计算两个日期之间的月数
export function calculateMonthsBetween(startDate: string | Date, endDate: Date): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const years = endDate.getFullYear() - start.getFullYear();
  const months = endDate.getMonth() - start.getMonth();
  return Math.max(0, years * 12 + months);
}
