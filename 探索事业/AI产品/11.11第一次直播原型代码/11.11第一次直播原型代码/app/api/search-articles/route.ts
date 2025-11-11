import { NextRequest, NextResponse } from 'next/server'

// API密钥 - 实际项目中应该使用环境变量
const API_KEY = 'JZLe3d56a0afc0f2380'
const API_BASE_URL = 'https://www.dajiala.com/fbmain/monitor/v3/kw_search'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求参数
    if (!body.kw || typeof body.kw !== 'string') {
      return NextResponse.json(
        { error: '关键词参数缺失或无效' },
        { status: 400 }
      )
    }

    // 构建API请求参数
    const requestData = {
      kw: body.kw.trim(),
      sort_type: body.sort_type || 1,    // 默认最新排序
      mode: body.mode || 1,             // 默认精确匹配
      period: body.period || 7,         // 默认7天内
      page: body.page || 1,             // 默认第一页
      key: API_KEY,
      any_kw: body.any_kw || '',
      ex_kw: body.ex_kw || '',
      verifycode: body.verifycode || '',
      type: body.type || 1,             // 默认文章类型
    }

    console.log('正在调用API:', API_BASE_URL)
    console.log('请求参数:', { ...requestData, key: '***' })

    // 调用第三方API
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      console.error('API请求失败:', response.status, response.statusText)
      return NextResponse.json(
        { error: `API请求失败: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('API响应:', {
      code: data.code,
      msg: data.msg,
      dataCount: data.data?.length || 0,
      total: data.total,
      sampleData: data.data?.slice(0, 2).map((item: any) => ({
        title: item.title,
        reads: item.read,
        likes: item.praise,
        wx_name: item.wx_name
      }))
    })

    // 检查API响应状态
    if (data.code !== 0) {
      console.error('API返回错误:', data.msg)
      return NextResponse.json(
        { error: `API错误: ${data.msg || '未知错误'}` },
        { status: 400 }
      )
    }

    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: data,
      message: `成功获取 ${data.data?.length || 0} 篇文章`
    })

  } catch (error) {
    console.error('搜索文章时发生错误:', error)

    return NextResponse.json(
      {
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}