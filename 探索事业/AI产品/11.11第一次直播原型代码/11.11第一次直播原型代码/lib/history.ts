import { SearchHistory } from '@/types/history'

const HISTORY_KEY = 'search_history'

/**
 * 获取搜索历史记录
 * @returns 搜索历史记录列表
 */
export function getSearchHistory(): SearchHistory[] {
  if (typeof window === 'undefined') return []

  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('获取搜索历史失败:', error)
    return []
  }
}

/**
 * 保存搜索历史记录
 * @param data 分析结果数据
 * @param keyword 搜索关键词
 * @param articleCount 文章数量
 * @param totalFound 总找到数量
 */
export function saveSearchHistory(
  data: any,
  keyword: string,
  articleCount: number,
  totalFound: number
): void {
  if (typeof window === 'undefined') return

  try {
    const history: SearchHistory = {
      id: Date.now().toString(),
      keyword,
      articleCount,
      totalFound,
      searchTime: Date.now(),
      searchTimeStr: new Date().toLocaleString('zh-CN'),
      stats: data.stats || {
        totalArticles: 0,
        avgReads: 0,
        avgLikes: 0,
        avgEngagement: '0%'
      },
      topLikesArticles: data.topLikesArticles || [],
      topEngagementArticles: data.topEngagementArticles || [],
      insights: data.insights || []
    }

    const existingHistory = getSearchHistory()
    const updatedHistory = [history, ...existingHistory].slice(0, 50) // 最多保存50条记录

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error('保存搜索历史失败:', error)
  }
}

/**
 * 删除搜索历史记录
 * @param id 记录ID
 */
export function deleteSearchHistory(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const history = getSearchHistory()
    const updatedHistory = history.filter(item => item.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error('删除搜索历史失败:', error)
  }
}

/**
 * 清空搜索历史记录
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error('清空搜索历史失败:', error)
  }
}