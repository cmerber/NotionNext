import { useEffect, useMemo, useRef, useState } from 'react'

const MODEL_SCRIPTS = [
  {
    id: 'qcode-tfjs',
    src: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js'
  },
  {
    id: 'qcode-mobilenet',
    src: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js'
  }
]

const FOODS = [
  {
    id: 'rice',
    name: '米饭',
    icon: '🍚',
    kcal: 116,
    grams: 150,
    unit: '碗',
    keys: ['米饭', '白饭', 'rice']
  },
  {
    id: 'porridge',
    name: '白粥',
    icon: '🥣',
    kcal: 46,
    grams: 250,
    unit: '碗',
    keys: ['白粥', '稀饭', '粥', 'porridge']
  },
  {
    id: 'noodles',
    name: '面条',
    icon: '🍜',
    kcal: 138,
    grams: 250,
    unit: '碗',
    keys: ['面条', '面', 'noodle']
  },
  {
    id: 'fried-rice',
    name: '炒饭',
    icon: '🍳',
    kcal: 188,
    grams: 250,
    unit: '份',
    keys: ['炒饭', 'fried rice']
  },
  {
    id: 'dumpling',
    name: '饺子',
    icon: '🥟',
    kcal: 230,
    grams: 200,
    unit: '份',
    keys: ['饺子', '水饺', 'dumpling']
  },
  {
    id: 'baozi',
    name: '包子',
    icon: '🥟',
    kcal: 227,
    grams: 100,
    unit: '个',
    keys: ['包子', '肉包', '菜包']
  },
  {
    id: 'mantou',
    name: '馒头',
    icon: '🍞',
    kcal: 223,
    grams: 100,
    unit: '个',
    keys: ['馒头']
  },
  {
    id: 'bread',
    name: '面包',
    icon: '🍞',
    kcal: 265,
    grams: 60,
    unit: '片',
    keys: ['面包', '吐司', 'bread', 'bagel', 'pretzel', 'french loaf']
  },
  {
    id: 'egg',
    name: '鸡蛋',
    icon: '🥚',
    kcal: 144,
    grams: 50,
    unit: '个',
    keys: ['鸡蛋', '煮蛋', '荷包蛋', 'egg']
  },
  {
    id: 'chicken',
    name: '鸡胸肉',
    icon: '🍗',
    kcal: 165,
    grams: 150,
    unit: '份',
    keys: ['鸡胸肉', '鸡肉', 'chicken']
  },
  {
    id: 'fried-chicken',
    name: '炸鸡',
    icon: '🍗',
    kcal: 279,
    grams: 150,
    unit: '份',
    keys: ['炸鸡', '鸡翅', 'fried chicken']
  },
  {
    id: 'beef',
    name: '牛肉',
    icon: '🥩',
    kcal: 250,
    grams: 150,
    unit: '份',
    keys: ['牛肉', '牛排', 'beef', 'steak']
  },
  {
    id: 'pork',
    name: '猪肉',
    icon: '🥩',
    kcal: 242,
    grams: 150,
    unit: '份',
    keys: ['猪肉', '红烧肉', '排骨', 'pork']
  },
  {
    id: 'fish',
    name: '鱼肉',
    icon: '🐟',
    kcal: 128,
    grams: 150,
    unit: '份',
    keys: ['鱼肉', '鱼', 'fish', 'salmon']
  },
  {
    id: 'shrimp',
    name: '虾',
    icon: '🦐',
    kcal: 99,
    grams: 120,
    unit: '份',
    keys: ['虾仁', '虾', 'shrimp', 'prawn']
  },
  {
    id: 'tofu',
    name: '豆腐',
    icon: '⬜',
    kcal: 84,
    grams: 150,
    unit: '份',
    keys: ['豆腐', 'tofu']
  },
  {
    id: 'vegetable',
    name: '绿叶蔬菜',
    icon: '🥬',
    kcal: 25,
    grams: 200,
    unit: '份',
    keys: [
      '青菜',
      '蔬菜',
      '生菜',
      '白菜',
      '菠菜',
      'vegetable',
      'lettuce',
      'cabbage'
    ]
  },
  {
    id: 'broccoli',
    name: '西兰花',
    icon: '🥦',
    kcal: 34,
    grams: 150,
    unit: '份',
    keys: ['西兰花', 'broccoli', 'cauliflower']
  },
  {
    id: 'corn',
    name: '玉米',
    icon: '🌽',
    kcal: 112,
    grams: 150,
    unit: '根',
    keys: ['玉米', 'corn']
  },
  {
    id: 'potato',
    name: '土豆',
    icon: '🥔',
    kcal: 77,
    grams: 150,
    unit: '个',
    keys: ['土豆', '马铃薯', 'potato', 'mashed potato']
  },
  {
    id: 'sweet-potato',
    name: '红薯',
    icon: '🍠',
    kcal: 86,
    grams: 180,
    unit: '个',
    keys: ['红薯', '地瓜', 'sweet potato']
  },
  {
    id: 'tomato',
    name: '番茄',
    icon: '🍅',
    kcal: 18,
    grams: 150,
    unit: '个',
    keys: ['番茄', '西红柿', 'tomato']
  },
  {
    id: 'apple',
    name: '苹果',
    icon: '🍎',
    kcal: 52,
    grams: 180,
    unit: '个',
    keys: ['苹果', 'apple', 'granny smith']
  },
  {
    id: 'banana',
    name: '香蕉',
    icon: '🍌',
    kcal: 89,
    grams: 120,
    unit: '根',
    keys: ['香蕉', 'banana']
  },
  {
    id: 'orange',
    name: '橙子',
    icon: '🍊',
    kcal: 47,
    grams: 180,
    unit: '个',
    keys: ['橙子', '橘子', '柑橘', 'orange']
  },
  {
    id: 'strawberry',
    name: '草莓',
    icon: '🍓',
    kcal: 32,
    grams: 150,
    unit: '份',
    keys: ['草莓', 'strawberry']
  },
  {
    id: 'milk',
    name: '牛奶',
    icon: '🥛',
    kcal: 61,
    grams: 250,
    unit: '杯',
    keys: ['牛奶', 'milk']
  },
  {
    id: 'yogurt',
    name: '酸奶',
    icon: '🥛',
    kcal: 72,
    grams: 200,
    unit: '杯',
    keys: ['酸奶', 'yogurt']
  },
  {
    id: 'coffee',
    name: '黑咖啡',
    icon: '☕',
    kcal: 2,
    grams: 250,
    unit: '杯',
    keys: ['黑咖啡', '美式', 'coffee']
  },
  {
    id: 'milk-tea',
    name: '奶茶',
    icon: '🧋',
    kcal: 90,
    grams: 500,
    unit: '杯',
    keys: ['奶茶', 'milk tea']
  },
  {
    id: 'cola',
    name: '含糖可乐',
    icon: '🥤',
    kcal: 43,
    grams: 330,
    unit: '罐',
    keys: ['可乐', '汽水', 'cola', 'soda']
  },
  {
    id: 'pizza',
    name: '披萨',
    icon: '🍕',
    kcal: 266,
    grams: 120,
    unit: '片',
    keys: ['披萨', 'pizza']
  },
  {
    id: 'burger',
    name: '汉堡',
    icon: '🍔',
    kcal: 255,
    grams: 180,
    unit: '个',
    keys: ['汉堡', 'burger', 'cheeseburger']
  },
  {
    id: 'hotdog',
    name: '热狗',
    icon: '🌭',
    kcal: 290,
    grams: 120,
    unit: '个',
    keys: ['热狗', 'hotdog', 'hot dog']
  },
  {
    id: 'fries',
    name: '薯条',
    icon: '🍟',
    kcal: 312,
    grams: 120,
    unit: '份',
    keys: ['薯条', 'fries', 'french fries']
  },
  {
    id: 'icecream',
    name: '冰淇淋',
    icon: '🍨',
    kcal: 207,
    grams: 100,
    unit: '份',
    keys: ['冰淇淋', '雪糕', 'ice cream', 'ice lolly']
  },
  {
    id: 'cake',
    name: '蛋糕',
    icon: '🍰',
    kcal: 347,
    grams: 100,
    unit: '块',
    keys: ['蛋糕', 'cake', 'trifle']
  }
]

const CHINESE_NUMBERS = {
  半: 0.5,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10
}

const numberValue = value => CHINESE_NUMBERS[value] || Number(value) || 1

function loadScript({ id, src }) {
  if (document.getElementById(id)) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('识别组件加载失败'))
    document.head.appendChild(script)
  })
}

async function loadImageModel() {
  for (const script of MODEL_SCRIPTS) await loadScript(script)
  if (!window.tf || !window.mobilenet) throw new Error('识别组件加载失败')
  await window.tf.ready()
  if (!window.__qcodeFoodModel) {
    window.__qcodeFoodModel = await window.mobilenet.load({
      version: 2,
      alpha: 0.5
    })
  }
  return window.__qcodeFoodModel
}

function findFood(id) {
  return FOODS.find(food => food.id === id)
}

function rowFromFood(food, grams = food.grams, source = '手动添加') {
  return {
    key: `${food.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    foodId: food.id,
    grams: Math.max(1, Math.round(grams)),
    source
  }
}

function parseDescription(text) {
  const lowered = text.toLowerCase()
  const matches = []
  const claimed = []

  FOODS.forEach(food => {
    const matchedKey = [...food.keys]
      .sort((a, b) => b.length - a.length)
      .find(key => {
        const index = lowered.indexOf(key.toLowerCase())
        if (index < 0) return false
        const end = index + key.length
        if (claimed.some(range => index < range.end && end > range.start))
          return false
        claimed.push({ start: index, end })
        return true
      })
    if (!matchedKey) return

    const index = lowered.indexOf(matchedKey.toLowerCase())
    const before = text.slice(Math.max(0, index - 12), index)
    const amountMatch = before.match(
      /(\d+(?:\.\d+)?|半|一|二|两|三|四|五|六|七|八|九|十)\s*(克|g|千克|公斤|kg|毫升|ml|碗|个|只|份|杯|片|根|串|块|罐)?\s*$/i
    )
    let grams = food.grams
    if (amountMatch) {
      const amount = numberValue(amountMatch[1])
      const unit = (amountMatch[2] || food.unit).toLowerCase()
      if (unit === '克' || unit === 'g' || unit === '毫升' || unit === 'ml') {
        grams = amount
      } else if (unit === '千克' || unit === '公斤' || unit === 'kg') {
        grams = amount * 1000
      } else {
        grams = amount * food.grams
      }
    }
    matches.push(rowFromFood(food, grams, '文字识别'))
  })

  return matches
}

function matchPredictions(predictions) {
  const results = []
  predictions.forEach(prediction => {
    const name = prediction.className.toLowerCase()
    const food = FOODS.find(item =>
      item.keys.some(key => name.includes(key.toLowerCase()))
    )
    if (food && !results.some(result => result.food.id === food.id)) {
      results.push({ food, probability: prediction.probability })
    }
  })
  return results.slice(0, 3)
}

function SmallButton({ children, onClick, disabled, primary = false }) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[42px] rounded-xl px-4 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40 ${primary ? 'bg-[var(--heo-color-primary)] text-white shadow-sm hover:-translate-y-0.5' : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'}`}
    >
      {children}
    </button>
  )
}

export default function CalorieTool() {
  const uploadRef = useRef(null)
  const cameraRef = useRef(null)
  const imageRef = useRef(null)
  const [mode, setMode] = useState('photo')
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([])
  const [selectedFood, setSelectedFood] = useState('rice')
  const [message, setMessage] = useState('')
  const [recognizing, setRecognizing] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  useEffect(
    () => () => {
      if (image?.url) URL.revokeObjectURL(image.url)
    },
    [image]
  )

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const food = findFood(item.foodId)
        return sum + (food ? Math.round((food.kcal * item.grams) / 100) : 0)
      }, 0),
    [items]
  )

  const selectImage = file => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage('请选择 JPG、PNG、WebP 等图片文件。')
      return
    }
    if (image?.url) URL.revokeObjectURL(image.url)
    setImage({ file, url: URL.createObjectURL(file) })
    setSuggestions([])
    setMessage('图片已准备好，点击“识别主要食物”。')
  }

  const recognize = async () => {
    if (!imageRef.current || !image) return
    setRecognizing(true)
    setMessage('首次使用需要加载识别模型，请稍候……')
    try {
      const model = await loadImageModel()
      const predictions = await model.classify(imageRef.current, 12)
      const nextSuggestions = matchPredictions(predictions)
      setSuggestions(nextSuggestions)
      if (nextSuggestions.length) {
        const best = nextSuggestions[0]
        setItems(current => [
          ...current,
          rowFromFood(best.food, best.food.grams, '图片识别')
        ])
        setMessage(
          `识别为“${best.food.name}”，已按 1 ${best.food.unit}估算；请核对食物并调整克数。`
        )
      } else {
        setMessage(
          '没有可靠识别到常见食物。可以换一张主体更清楚的照片，或从下方手动添加。'
        )
      }
    } catch {
      setMessage(
        '图片识别组件加载失败，请检查网络后重试；文字估算仍可正常使用。'
      )
    } finally {
      setRecognizing(false)
    }
  }

  const analyzeText = () => {
    const parsed = parseDescription(description)
    if (!parsed.length) {
      setMessage('暂未识别到常见食物，请换一种说法，或从食物列表手动添加。')
      return
    }
    setItems(current => [...current, ...parsed])
    setMessage(`识别到 ${parsed.length} 种食物，已加入本餐清单。`)
  }

  const addFood = (foodId, source = '手动添加') => {
    const food = findFood(foodId)
    if (!food) return
    setItems(current => [...current, rowFromFood(food, food.grams, source)])
  }

  const updateGrams = (key, value) => {
    const grams = Math.max(1, Math.min(5000, Number(value) || 1))
    setItems(current =>
      current.map(item => (item.key === key ? { ...item, grams } : item))
    )
  }

  return (
    <section className='relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] md:p-7'>
      <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-lime-400 to-orange-400' />
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <div className='text-xs font-black tracking-[0.2em] text-emerald-600 dark:text-emerald-400'>
            LOCAL FOOD LAB
          </div>
          <h2 className='mt-2 text-2xl font-black text-gray-900 dark:text-white'>
            🍽️ 饮食热量估算器
          </h2>
          <p className='mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400'>
            拍照、上传图片或描述吃了什么，快速估算这一餐的热量。
          </p>
        </div>
        <span className='w-fit rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'>
          照片本地识别
        </span>
      </div>

      <div className='mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-900'>
        {[
          ['photo', '📷 拍照 / 图片'],
          ['text', '✍️ 描述这一餐']
        ].map(([id, label]) => (
          <button
            key={id}
            type='button'
            onClick={() => setMode(id)}
            aria-pressed={mode === id}
            className={`min-h-[44px] rounded-xl px-3 text-sm font-black transition ${mode === id ? 'bg-white text-emerald-700 shadow-sm dark:bg-gray-700 dark:text-emerald-300' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className='mt-5'>
        {mode === 'photo' ? (
          <div className='grid gap-5 lg:grid-cols-[1.15fr_0.85fr]'>
            <div className='overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900'>
              {image ? (
                <img
                  ref={imageRef}
                  src={image.url}
                  alt='待识别的食物'
                  className='h-72 w-full object-contain'
                />
              ) : (
                <button
                  type='button'
                  onClick={() => uploadRef.current?.click()}
                  className='flex h-72 w-full flex-col items-center justify-center p-6 text-center'
                >
                  <span className='text-5xl'>🥗</span>
                  <span className='mt-3 font-black text-gray-700 dark:text-gray-200'>
                    选择一张食物照片
                  </span>
                  <span className='mt-1 text-sm text-gray-400'>
                    主体清楚、光线充足时更容易识别
                  </span>
                </button>
              )}
            </div>
            <div className='rounded-2xl bg-gray-50 p-4 dark:bg-gray-900'>
              <input
                ref={uploadRef}
                type='file'
                accept='image/*'
                onChange={event => {
                  selectImage(event.target.files?.[0])
                  event.target.value = ''
                }}
                className='hidden'
              />
              <input
                ref={cameraRef}
                type='file'
                accept='image/*'
                capture='environment'
                onChange={event => {
                  selectImage(event.target.files?.[0])
                  event.target.value = ''
                }}
                className='hidden'
              />
              <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-1'>
                <SmallButton primary onClick={() => cameraRef.current?.click()}>
                  📷 现在拍照
                </SmallButton>
                <SmallButton onClick={() => uploadRef.current?.click()}>
                  🖼️ 从相册或电脑选择
                </SmallButton>
                <SmallButton
                  disabled={!image || recognizing}
                  onClick={recognize}
                >
                  {recognizing ? '正在识别…' : '✨ 识别主要食物'}
                </SmallButton>
              </div>
              <p className='mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400'>
                免费模型只能判断照片中的主要食物，无法准确看出重量、油和调料；识别后请核对并调整克数。
              </p>
              {suggestions.length > 0 && (
                <div className='mt-4'>
                  <div className='mb-2 text-xs font-black text-gray-500'>
                    可能是
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {suggestions.map(({ food, probability }) => (
                      <button
                        key={food.id}
                        type='button'
                        onClick={() => addFood(food.id, '图片候选')}
                        className='rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-gray-800 dark:text-emerald-300'
                      >
                        {food.icon} {food.name} {Math.round(probability * 100)}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='rounded-2xl bg-gray-50 p-4 dark:bg-gray-900'>
            <label className='text-sm font-black text-gray-700 dark:text-gray-200'>
              我吃了什么
              <textarea
                value={description}
                onChange={event => setDescription(event.target.value)}
                rows={5}
                placeholder='例如：午饭吃了两碗米饭、150克鸡胸肉、一个鸡蛋和一杯牛奶'
                className='mt-2 w-full resize-y rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-7 text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-emerald-900'
              />
            </label>
            <div className='mt-3 flex flex-wrap gap-2'>
              <SmallButton
                primary
                disabled={!description.trim()}
                onClick={analyzeText}
              >
                分析并加入本餐
              </SmallButton>
              <SmallButton
                onClick={() =>
                  setDescription('两碗米饭、150克鸡胸肉、一个鸡蛋和一份青菜')
                }
              >
                填入示例
              </SmallButton>
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className='mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'>
          {message}
        </div>
      )}

      <div className='mt-6 rounded-2xl border border-gray-200 p-4 dark:border-gray-700'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h3 className='font-black text-gray-900 dark:text-white'>
              本餐清单
            </h3>
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              可以修改重量；热量会自动重新计算。
            </p>
          </div>
          <div className='flex gap-2'>
            <select
              aria-label='选择食物'
              value={selectedFood}
              onChange={event => setSelectedFood(event.target.value)}
              className='min-h-[42px] max-w-[13rem] rounded-xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-800'
            >
              {FOODS.map(food => (
                <option key={food.id} value={food.id}>
                  {food.icon} {food.name}
                </option>
              ))}
            </select>
            <SmallButton onClick={() => addFood(selectedFood)}>
              ＋ 添加
            </SmallButton>
          </div>
        </div>

        <div className='mt-4 space-y-2'>
          {items.length === 0 ? (
            <div className='rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-400 dark:bg-gray-900'>
              识别或添加食物后，热量会显示在这里
            </div>
          ) : (
            items.map(item => {
              const food = findFood(item.foodId)
              const calories = Math.round((food.kcal * item.grams) / 100)
              return (
                <div
                  key={item.key}
                  className='grid items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900 sm:grid-cols-[1fr_auto_auto_auto]'
                >
                  <div className='min-w-0'>
                    <div className='font-black text-gray-800 dark:text-gray-100'>
                      {food.icon} {food.name}
                    </div>
                    <div className='mt-0.5 text-xs text-gray-400'>
                      {item.source} · {food.kcal} 千卡/100克
                    </div>
                  </div>
                  <label className='flex items-center gap-2 text-sm text-gray-500'>
                    <input
                      type='number'
                      min='1'
                      max='5000'
                      value={item.grams}
                      onChange={event =>
                        updateGrams(item.key, event.target.value)
                      }
                      className='h-10 w-20 rounded-lg border border-gray-200 bg-white px-2 text-right font-bold text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
                    />
                    克
                  </label>
                  <div className='min-w-[5.5rem] text-right font-black text-orange-600 dark:text-orange-400'>
                    {calories} 千卡
                  </div>
                  <button
                    type='button'
                    aria-label={`删除${food.name}`}
                    onClick={() =>
                      setItems(current =>
                        current.filter(
                          currentItem => currentItem.key !== item.key
                        )
                      )
                    }
                    className='h-9 w-9 rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40'
                  >
                    ×
                  </button>
                </div>
              )
            })
          )}
        </div>

        <div className='mt-4 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 p-5 text-white sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <div className='text-xs font-black tracking-widest text-white/75'>
              本餐估算热量
            </div>
            <div className='mt-1 text-4xl font-black'>
              {total} <span className='text-lg'>千卡</span>
            </div>
          </div>
          <div className='text-xs leading-5 text-white/85 sm:max-w-sm sm:text-right'>
            建议把结果理解为约 {Math.max(0, Math.round(total * 0.8))}～
            {Math.round(total * 1.2)}{' '}
            千卡；烹饪用油、酱料和实际份量会产生较大差异。
          </div>
        </div>
        {items.length > 0 && (
          <button
            type='button'
            onClick={() => {
              setItems([])
              setSuggestions([])
              setMessage('已清空本餐清单。')
            }}
            className='mt-3 text-xs font-bold text-gray-400 hover:text-red-500'
          >
            清空本餐
          </button>
        )}
      </div>

      <div className='mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200'>
        结果根据常见食物平均值估算，仅用于日常记录，不替代营养师或医生建议。照片在当前浏览器中分析；首次识图需联网下载开源模型，模型下载后可能占用几十
        MB 流量。
      </div>
    </section>
  )
}
